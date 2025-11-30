import { QUICK_REPLIES } from '../../constant/constants.js';

export const userLookUpHandler = async (req, res) => {
    const user = req.user;
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
            quickReplies: [QUICK_REPLIES.HOME],
        },
    });
};
