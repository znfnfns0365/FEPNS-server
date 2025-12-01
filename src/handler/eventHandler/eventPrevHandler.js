import { findUserSession, updateCurrentPage } from '../../session/user.js';
import { QUICK_REPLIES } from '../../constant/constants.js';

export const eventPrevHandler = async (req, res) => {
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
        const prevPage = session.currentPage - 1;

        // 이전 페이지가 없는 경우
        if (prevPage < 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '첫 번째 경조사입니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME, QUICK_REPLIES.NEXT_NOTIFICATION],
                },
            });
        }

        // 페이지 업데이트
        updateCurrentPage(user.id, prevPage);

        // 이전 경조사 조회
        const currentEvent = events[prevPage];

        // 날짜 포맷팅
        const eventDate = new Date(currentEvent.event_date);
        const formattedDate = `${eventDate.getFullYear()}년 ${eventDate.getMonth() + 1}월 ${eventDate.getDate()}일`;

        // 기본 카드 설명
        let description = `일시: ${formattedDate}`;
        if (currentEvent.event_location) {
            description += `\n장소: ${currentEvent.event_location}`;
        }
        if (currentEvent.event_desc) {
            description += `\n${currentEvent.event_desc}`;
        }

        // QuickReplies 생성
        const quickReplies = [];

        // 첫 페이지가 아니면 "이전" 추가
        if (prevPage > 0) {
            quickReplies.push(QUICK_REPLIES.PREV_NOTIFICATION);
        }

        quickReplies.push(QUICK_REPLIES.HOME);

        // 마지막 페이지가 아니면 "다음" 추가
        if (prevPage < events.length - 1) {
            quickReplies.push(QUICK_REPLIES.NEXT_NOTIFICATION);
        }

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        basicCard: {
                            title: currentEvent.event_title,
                            description: description,
                        },
                    },
                    {
                        simpleText: {
                            text: `📅 경조사 ${prevPage + 1}/${events.length}`,
                        },
                    },
                ],
                quickReplies: quickReplies,
            },
        });
    } catch (error) {
        console.error('이전 경조사 조회 중 오류:', error);
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

