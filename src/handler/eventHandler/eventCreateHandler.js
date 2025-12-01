import { insertEvent } from '../../db/events/eventDb.js';
import { getNotificationTargets } from '../../db/relations/relationDb.js';
import { insertNotification } from '../../db/notifications/notificationDb.js';
import { VALID_EVENT_TYPES, EVENT_TYPE_NAMES, QUICK_REPLIES } from '../../constant/constants.js';

export const eventCreateHandler = async (req, res) => {
    const { body } = req;
    const user = req.user;

    const eventTitle = body.action?.params?.eventTitle;
    const eventType = body.action?.params?.eventType;
    const eventDate = body.action?.params?.eventDate;
    const eventLocation = body.action?.params?.eventLocation || null;
    const eventDesc = body.action?.params?.eventDesc || null;

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
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT],
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
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT],
            },
        });
    }

    // eventType 검증
    if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '잘못된 경조사 유형입니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT],
            },
        });
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
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT],
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
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT],
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
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT],
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

        // 알림 대상자 조회 (SEND 리스트 + 나를 CURIOUS에 추가한 사람들 - 차단 제외)
        const targets = await getNotificationTargets(user.id);

        // 알림 생성
        const eventTypeName = EVENT_TYPE_NAMES[eventType];
        const notificationTitle = `${user.user_id}님의 ${eventTypeName} 소식`;
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
                        },
                    },
                ],
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
                    quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT],
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
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_EVENT],
            },
        });
    }
};
