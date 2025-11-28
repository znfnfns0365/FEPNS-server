import { findUserIdByKakaoId } from '../users/db/userDb.js';

export const userLookUpHandler = async (req, res) => {
    console.log(req.body);
    const kakaoId = req.body.body.userRequest.user.id;
    console.log(kakaoId);
    const user = await findUserIdByKakaoId(kakaoId);
    console.log(user);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
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
