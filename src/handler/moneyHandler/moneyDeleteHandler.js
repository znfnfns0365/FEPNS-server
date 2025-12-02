import { deleteMoneyLogById } from '../../db/money/moneyDb.js';
import { QUICK_REPLIES } from '../../constant/constants.js';
import { findUserSession, initMoneySession, clearUserSession } from '../../session/user.js';

export const moneyDeleteHandler = async (req, res) => {
    const { body } = req;
    const user = req.user;

    const number = body.action?.params?.number;

    if (!number) {
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '삭제할 부조금 기록의 번호를 입력해주세요.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    }

    try {
        // 세션 조회
        const session = findUserSession(user.id);
        if (!session || !session.moneyLogs || session.type !== 'money') {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '세션이 만료되었습니다. 부조금 목록을 다시 조회해주세요.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        const logs = session.moneyLogs;
        const targetName = session.targetName;

        // 삭제할 기록 번호 검증
        const deleteIndex = parseInt(number) - 1;
        if (deleteIndex < 0 || deleteIndex >= logs.length) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: `유효하지 않은 번호입니다. (1~${logs.length} 사이의 번호를 입력해주세요)`,
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        const logToDelete = logs[deleteIndex];

        // 부조금 기록 삭제
        const result = await deleteMoneyLogById(logToDelete.id, user.id);

        if (result.affectedRows === 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '부조금 기록 삭제 권한이 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 세션에서 삭제된 항목 제거
        logs.splice(deleteIndex, 1);

        // 남은 기록이 없는 경우
        if (logs.length === 0) {
            clearUserSession(user.id);
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: `🗑️ 부조금 기록이 삭제되었습니다.\n\n${targetName}님과의 부조금 기록이 더 이상 없습니다.`,
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 남은 기록이 있는 경우 목록 표시
        let totalGiven = 0;
        let totalReceived = 0;
        let listText = `🗑️ 부조금 기록이 삭제되었습니다.\n\n📋 ${targetName}와의 부조금 목록\n총 ${logs.length}개\n\n`;

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

        // 세션 업데이트 (타이머 리셋)
        initMoneySession(user.id, logs, targetName);

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
                quickReplies: [QUICK_REPLIES.DELETE_MONEY, QUICK_REPLIES.HOME],
            },
        });
    } catch (error) {
        console.error('부조금 삭제 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '부조금 삭제 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    }
};
