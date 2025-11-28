export const SQL_QUERIES = {
    FIND_USERID_BY_KAKAOID: 'SELECT * FROM users WHERE kakao_id = ?',
    INSERT_USER: 'INSERT INTO Users (user_id, kakao_id) VALUES (?, ?)',
    FIND_KAKAOID_BY_USERID: 'SELECT kakao_id FROM users WHERE user_id = ?',
};
