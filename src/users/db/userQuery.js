export const SQL_QUERIES = {
    FIND_USERID_BY_KAKAOID: 'SELECT * FROM users WHERE kakao_id = ?',
    INSERT_USER:
        'INSERT INTO Users (userId, kakaoId, nickname, faceType, sex, repPhotoId) VALUES (?, ?, ?, ?, ?, ?)',
    FIND_USER_BY_USERID: 'SELECT * FROM Users WHERE userId = ?',
};
