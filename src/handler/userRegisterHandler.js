import {
    findKakaoIdByUserId,
    findUserIdByKakaoId,
    insertUserIdByKakaoId,
} from '../users/db/userDb.js';

export const userRegisterHandler = async (req, res) => {
    const { header, body } = req;
    const kakaoId = body.userRequest.user.id;
    const user = await findUserIdByKakaoId(kakaoId);
    if (user) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '이미 아이디가 존재합니다.',
                        },
                    },
                ],
                quickReplies: [
                    {
                        label: '아이디 조회',
                        action: 'message',
                        messageText: 'ID 조회하기',
                    },
                ],
            },
        });
    }
    const userId = body.action.params.id;
    const idCheck = await findKakaoIdByUserId(userId);
    if (idCheck) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '이미 사용중인 아이디입니다.',
                        },
                    },
                ],
                quickReplies: [
                    {
                        label: '아이디 다시 생성하기',
                        action: 'message',
                        messageText: 'ID 생성하기',
                    },
                ],
            },
        });
    }
    await insertUserIdByKakaoId(userId, kakaoId);
    console.log(userId + '로 사용자 아이디 생성함');
    return res.status(200).json({
        version: '2.0',
        template: {
            outputs: [
                {
                    simpleText: {
                        text: `사용자님의 아이디: ${userId}`,
                    },
                },
            ],
            quickReplies: [
                {
                    label: '홈',
                    action: 'message',
                    messageText: '홈',
                },
            ],
        },
    });
};
