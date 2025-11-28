import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { config } from './config/config.js';
import initServer from './init/index.js';
import healthRouter from './routers/health.js';
import userLookUpRouter from './routers/userLookUpRouter.js';
import userRegisterRouter from './routers/userRegisterRouter.js';

const app = express();
const server = createServer(app);

const PORT = config.server.port;
const HOST = config.server.host;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: '*',
        exposeHeaders: ['Authorization'],
    }),
);

// init(DB 연동)
await initServer();

// 라우터 설정
app.use('/api/health', healthRouter);
app.use('/api/users/lookup', userLookUpRouter);
app.use('/api/users/register', userRegisterRouter);
// 서버 시작
server.listen(PORT, () => {
    console.log(`✅ 서버 실행 중: http://${HOST}:${PORT}`);
});
