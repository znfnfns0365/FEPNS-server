import {
    findKakaoIdByUserId,
    findUserIdByKakaoId,
    insertUserIdByKakaoId,
} from '../../db/users/userDb.js';
import { QUICK_REPLIES } from '../../constant/constants.js';

const USER_ID_REGEX = /^[A-Za-z0-9_]+$/;

const validateUserId = (userId) => {
    if (typeof userId !== 'string') {
        return '아이디가 올바르지 않습니다.';
    }

    if (userId.length < 2 || userId.length > 20) {
        return '아이디는 2~20자의 영문, 숫자, 밑줄만 사용할 수 있습니다.';
    }

    if (!USER_ID_REGEX.test(userId)) {
        return '아이디는 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.';
    }

    return null;
};

export const userRegisterHandler = async (req, res) => {
    const { body } = req;
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
                quickReplies: [QUICK_REPLIES.LOOKUP_ID],
            },
        });
    }
    const userId = body.action?.params?.id;

    const validationError = validateUserId(userId);
    if (validationError) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: validationError,
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_ID],
            },
        });
    }

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
                quickReplies: [QUICK_REPLIES.RETRY_CREATE_ID],
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
            quickReplies: [QUICK_REPLIES.HOME],
        },
    });
};
