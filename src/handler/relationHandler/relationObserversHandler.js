import { getRelationsByListType } from '../../db/relations/relationDb.js';
import { VALID_LIST_TYPES, QUICK_REPLIES } from '../../constant/constants.js';

export const relationObserversHandler = async (req, res) => {
    const { body } = req;
    const user = req.user;

    const listTypeKorean = body.action?.params?.listType; // 한글로 들어옴

    // 한글 -> 영문 변환
    const listType = VALID_LIST_TYPES[listTypeKorean];

    // listType 검증
    if (!listType) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '잘못된 목록 유형입니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_LIST_LOOKUP],
            },
        });
    }

    try {
        const relations = await getRelationsByListType(user.id, listType);

        if (relations.length === 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: `${listTypeKorean}이(가) 비어있습니다.`,
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 친구 목록 텍스트 생성
        const friendListText = relations
            .map((rel, index) => `${index + 1}. ${rel.user_id}`)
            .join('\n');

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: `📋 ${listTypeKorean}\n총 ${relations.length}명\n\n${friendListText}`,
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    } catch (error) {
        console.error('리스트 조회 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '리스트 조회 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_LIST_LOOKUP],
            },
        });
    }
};
