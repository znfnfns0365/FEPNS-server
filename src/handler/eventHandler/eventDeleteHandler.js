import { deleteEvent } from '../../db/events/eventDb.js';
import { findUserSession, clearUserSession } from '../../session/user.js';
import { QUICK_REPLIES } from '../../constant/constants.js';
import { getEventThumbnail } from '../../constant/imageUrls.js';

export const eventDeleteHandler = async (req, res) => {
    const user = req.user;

    try {
        // 세션 조회
        const session = findUserSession(user.id);
        if (!session || !session.events || session.type !== 'event') {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '세션이 만료되었습니다. 경조사를 다시 조회해주세요.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        const events = session.events;
        const currentPage = session.currentPage;

        // 현재 페이지의 경조사
        const currentEvent = events[currentPage];

        if (!currentEvent) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '삭제할 경조사를 찾을 수 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // DB에서 경조사 삭제
        const result = await deleteEvent(currentEvent.id, user.id);

        // 삭제된 행이 없는 경우 (권한 없음)
        if (result.affectedRows === 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '경조사 삭제 권한이 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 세션에서 삭제된 항목 제거
        events.splice(currentPage, 1);

        // 남은 경조사가 없는 경우
        if (events.length === 0) {
            clearUserSession(user.id);
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '🗑️ 경조사가 삭제되었습니다.\n더 이상 경조사가 없습니다.',
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
        if (currentPage >= events.length) {
            nextPage = events.length - 1;
        }
        session.currentPage = nextPage;

        // 다음 경조사 표시
        const nextEvent = events[nextPage];

        // 날짜 포맷팅
        const eventDate = new Date(nextEvent.event_date);
        const formattedDate = `${eventDate.getFullYear()}년 ${
            eventDate.getMonth() + 1
        }월 ${eventDate.getDate()}일`;

        // 기본 카드 설명
        let description = `일시: ${formattedDate}`;
        if (nextEvent.event_location) {
            description += `\n장소: ${nextEvent.event_location}`;
        }
        if (nextEvent.event_desc) {
            description += `\n${nextEvent.event_desc}`;
        }

        // QuickReplies 생성
        const quickReplies = [];
        if (nextPage > 0) {
            quickReplies.push(QUICK_REPLIES.PREV_EVENT);
        }
        quickReplies.push(QUICK_REPLIES.HOME);
        if (nextPage < events.length - 1) {
            quickReplies.push(QUICK_REPLIES.NEXT_EVENT);
        }

        // 경조사 삭제
        quickReplies.push(QUICK_REPLIES.DELETE_EVENT);

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '🗑️ 경조사가 삭제되었습니다.',
                        },
                    },
                    {
                        basicCard: {
                            title: nextEvent.event_title,
                            description: description,
                            thumbnail: {
                                imageUrl: getEventThumbnail(nextEvent.event_type),
                            },
                        },
                    },
                    {
                        simpleText: {
                            text: `📅 경조사 ${nextPage + 1}/${events.length}`,
                        },
                    },
                ],
                quickReplies: quickReplies,
            },
        });
    } catch (error) {
        console.error('경조사 삭제 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '경조사 삭제 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    }
};
