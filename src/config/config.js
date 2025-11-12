import { PORT, HOST, JWT_SECRET_KEY } from '../constant/env.js';

export const config = {
    server: {
        port: PORT,
        host: HOST,
    },
    auth: {
        secretKey: JWT_SECRET_KEY,
    },
};
