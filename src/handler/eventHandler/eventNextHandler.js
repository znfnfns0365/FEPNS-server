import { findUserSession, updateCurrentPage } from '../../session/user.js';
import { QUICK_REPLIES } from '../../constant/constants.js';
import { IMAGE_URLS } from '../../constant/imageUrls.js';

export const eventNextHandler = async (req, res) => {
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
        const nextPage = session.currentPage + 1;

        // 다음 페이지가 없는 경우
        if (nextPage >= events.length) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '마지막 경조사입니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.PREV_EVENT, QUICK_REPLIES.HOME],
                },
            });
        }

        // 페이지 업데이트
        updateCurrentPage(user.id, nextPage);

        // 다음 경조사 조회
        const currentEvent = events[nextPage];

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

        // QuickReplies 생성
        const quickReplies = [QUICK_REPLIES.PREV_EVENT, QUICK_REPLIES.HOME];

        // 마지막 페이지가 아니면 "다음" 추가
        if (nextPage < events.length - 1) {
            quickReplies.push(QUICK_REPLIES.NEXT_EVENT);
        }

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        basicCard: {
                            title: currentEvent.event_title,
                            description: description,
                            thumbnail: {
                                imageUrl: IMAGE_URLS.FEPNS_MAIN,
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
        console.error('다음 경조사 조회 중 오류:', error);
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
