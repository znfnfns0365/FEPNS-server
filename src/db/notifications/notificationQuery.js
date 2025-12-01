export const NOTIFICATION_QUERIES = {
    INSERT_NOTIFICATION:
        'INSERT INTO notifications (user_id, event_id, title, description, is_read, is_sent) VALUES (?, ?, ?, ?, 0, 0)',
    FIND_NOTIFICATIONS_BY_USER:
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    DELETE_NOTIFICATION: 'DELETE FROM notifications WHERE id = ? AND user_id = ?',
};
