import pools from '../database.js';

// 특정 리스트의 친구 수 조회
export const countFriendsInList = async (userId, listType) => {
    const query = 'SELECT COUNT(*) as count FROM relations WHERE user_id = ? AND list_type = ?';
    const [rows] = await pools.fepns.query(query, [userId, listType]);
    return rows[0].count;
};
