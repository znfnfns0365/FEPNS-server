import { insertEvent } from '../../db/events/eventDb.js';
import {
    getNotificationTargets,
    getNotificationTargetsSendOnly,
} from '../../db/relations/relationDb.js';
import {
    insertNotification,
    countNotificationsSentTodayByCreator,
} from '../../db/notifications/notificationDb.js';
import { VALID_EVENT_TYPES, QUICK_REPLIES } from '../../constant/constants.js';
import { getEventThumbnail } from '../../constant/imageUrls.js';

export const eventCreateHandler = async (req, res) => {
    const { body } = req;
    const user = req.user;

    const eventTitle = body.action?.params?.eventTitle;
    const eventTypeKorean = body.action?.params?.eventType; // 한글로 들어옴
    const rawEventDate = body.action?.params?.eventDate;
    const eventLocation = body.action?.params?.eventLocation || null;
    const eventDesc = body.action?.params?.eventDesc || null;
    const sendType = body.action?.params?.sendType || 'sendAll'; // 기본값: sendAll

    let eventDate = null;
    if (rawEventDate) {
        if (typeof rawEventDate === 'string') {
            const parsedDate = JSON.parse(rawEventDate);
            eventDate = parsedDate.value;
        } else if (typeof rawEventDate === 'object' && rawEventDate.value) {
            eventDate = rawEventDate.value;
        }
    }

    // sendType 검증
    if (sendType !== 'Send' && sendType !== 'Send + Curious') {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '전송 유형이 올바르지 않습니다. (onlySendList 또는 sendAll)',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT, QUICK_REPLIES.HOME],
            },
        });
    }

    // 한글 -> 영문 변환
    let eventType = VALID_EVENT_TYPES[eventTypeKorean];

    // eventTitle 검증
    if (!eventTitle || typeof eventTitle !== 'string' || eventTitle.trim().length === 0) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '경조사 제목을 입력해주세요.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT, QUICK_REPLIES.HOME],
            },
        });
    }

    if (eventTitle.length > 200) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '경조사 제목은 200자 이하로 입력해주세요.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT, QUICK_REPLIES.HOME],
            },
        });
    }

    // eventType 검증 >> 직접 입력한 경우 그대로 저장
    if (!eventType) {
        eventType = eventTypeKorean;
    }

    // eventDate 검증
    if (!eventDate) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '경조사 날짜를 입력해주세요.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT, QUICK_REPLIES.HOME],
            },
        });
    }

    // 날짜 형식 검증 (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(eventDate)) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT, QUICK_REPLIES.HOME],
            },
        });
    }

    // 유효한 날짜인지 확인
    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime())) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '유효하지 않은 날짜입니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT, QUICK_REPLIES.HOME],
            },
        });
    }

    try {
        // 이벤트 생성
        const result = await insertEvent(
            user.id,
            eventTitle,
            eventType,
            eventDate,
            eventLocation,
            eventDesc,
        );

        const eventId = result.insertId;

        // 날짜 포맷팅 (YYYY년 MM월 DD일)
        const [year, month, day] = eventDate.split('-');
        const formattedDate = `${year}년 ${month}월 ${day}일`;

        // 알림 대상자 조회 (sendType에 따라 다르게 조회)
        let targets = [];
        if (sendType === 'Send') {
            // SEND 리스트에 있는 사람들만
            targets = await getNotificationTargetsSendOnly(user.id);
        } else {
            // SEND 리스트 + 나를 CURIOUS에 추가한 사람들
            targets = await getNotificationTargets(user.id);
        }

        // 하루 알림 전송 개수 제한 체크 (오늘 보낸 알림 + 지금 보낼 알림)
        const todayNotificationCount = await countNotificationsSentTodayByCreator(user.id);
        const totalNotifications = todayNotificationCount + targets.length;

        if (totalNotifications > 50) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: `하루에 최대 50개까지만 알림을 전송할 수 있습니다.\n오늘 이미 ${todayNotificationCount}개의 알림을 전송했습니다.\n내일 다시 시도해주세요.`,
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 알림 생성
        const notificationTitle = `${user.user_id}님의 ${eventTypeKorean} 소식`;
        let notificationDesc = `${eventTitle}\n일시: ${formattedDate}`;
        if (eventLocation) {
            notificationDesc += `\n장소: ${eventLocation}`;
        }
        if (eventDesc) {
            notificationDesc += `\n${eventDesc}`;
        }

        // 각 대상자에게 알림 생성
        const notificationPromises = targets.map((target) =>
            insertNotification(target.id, eventId, notificationTitle, notificationDesc),
        );

        await Promise.all(notificationPromises);

        console.log(`✅ 이벤트 생성 완료 (ID: ${eventId}), ${targets.length}명에게 알림 전송`);

        // 기본 카드 설명
        let description = `일시: ${formattedDate}`;
        if (eventLocation) {
            description += `\n장소: ${eventLocation}`;
        }
        if (eventDesc) {
            description += `\n내용: ${eventDesc}`;
        }

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        basicCard: {
                            title: `[전송 완료] ${eventTitle}`,
                            description: description,
                            thumbnail: {
                                imageUrl: getEventThumbnail(eventType),
                            },
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    } catch (error) {
        console.error('경조사 생성 중 오류:', error);

        // 중복 경조사 (같은 사용자, 제목, 날짜)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '이미 같은 제목과 날짜로 등록된 경조사가 있습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT, QUICK_REPLIES.HOME],
                },
            });
        }

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '경조사 생성 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT, QUICK_REPLIES.HOME],
            },
        });
    }
};
