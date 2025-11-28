import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
    console.log(
        '[Health] 요청 수신:',
        JSON.stringify(
            {
                headers: req.headers,
                body: req.body,
            },
            null,
            2,
        ),
    );

    res.status(200).json({
        status: 'ok',
        message: 'FEPNS API is running',
        receivedBody: req.body ?? {},
        timestamp: new Date().toISOString(),
    });
});

export default router;
