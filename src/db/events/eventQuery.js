export const EVENT_QUERIES = {
    INSERT_EVENT:
        'INSERT INTO events (creator_user_id, event_title, event_type, event_date, event_location, event_desc) VALUES (?, ?, ?, ?, ?, ?)',
    FIND_EVENT_BY_ID: 'SELECT * FROM events WHERE id = ?',
    FIND_EVENTS_BY_USER: 'SELECT * FROM events WHERE creator_user_id = ? ORDER BY event_date ASC',
    DELETE_EVENT: 'DELETE FROM events WHERE id = ? AND creator_user_id = ?',
};
