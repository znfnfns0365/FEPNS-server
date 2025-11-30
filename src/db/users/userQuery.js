export const USER_QUERIES = {
    FIND_USERID_BY_KAKAOID: 'SELECT * FROM users WHERE kakao_id = ?',
    INSERT_USER: 'INSERT INTO users (user_id, kakao_id) VALUES (?, ?)',
    FIND_KAKAOID_BY_USERID: 'SELECT kakao_id FROM users WHERE user_id = ?',
    FIND_USER_BY_USERID: 'SELECT id FROM users WHERE user_id = ?',
};
