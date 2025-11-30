import { findUserByUserId } from '../../db/users/userDb.js';
import { insertRelation, checkConflictingRelation } from '../../db/relations/relationDb.js';
import { VALID_LIST_TYPES, LIST_TYPE_NAMES, QUICK_REPLIES } from '../../constant/constants.js';

export const addRelationHandler = async (req, res) => {
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
                quickReplies: [QUICK_REPLIES.RETRY_ADD_FRIEND],
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
                quickReplies: [QUICK_REPLIES.RETRY_ADD_FRIEND],
            },
        });
    }

    // SEND와 SEND_BLOCK 상호 배타적 체크
    if (listType === 'SEND') {
        const conflicting = await checkConflictingRelation(user.id, friend.id, 'SEND_BLOCK');
        if (conflicting) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: `'${friendId}'님은 이미 전송 차단 리스트에 있습니다.\n전송 리스트에 추가하려면 먼저 전송 차단 리스트에서 제거해주세요.`,
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }
    } else if (listType === 'SEND_BLOCK') {
        const conflicting = await checkConflictingRelation(user.id, friend.id, 'SEND');
        if (conflicting) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: `'${friendId}'님은 이미 전송 리스트에 있습니다.\n전송 차단 리스트에 추가하려면 먼저 전송 리스트에서 제거해주세요.`,
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }
    }

    // 관계 추가
    try {
        await insertRelation(user.id, friend.id, listType);
        const listTypeName = LIST_TYPE_NAMES[listType];

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: `✅ '${friendId}'님을 ${listTypeName}에 추가했습니다.\n이제 경조사를 올리면 ${friendId}님에게 알림이 전달됩니다.`,
                        },
                    },
                ],
            },
        });
    } catch (error) {
        // 중복 관계 에러 처리 (UNIQUE 제약: user_id, friend_user_id, list_type)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: `이미 ${LIST_TYPE_NAMES[listType]}에 추가된 친구입니다.`,
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.RETRY_ADD_FRIEND],
                },
            });
        }

        // CHECK 제약 위반 (자기 자신 추가 시도)
        if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '자기 자신을 친구로 추가할 수 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.RETRY_ADD_FRIEND],
                },
            });
        }

        console.error('관계 추가 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '관계 추가 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_ADD_FRIEND],
            },
        });
    }
};
