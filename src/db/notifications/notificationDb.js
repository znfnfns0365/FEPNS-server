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

export const markAsRead = async (notificationId) => {
    const [result] = await pools.fepns.query(NOTIFICATION_QUERIES.MARK_AS_READ, [notificationId]);
    return result;
};

export const markAsSent = async (notificationId) => {
    const [result] = await pools.fepns.query(NOTIFICATION_QUERIES.MARK_AS_SENT, [notificationId]);
    return result;
};


