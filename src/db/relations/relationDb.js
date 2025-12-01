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

export const getCuriousAboutMe = async (userId) => {
    const [rows] = await pools.fepns.query(RELATION_QUERIES.GET_CURIOUS_ABOUT_ME, [
        userId,
        'CURIOUS',
    ]);
    return rows;
};

export const deleteRelation = async (userId, friendUserId, listType) => {
    const [result] = await pools.fepns.query(RELATION_QUERIES.DELETE_RELATION, [
        userId,
        friendUserId,
        listType,
    ]);
    return result;
};

export const getNotificationTargets = async (creatorUserId) => {
    const [rows] = await pools.fepns.query(RELATION_QUERIES.GET_NOTIFICATION_TARGETS, [
        creatorUserId,
        creatorUserId,
        creatorUserId,
        creatorUserId,
    ]);
    return rows;
};
