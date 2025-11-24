import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: 서버 헬스 체크
 *     responses:
 *       200:
 *         description: 서버가 정상적으로 동작 중임을 나타냅니다.
 */
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'FEPNS API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;

