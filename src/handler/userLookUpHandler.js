import { findUserIdByKakaoId } from '../users/db/userDb.js';

export const userLookUpHandler = async (req, res) => {
    const kakaoId = req.body.userRequest.user.id;
    const user = await findUserIdByKakaoId(kakaoId);
    if (!user) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '사용자님의 아이디를 찾을 수 없습니다.',
                        },
                    },
                ],
                quickReplies: [
                    {
                        label: '아이디 생성',
                        action: 'message',
                        messageText: 'ID 등록 블록',
                    },
                ],
            },
        });
    }
    console.log(user.user_id + '가 사용자 아이디 조회함');
    return res.status(200).json({
        version: '2.0',
        template: {
            outputs: [
                {
                    simpleText: {
                        text: `사용자님의 아이디: ${user.user_id}`,
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

export default userLookUpHandler;
