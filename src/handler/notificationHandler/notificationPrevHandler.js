import { findUserSession, updateCurrentPage } from '../../session/user.js';
import { findEventById } from '../../db/events/eventDb.js';
import { QUICK_REPLIES } from '../../constant/constants.js';

export const notificationPrevHandler = async (req, res) => {
    const user = req.user;

    try {
        // 세션 조회
        const session = findUserSession(user.id);
        if (!session || !session.notifications) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '세션이 만료되었습니다. 알림을 다시 조회해주세요.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        const notifications = session.notifications;
        const prevPage = session.currentPage - 1;

        // 이전 페이지가 없는 경우
        if (prevPage < 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '첫 번째 알림입니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME, QUICK_REPLIES.NEXT_NOTIFICATION],
                },
            });
        }

        // 페이지 업데이트
        updateCurrentPage(user.id, prevPage);

        // 이전 알림 조회
        const currentNotification = notifications[prevPage];
        const event = await findEventById(currentNotification.event_id);

        // 날짜 포맷팅
        const eventDate = new Date(event.event_date);
        const formattedDate = `${eventDate.getFullYear()}년 ${eventDate.getMonth() + 1}월 ${eventDate.getDate()}일`;

        // 기본 카드 설명
        let description = `일시: ${formattedDate}`;
        if (event.event_location) {
            description += `\n장소: ${event.event_location}`;
        }
        if (event.event_desc) {
            description += `\n${event.event_desc}`;
        }

        // QuickReplies 생성
        const quickReplies = [];

        // 첫 페이지가 아니면 "이전" 추가
        if (prevPage > 0) {
            quickReplies.push(QUICK_REPLIES.PREV_NOTIFICATION);
        }

        quickReplies.push(QUICK_REPLIES.HOME);

        // 마지막 페이지가 아니면 "다음" 추가
        if (prevPage < notifications.length - 1) {
            quickReplies.push(QUICK_REPLIES.NEXT_NOTIFICATION);
        }

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        basicCard: {
                            title: event.event_title,
                            description: description,
                        },
                    },
                    {
                        simpleText: {
                            text: `📬 알림 ${prevPage + 1}/${notifications.length}`,
                        },
                    },
                ],
                quickReplies: quickReplies,
            },
        });
    } catch (error) {
        console.error('이전 알림 조회 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '알림 조회 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    }
};

