import { PORT, HOST, JWT_SECRET_KEY, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from '../constant/env.js';

export const config = {
    server: {
        port: PORT,
        host: HOST,
    },
    auth: {
        secretKey: JWT_SECRET_KEY,
    },
    db: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
    },
};
