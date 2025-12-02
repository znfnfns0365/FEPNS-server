import { findUserIdByKakaoId } from '../db/users/userDb.js';
import { clearUserSession } from '../session/user.js';
import { QUICK_REPLIES } from '../constant/constants.js';

export const findUser = async (req, res, next) => {
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
                quickReplies: [QUICK_REPLIES.CREATE_ID],
            },
        });
    }
    req.user = user;

    // 알림/경조사 조회 API가 아닌 다른 API 호출 시 세션 삭제
    const fullPath = req.baseUrl + req.path;
    const isSessionAPI =
        fullPath.includes('/notifications') ||
        fullPath.includes('/events') ||
        fullPath.includes('/money/observers');
    if (!isSessionAPI) {
        clearUserSession(user.id);
    }

    next();
};
