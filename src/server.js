import express from 'express';
import { createServer } from 'http';
import { config } from './config/config.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { swaggerUi, specs } from './swagger/swagger.js';
import initServer from './init/index.js';
import healthRouter from './routers/health.js';

const app = express();
const server = createServer(app);

const PORT = config.server.port;
const HOST = config.server.host;

// 미들웨어 설정
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: '*',
        exposeHeaders: ['Authorization'],
    }),
);

// swagger 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// init(DB 연동)
await initServer();

// 라우터 설정
app.use('/api/health', healthRouter);

// 서버 시작
server.listen(PORT, () => {
    console.log(`✅ 서버 실행 중: http://${HOST}:${PORT}`);
});
