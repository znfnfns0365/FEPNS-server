-- Enums (참고용 - MySQL에서는 CREATE TABLE 내에서 ENUM 타입으로 사용)
-- event_type: wedding, funeral, firstBirthday, birthday
-- list_type: SEND, SEND_BLOCK, CURIOUS, RECEIVE_BLOCK

DROP TABLE IF EXISTS money_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS relations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;