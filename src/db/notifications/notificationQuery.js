export const NOTIFICATION_QUERIES = {
    INSERT_NOTIFICATION:
        'INSERT INTO notifications (user_id, event_id, title, description, is_read, is_sent) VALUES (?, ?, ?, ?, 0, 0)',
    FIND_NOTIFICATIONS_BY_USER:
        'SELECT n.*, e.event_date FROM notifications n LEFT JOIN events e ON n.event_id = e.id WHERE n.user_id = ? ORDER BY e.event_date ASC, n.created_at ASC',
    DELETE_NOTIFICATION: 'DELETE FROM notifications WHERE id = ? AND user_id = ?',
};
