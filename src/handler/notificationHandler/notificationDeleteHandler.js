import { deleteNotification } from '../../db/notifications/notificationDb.js';
import { findEventById } from '../../db/events/eventDb.js';
import { findUserSession, clearUserSession } from '../../session/user.js';
import { QUICK_REPLIES } from '../../constant/constants.js';
import { IMAGE_URLS } from '../../constant/imageUrls.js';

export const notificationDeleteHandler = async (req, res) => {
    const user = req.user;

    try {
        // 세션 조회
        const session = findUserSession(user.id);
        if (!session || !session.notifications || session.type !== 'notification') {
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
        const currentPage = session.currentPage;

        // 현재 페이지의 알림
        const currentNotification = notifications[currentPage];

        if (!currentNotification) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '삭제할 알림을 찾을 수 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // DB에서 알림 삭제
        const result = await deleteNotification(currentNotification.id, user.id);

        // 삭제된 행이 없는 경우 (권한 없음)
        if (result.affectedRows === 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '알림 삭제 권한이 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 세션에서 삭제된 항목 제거
        notifications.splice(currentPage, 1);

        // 남은 알림이 없는 경우
        if (notifications.length === 0) {
            clearUserSession(user.id);
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '🗑️ 알림이 삭제되었습니다.\n더 이상 알림이 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 다음 페이지 결정
        let nextPage = currentPage;
        // 마지막 페이지였으면 이전 페이지로
        if (currentPage >= notifications.length) {
            nextPage = notifications.length - 1;
        }
        session.currentPage = nextPage;

        // 다음 알림 표시
        const nextNotification = notifications[nextPage];
        const event = await findEventById(nextNotification.event_id);

        // 날짜 포맷팅
        const eventDate = new Date(event.event_date);
        const formattedDate = `${eventDate.getFullYear()}년 ${
            eventDate.getMonth() + 1
        }월 ${eventDate.getDate()}일`;

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
        if (nextPage > 0) {
            quickReplies.push(QUICK_REPLIES.PREV_NOTIFICATION);
        }
        quickReplies.push(QUICK_REPLIES.HOME);
        if (nextPage < notifications.length - 1) {
            quickReplies.push(QUICK_REPLIES.NEXT_NOTIFICATION);
        }

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '🗑️ 알림이 삭제되었습니다.',
                        },
                    },
                    {
                        basicCard: {
                            title: event.event_title,
                            description: description,
                            thumbnail: {
                                imageUrl: IMAGE_URLS.FEPNS_MAIN,
                            },
                        },
                    },
                    {
                        simpleText: {
                            text: `📬 알림 ${nextPage + 1}/${notifications.length}`,
                        },
                    },
                ],
                quickReplies: quickReplies,
            },
        });
    } catch (error) {
        console.error('알림 삭제 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '알림 삭제 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    }
};
