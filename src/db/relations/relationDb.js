import pools from '../database.js';
import { RELATION_QUERIES } from './relationQuery.js';

export const insertRelation = async (userId, friendUserId, listType) => {
    const [result] = await pools.fepns.query(RELATION_QUERIES.INSERT_RELATION, [
        userId,
        friendUserId,
        listType,
    ]);
    return result;
};

export const checkConflictingRelation = async (userId, friendUserId, listType) => {
    const [rows] = await pools.fepns.query(RELATION_QUERIES.CHECK_CONFLICTING_RELATION, [
        userId,
        friendUserId,
        listType,
    ]);
    return rows[0];
};

export const getRelationsByListType = async (userId, listType) => {
    const [rows] = await pools.fepns.query(RELATION_QUERIES.GET_USERS_BY_LIST_TYPE, [
        userId,
        listType,
    ]);
    return rows;
};
