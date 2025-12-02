import pools from '../database.js';
import { NOTIFICATION_QUERIES } from './notificationQuery.js';

export const insertNotification = async (userId, eventId, title, description) => {
    const [result] = await pools.fepns.query(NOTIFICATION_QUERIES.INSERT_NOTIFICATION, [
        userId,
        eventId,
        title,
        description,
    ]);
    return result;
};

export const findNotificationsByUser = async (userId) => {
    const [rows] = await pools.fepns.query(NOTIFICATION_QUERIES.FIND_NOTIFICATIONS_BY_USER, [
        userId,
    ]);
    return rows;
};

export const deleteNotification = async (notificationId, userId) => {
    const [result] = await pools.fepns.query(NOTIFICATION_QUERIES.DELETE_NOTIFICATION, [
        notificationId,
        userId,
    ]);
    return result;
};

export const countNotificationsSentTodayByCreator = async (creatorUserId) => {
    const [rows] = await pools.fepns.query(
        NOTIFICATION_QUERIES.COUNT_NOTIFICATIONS_SENT_TODAY_BY_CREATOR,
        [creatorUserId],
    );
    return rows[0].count;
};
