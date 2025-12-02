import { insertMoneyLog } from '../../db/money/moneyDb.js';
import { findUserByUserId } from '../../db/users/userDb.js';
import { QUICK_REPLIES } from '../../constant/constants.js';

// 영어인지 한글인지 판단하는 함수
const isEnglish = (str) => {
    return /^[a-zA-Z0-9_]+$/.test(str);
};

export const moneyAddHandler = async (req, res) => {
    const { body } = req;
    const user = req.user;

    const friendId = body.action?.params?.friendId;
    const logType = body.action?.params?.logType;
    const category = body.action?.params?.category;
    const eventDate = body.action?.params?.eventDate;
    const amount = body.action?.params?.amount;
    const memo = body.action?.params?.memo || null;

    // 필수 파라미터 검증
    if (!friendId) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '대상자 ID 또는 이름을 입력해주세요.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_ADD_MONEY, QUICK_REPLIES.HOME],
            },
        });
    }

    if (!logType || (logType !== 'GIVEN' && logType !== 'RECEIVED')) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '유형을 올바르게 입력해주세요. (GIVEN 또는 RECEIVED)',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_ADD_MONEY, QUICK_REPLIES.HOME],
            },
        });
    }

    if (!category) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '경조사 종류를 입력해주세요.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_ADD_MONEY, QUICK_REPLIES.HOME],
            },
        });
    }

    if (!eventDate) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '경조사 날짜를 입력해주세요.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_ADD_MONEY, QUICK_REPLIES.HOME],
            },
        });
    }

    // 날짜 형식 검증 (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(eventDate)) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_ADD_MONEY, QUICK_REPLIES.HOME],
            },
        });
    }

    if (!amount) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '금액을 입력해주세요.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_ADD_MONEY, QUICK_REPLIES.HOME],
            },
        });
    }

    // 금액 검증
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '유효한 금액을 입력해주세요.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_ADD_MONEY, QUICK_REPLIES.HOME],
            },
        });
    }

    try {
        let targetUserId = null;
        let targetName = null;

        // 영어면 target_user_id로 저장
        if (isEnglish(friendId)) {
            const targetUser = await findUserByUserId(friendId);
            if (!targetUser) {
                return res.status(200).json({
                    version: '2.0',
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: '존재하지 않는 사용자입니다.',
                                },
                            },
                        ],
                        quickReplies: [QUICK_REPLIES.RETRY_ADD_MONEY, QUICK_REPLIES.HOME],
                    },
                });
            }
            targetUserId = targetUser.id;
        } else {
            // 한글이면 target_name으로 저장
            targetName = friendId;
        }

        // 부조금 기록 생성
        await insertMoneyLog(
            user.id,
            targetUserId,
            targetName,
            category,
            logType,
            parsedAmount,
            eventDate,
            memo,
        );

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '정상적으로 저장되었습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    } catch (error) {
        console.error('부조금 생성 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '부조금 생성 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.RETRY_ADD_MONEY, QUICK_REPLIES.HOME],
            },
        });
    }
};

