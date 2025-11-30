import pools from '../database.js';
import { SQL_QUERIES } from './userQuery.js';

export const findUserIdByKakaoId = async (kakaoId) => {
    const [rows] = await pools.fepns.query(SQL_QUERIES.FIND_USERID_BY_KAKAOID, [kakaoId]);
    return rows[0];
};

export const insertUserIdByKakaoId = async (userId, kakaoId) => {
    const [result] = await pools.fepns.query(SQL_QUERIES.INSERT_USER, [userId, kakaoId]);
    return result;
};

export const findKakaoIdByUserId = async (userId) => {
    const [rows] = await pools.fepns.query(SQL_QUERIES.FIND_KAKAOID_BY_USERID, [userId]);
    return rows[0];
};

export const findUserByUserId = async (userId) => {
    const [rows] = await pools.fepns.query(SQL_QUERIES.FIND_USER_BY_USERID, [userId]);
    return rows[0];
};
