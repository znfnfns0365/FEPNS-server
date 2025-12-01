export const NOTIFICATION_QUERIES = {
    INSERT_NOTIFICATION:
        'INSERT INTO notifications (user_id, event_id, title, description, is_read, is_sent) VALUES (?, ?, ?, ?, 0, 0)',
    FIND_NOTIFICATIONS_BY_USER:
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    MARK_AS_READ: 'UPDATE notifications SET is_read = 1 WHERE id = ?',
    MARK_AS_SENT: 'UPDATE notifications SET is_sent = 1, delivery_attempts = delivery_attempts + 1 WHERE id = ?',
};


