import { findNotificationsByUser } from '../../db/notifications/notificationDb.js';
import { findEventById } from '../../db/events/eventDb.js';
import { initNotificationSession, findUserSession } from '../../session/user.js';
import { QUICK_REPLIES } from '../../constant/constants.js';
import { IMAGE_URLS } from '../../constant/imageUrls.js';

export const notificationViewHandler = async (req, res) => {
    const user = req.user;

    try {
        // 사용자의 모든 알림 조회
        const notifications = await findNotificationsByUser(user.id);

        if (notifications.length === 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '📭 받은 알림이 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 세션 초기화 (알림 목록 저장)
        const session = initNotificationSession(user.id, notifications);

        // 첫 번째 알림 조회
        const currentNotification = notifications[0];
        const event = await findEventById(currentNotification.event_id);

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

        // QuickReplies 생성 (첫 페이지는 "다음"만)
        const quickReplies = [QUICK_REPLIES.HOME];
        if (notifications.length > 1) {
            quickReplies.push(QUICK_REPLIES.NEXT_NOTIFICATION);
        }

        // 알림 삭제
        quickReplies.push(QUICK_REPLIES.READ_NOTIFICATION);

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
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
                            text: `📬 알림 ${session.currentPage + 1}/${notifications.length}`,
                        },
                    },
                ],
                quickReplies: quickReplies,
            },
        });
    } catch (error) {
        console.error('알림 조회 중 오류:', error);
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
