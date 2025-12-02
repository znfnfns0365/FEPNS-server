import {
    getMoneyLogsByTargetUserId,
    getMoneyLogsByTargetName,
    getMoneyObserversByUserId,
    getMoneyObserversByName,
} from '../../db/money/moneyDb.js';
import { findUserByUserId } from '../../db/users/userDb.js';
import { QUICK_REPLIES } from '../../constant/constants.js';

// 영어인지 한글인지 판단하는 함수
const isEnglish = (str) => {
    return /^[a-zA-Z0-9_]+$/.test(str);
};

// 숫자인지 판단하는 함수
const isNumber = (str) => {
    return /^\d+$/.test(str);
};

export const moneyDetailHandler = async (req, res) => {
    const { body } = req;
    const user = req.user;

    const friendId = body.action?.params?.friendId;

    if (!friendId) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '대상자 ID, 이름 또는 번호를 입력해주세요.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    }

    try {
        let logs = [];
        let targetName = friendId;

        // 숫자면 목록에서 해당 인덱스의 대상자 조회
        if (isNumber(friendId)) {
            const index = parseInt(friendId) - 1;

            // 앱 사용자 대상자 조회
            const userObservers = await getMoneyObserversByUserId(user.id);
            // 앱 미사용자 대상자 조회
            const nameObservers = await getMoneyObserversByName(user.id);

            const totalCount = userObservers.length + nameObservers.length;

            if (index < 0 || index >= totalCount) {
                return res.status(200).json({
                    version: '2.0',
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: `유효하지 않은 번호입니다. (1~${totalCount} 사이의 번호를 입력해주세요)`,
                                },
                            },
                        ],
                        quickReplies: [QUICK_REPLIES.HOME],
                    },
                });
            }

            // 인덱스에 해당하는 대상자 찾기
            if (index < userObservers.length) {
                // 앱 사용자
                const observer = userObservers[index];
                logs = await getMoneyLogsByTargetUserId(user.id, observer.target_user_id);
                targetName = observer.target_user_name;
            } else {
                // 앱 미사용자
                const observer = nameObservers[index - userObservers.length];
                logs = await getMoneyLogsByTargetName(user.id, observer.target_name);
                targetName = observer.target_name;
            }
        }

        // 영어면 target_user_id로 조회
        else if (isEnglish(friendId)) {
            // 사용자 존재 여부 확인
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
                        quickReplies: [QUICK_REPLIES.HOME],
                    },
                });
            }

            logs = await getMoneyLogsByTargetUserId(user.id, targetUser.id);
            targetName = logs[0].target_user_name;
        } else {
            // 한글이면 target_name으로 조회
            logs = await getMoneyLogsByTargetName(user.id, friendId);
        }

        if (logs.length === 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: `${targetName}님과의 부조금 기록이 없습니다.`,
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 총 보낸 돈, 받은 돈 계산
        let totalGiven = 0;
        let totalReceived = 0;

        // 목록 생성
        let listText = `📋 ${targetName}와의 부조금 목록\n총 ${logs.length}개\n\n`;

        logs.forEach((log, index) => {
            const logTypeText = log.log_type === 'GIVEN' ? '보냄' : '받음';
            const [year, month, day] = log.event_date.toISOString().split('T')[0].split('-');
            const formattedDate = `${year}년 ${month}월 ${day}일`;

            listText += `${index + 1}. ${targetName}님의 "${
                log.category
            }", ${logTypeText}, ${log.amount.toLocaleString()}원, ${formattedDate}`;

            if (log.memo) {
                listText += `, ${log.memo}`;
            }
            listText += '\n';

            // 합계 계산
            if (log.log_type === 'GIVEN') {
                totalGiven += Number(log.amount);
            } else {
                totalReceived += Number(log.amount);
            }
        });

        listText += `\n총 보낸 돈: ${totalGiven.toLocaleString()}원\n`;
        listText += `총 받은 돈: ${totalReceived.toLocaleString()}원`;

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: listText,
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    } catch (error) {
        console.error('부조금 상세 조회 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '부조금 상세 조회 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    }
};
