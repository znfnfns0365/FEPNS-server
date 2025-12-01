export const RELATION_QUERIES = {
    INSERT_RELATION: 'INSERT INTO relations (user_id, friend_user_id, list_type) VALUES (?, ?, ?)',
    CHECK_CONFLICTING_RELATION:
        'SELECT list_type FROM relations WHERE user_id = ? AND friend_user_id = ? AND list_type = ?',
    GET_USERS_BY_LIST_TYPE:
        'SELECT u.user_id FROM relations r JOIN users u ON r.friend_user_id = u.id WHERE r.user_id = ? AND r.list_type = ?',
    GET_CURIOUS_ABOUT_ME:
        'SELECT u.user_id FROM relations r JOIN users u ON r.user_id = u.id WHERE r.friend_user_id = ? AND r.list_type = ?',
    DELETE_RELATION:
        'DELETE FROM relations WHERE user_id = ? AND friend_user_id = ? AND list_type = ?',
    // 이벤트 알림 대상자 조회 (SEND 리스트 + 나를 CURIOUS에 추가한 사람들 - RECEIVE_BLOCK 제외)
    GET_NOTIFICATION_TARGETS: `SELECT DISTINCT u.id, u.user_id
        FROM users u
        WHERE u.id IN (
            -- 내 SEND 리스트에 있는 사람들
            SELECT r.friend_user_id 
            FROM relations r 
            WHERE r.user_id = ? AND r.list_type = 'SEND'
            
            UNION
            
            -- 나를 CURIOUS 리스트에 추가한 사람들
            SELECT r.user_id 
            FROM relations r 
            WHERE r.friend_user_id = ? AND r.list_type = 'CURIOUS'
        )
        -- SEND_BLOCK 제외 (내가 차단한 사람)
        AND u.id NOT IN (
            SELECT r.friend_user_id 
            FROM relations r 
            WHERE r.user_id = ? AND r.list_type = 'SEND_BLOCK'
        )
        -- RECEIVE_BLOCK 제외 (나를 차단한 사람)
        AND u.id NOT IN (
            SELECT r.user_id 
            FROM relations r 
            WHERE r.friend_user_id = ? AND r.list_type = 'RECEIVE_BLOCK'
        )`,
};
