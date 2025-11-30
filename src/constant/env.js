import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// DB 환경 변수
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;

// 필수 DB 환경 변수 검증
const requiredDbEnvVars = {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
};
