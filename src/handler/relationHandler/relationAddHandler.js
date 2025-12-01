import { findUserByUserId } from '../../db/users/userDb.js';
import { insertRelation, checkConflictingRelation } from '../../db/relations/relationDb.js';
import { VALID_LIST_TYPES, QUICK_REPLIES } from '../../constant/constants.js';

export const addRelationHandler = async (req, res) => {
    const { body } = req;
    const user = req.user;

    const friendId = body.action?.params?.friendId;
    const listTypeKorean = body.action?.params?.listType; // 한글로 들어옴

    // 한글 -> 영문 변환
    const listType = VALID_LIST_TYPES[listTypeKorean];

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
                                text: `'${friendId}'님은 이미 보내기 싫은 목록에 있습니다.\n보내고 싶은 목록에 추가하려면 먼저 보내기 싫은 목록에서 제거해주세요.`,
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
                                text: `'${friendId}'님은 이미 보내고 싶은 목록에 있습니다.\n보내기 싫은 목록에 추가하려면 먼저 보내고 싶은 목록에서 제거해주세요.`,
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
        // curious 관계라면 관계 추가 전에 조회 반대로 해서 존재 여부 확인
        await insertRelation(user.id, friend.id, listType);

        // listType에 따른 설명 메시지
        let description = '';
        switch (listType) {
            case 'SEND':
                description = `이제 경조사를 올리면 ${friendId}님에게 알림이 전달됩니다.`;
                break;
            case 'SEND_BLOCK':
                description = `${friendId}님이 나를 궁금한 목록에 추가해놨어도 경조사를 전송하지 않습니다.`;
                break;
            case 'CURIOUS':
                description = `${friendId}님의 보내고 싶은 목록에 없어도 ${friendId}님의 경조사 소식을 알 수 있습니다.`;
                break;
            case 'RECEIVE_BLOCK':
                description = `${friendId}님이 나를 보내고 싶은 목록에 넣어놓고 경조사를 생성해도 알림을 받지 않습니다.`;
                break;
        }

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: `✅ '${friendId}'님을 ${listTypeKorean}에 추가했습니다.\n${description}`,
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
                                text: `이미 ${listTypeKorean}에 추가된 친구입니다.`,
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
