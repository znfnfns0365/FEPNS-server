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
        version: '2.0',
        template: {
            outputs: [
                {
                    simpleText: {
                        text: "가입이 완료되었습니다! \n이제 '히돌'이라는 아이디로 활동합니다.\n\n친구를 등록하거나 경조사를 알려보세요.",
                    },
                },
            ],
            quickReplies: [
                {
                    label: '친구 등록하기',
                    action: 'message',
                    messageText: '친구 등록 방법 알려줘',
                },
                {
                    label: '경조사 알리기',
                    action: 'message',
                    messageText: '경조사 생성할래',
                },
            ],
        },
    });
});

export default router;
