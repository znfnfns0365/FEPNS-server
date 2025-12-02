export const moneyCheckHandler = async (req, res) => {
    const user = req.user;

    return res.status(200).json({
        version: '2.0',
        template: {
            outputs: [
                {
                    simpleText: {
                        text: `부조금을 기록 및 조회/삭제하는 공간입니다.`,
                    },
                },
            ],
            quickReplies: [QUICK_REPLIES.CREATE_MONEY, QUICK_REPLIES.VIEW_MONEY, QUICK_REPLIES.HOME],
        },
    });
};

