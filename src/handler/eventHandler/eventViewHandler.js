import { findEventsByUser } from '../../db/events/eventDb.js';
import { initEventSession } from '../../session/user.js';
import { QUICK_REPLIES } from '../../constant/constants.js';
import { getEventThumbnail } from '../../constant/imageUrls.js';

export const eventViewHandler = async (req, res) => {
    const user = req.user;

    try {
        // 사용자가 생성한 모든 경조사 조회
        const events = await findEventsByUser(user.id);

        if (events.length === 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '📭 생성한 경조사가 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 세션 초기화 (경조사 목록 저장)
        const session = initEventSession(user.id, events);

        // 첫 번째 경조사 조회
        const currentEvent = events[0];

        // 날짜 포맷팅
        const eventDate = new Date(currentEvent.event_date);
        const formattedDate = `${eventDate.getFullYear()}년 ${
            eventDate.getMonth() + 1
        }월 ${eventDate.getDate()}일`;

        // 기본 카드 설명
        let description = `일시: ${formattedDate}`;
        if (currentEvent.event_location) {
            description += `\n장소: ${currentEvent.event_location}`;
        }
        if (currentEvent.event_desc) {
            description += `\n${currentEvent.event_desc}`;
        }

        // QuickReplies 생성 (첫 페이지는 "다음"만)
        const quickReplies = [QUICK_REPLIES.HOME];
        if (events.length > 1) {
            quickReplies.push(QUICK_REPLIES.NEXT_EVENT);
        }
        // 경조사 삭제
        quickReplies.push(QUICK_REPLIES.DELETE_EVENT);

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        basicCard: {
                            title: currentEvent.event_title,
                            description: description,
                            thumbnail: {
                                imageUrl: getEventThumbnail(currentEvent.event_type),
                            },
                        },
                    },
                    {
                        simpleText: {
                            text: `📅 경조사 ${session.currentPage + 1}/${events.length}`,
                        },
                    },
                ],
                quickReplies: quickReplies,
            },
        });
    } catch (error) {
        console.error('경조사 조회 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '경조사 조회 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    }
};
