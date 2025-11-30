export const RELATION_QUERIES = {
    INSERT_RELATION: 'INSERT INTO relations (user_id, friend_user_id, list_type) VALUES (?, ?, ?)',
    CHECK_CONFLICTING_RELATION:
        'SELECT list_type FROM relations WHERE user_id = ? AND friend_user_id = ? AND list_type = ?',
};

