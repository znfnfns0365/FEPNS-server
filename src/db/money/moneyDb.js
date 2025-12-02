import pools from '../database.js';
import {
    INSERT_MONEY_LOG,
    SELECT_MONEY_OBSERVERS_BY_USER_ID,
    SELECT_MONEY_OBSERVERS_BY_NAME,
    SELECT_MONEY_LOGS_BY_TARGET_USER_ID,
    SELECT_MONEY_LOGS_BY_TARGET_NAME,
    DELETE_MONEY_LOG_BY_ID,
} from './moneyQuery.js';

// 부조금 기록 생성
export const insertMoneyLog = async (
    userId,
    targetUserId,
    targetName,
    category,
    logType,
    amount,
    eventDate,
    memo,
) => {
    const [result] = await pools.fepns.query(INSERT_MONEY_LOG, [
        userId,
        targetUserId,
        targetName,
        category,
        logType,
        amount,
        eventDate,
        memo,
    ]);
    return result;
};

// 부조금을 주고받은 대상자 목록 조회 (앱 사용자)
export const getMoneyObserversByUserId = async (userId) => {
    const [rows] = await pools.fepns.query(SELECT_MONEY_OBSERVERS_BY_USER_ID, [userId]);
    return rows;
};

// 부조금을 주고받은 대상자 목록 조회 (앱 미사용자)
export const getMoneyObserversByName = async (userId) => {
    const [rows] = await pools.fepns.query(SELECT_MONEY_OBSERVERS_BY_NAME, [userId]);
    return rows;
};

// 특정 대상자와의 부조금 내역 조회 (target_user_id 기준)
export const getMoneyLogsByTargetUserId = async (userId, targetUserId) => {
    const [rows] = await pools.fepns.query(SELECT_MONEY_LOGS_BY_TARGET_USER_ID, [
        userId,
        targetUserId,
    ]);
    return rows;
};

// 특정 대상자와의 부조금 내역 조회 (target_name 기준)
export const getMoneyLogsByTargetName = async (userId, targetName) => {
    const [rows] = await pools.fepns.query(SELECT_MONEY_LOGS_BY_TARGET_NAME, [userId, targetName]);
    return rows;
};

// 부조금 기록 삭제
export const deleteMoneyLogById = async (moneyLogId, userId) => {
    const [result] = await pools.fepns.query(DELETE_MONEY_LOG_BY_ID, [moneyLogId, userId]);
    return result;
};
