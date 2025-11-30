import { findUserByUserId } from '../../db/users/userDb.js';
import { deleteRelation } from '../../db/relations/relationDb.js';
import { VALID_LIST_TYPES, LIST_TYPE_NAMES, QUICK_REPLIES } from '../../constant/constants.js';

export const deleteRelationHandler = async (req, res) => {
    const { body } = req;
    const user = req.user;

    const friendId = body.action?.params?.friendId;
    const listType = body.action?.params?.listType;

    // listType 검증
    if (!listType || !VALID_LIST_TYPES.includes(listType)) {
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
                quickReplies: [QUICK_REPLIES.RETRY_DELETE_FRIEND],
            },
        });
    }

    // friendId 존재 여부 확인
    const friend = await findUserByUserId(friendId);
    if (!friend) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '존재하지 않는 아이디입니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_DELETE_FRIEND],
            },
        });
    }

    // 관계 삭제
    try {
        const result = await deleteRelation(user.id, friend.id, listType);

        // affectedRows가 0이면 해당 목록에 없는 경우
        if (result.affectedRows === 0) {
            const listTypeName = LIST_TYPE_NAMES[listType];
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: `${listTypeName}에 ${friendId}님이 없습니다.`,
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.RETRY_DELETE_FRIEND],
                },
            });
        }

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '🗑️ 정상적으로 삭제되었습니다.',
                        },
                    },
                ],
            },
        });
    } catch (error) {
        console.error('관계 삭제 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '관계 삭제 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_DELETE_FRIEND],
            },
        });
    }
};
