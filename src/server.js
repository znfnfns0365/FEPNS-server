import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { config } from './config/config.js';
import initServer from './init/index.js';
import healthRouter from './routers/health.js';
import userRouter from './routers/userRouter.js';
import relationRouter from './routers/relationRouter.js';
import eventRouter from './routers/eventRouter.js';
import notificationRouter from './routers/notificationRouter.js';
import moneyRouter from './routers/moneyRouter.js';

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

// 정적 파일 제공 (이미지)
app.use('/images', express.static('src/image'));

// init(DB 연동)
await initServer();

// 라우터 설정
app.use('/api/health', healthRouter);
app.use('/api/users', userRouter);
app.use('/api/relations', relationRouter);
app.use('/api/events', eventRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/money', moneyRouter);

// 서버 시작
server.listen(PORT, () => {
    console.log(`✅ 서버 실행 중: http://${HOST}:${PORT}`);
});
