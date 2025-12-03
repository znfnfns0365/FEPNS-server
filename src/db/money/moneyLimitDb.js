import pools from '../database.js';

// 사용자의 부조금 기록 개수 조회
export const countMoneyLogs = async (userId) => {
    const query = 'SELECT COUNT(*) as count FROM money_logs WHERE user_id = ?';
    const [rows] = await pools.fepns.query(query, [userId]);
    return rows[0].count;
};
