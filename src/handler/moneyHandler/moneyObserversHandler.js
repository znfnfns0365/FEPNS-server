import { getMoneyObserversByUserId, getMoneyObserversByName } from '../../db/money/moneyDb.js';
import { QUICK_REPLIES } from '../../constant/constants.js';

export const moneyObserversHandler = async (req, res) => {
    const user = req.user;

    try {
        // 앱 사용자 대상자 조회
        const userObservers = await getMoneyObserversByUserId(user.id);

        // 앱 미사용자 대상자 조회
        const nameObservers = await getMoneyObserversByName(user.id);

        // 전체 대상자 수
        const totalCount = userObservers.length + nameObservers.length;

        if (totalCount === 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '📋 부조금 목록\n\n아직 기록된 부조금이 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 목록 생성
        let listText = `📋 부조금 목록\n총 ${totalCount}명\n\n`;

        let index = 1;
        // 앱 사용자 목록
        for (const observer of userObservers) {
            listText += `${index}. ${observer.target_user_name}\n`;
            index++;
        }

        // 앱 미사용자 목록
        for (const observer of nameObservers) {
            listText += `${index}. ${observer.target_name}\n`;
            index++;
        }

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: listText.trim(),
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.MONEY_DETAIL, QUICK_REPLIES.HOME],
            },
        });
    } catch (error) {
        console.error('부조금 목록 조회 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '부조금 목록 조회 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    }
};
