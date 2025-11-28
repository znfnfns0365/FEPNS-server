import pools from '../../db/database.js';
import { SQL_QUERIES } from './userQuery.js';

export const findUserIdByKakaoId = async (kakaoId) => {
    const [rows] = await pools.fepns.query(SQL_QUERIES.FIND_USERID_BY_KAKAOID, [kakaoId]);
    return rows[0];
};
