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
    return res.status(200).json({ user: user.user_id });
};

export default userLookUpHandler;
