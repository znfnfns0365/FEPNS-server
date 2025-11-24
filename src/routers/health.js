import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   post:
 *     tags:
 *       - Health
 *     summary: 서버 헬스 체크 (POST)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 서버가 정상적으로 동작 중임을 나타냅니다.
 */
router.post('/', (req, res) => {
    console.log('[Health] 요청 수신:', {
        headers: req.headers,
        body: req.body,
    });

    res.status(200).json({
        status: 'ok',
        message: 'FEPNS API is running',
        receivedBody: req.body ?? {},
        timestamp: new Date().toISOString(),
    });
});

export default router;
