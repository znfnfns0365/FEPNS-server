import { QUICK_REPLIES } from '../../constant/constants.js';

export const eventCheckHandler = async (req, res) => {
    const user = req.user;

    return res.status(200).json({
        version: '2.0',
        template: {
            outputs: [
                {
                    simpleText: {
                        text: `경조사를 등록하실 건가요?\n지금까지 등록한 경조사를 볼까요?`,
                    },
                },
            ],
            quickReplies: [
                QUICK_REPLIES.CREATE_EVENT,
                QUICK_REPLIES.VIEW_EVENTS,
                QUICK_REPLIES.HOME,
            ],
        },
    });
};
