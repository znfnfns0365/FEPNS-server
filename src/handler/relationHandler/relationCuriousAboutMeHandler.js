import { getCuriousAboutMe } from '../../db/relations/relationDb.js';
import { QUICK_REPLIES } from '../../constant/constants.js';

export const relationCuriousAboutMeHandler = async (req, res) => {
    const user = req.user;

    try {
        const curiousPeople = await getCuriousAboutMe(user.id);

        if (curiousPeople.length === 0) {
            return res.status(200).json({
                version: '2.0',
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: '📋 나를 궁금해하는 사람들이 아직 없습니다.',
                            },
                        },
                    ],
                    quickReplies: [QUICK_REPLIES.HOME],
                },
            });
        }

        // 사람 목록 텍스트 생성
        const peopleListText = curiousPeople
            .map((person, index) => `${index + 1}. ${person.user_id}`)
            .join('\n');

        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: `📋 나를 궁금해하는 사람들\n총 ${curiousPeople.length}명\n\n${peopleListText}`,
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    } catch (error) {
        console.error('나를 궁금해하는 사람들 조회 중 오류:', error);
        return res.status(200).json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '조회 중 오류가 발생했습니다.',
                        },
                    },
                ],
                quickReplies: [QUICK_REPLIES.HOME],
            },
        });
    }
};
