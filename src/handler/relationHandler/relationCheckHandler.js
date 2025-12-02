export const relationCheckHandler = async (req, res) => {
    const user = req.user;

    return res.status(200).json({
        version: '2.0',
        template: {
            outputs: [
                {
                    simpleText: {
                        text: `여기서 친구 목록을 관리할 수 있어요!`,
                    },
                },
            ],
            quickReplies: [
                QUICK_REPLIES.CREATE_RELATION,
                QUICK_REPLIES.VIEW_RELATIONS,
                QUICK_REPLIES.DELETE_RELATION,
                QUICK_REPLIES.HOME,
            ],
        },
    });
};
