import { FREE_PLAN_LIMITS } from '../constant/limits.js';
import { countFriendsInList } from '../db/relations/relationLimitDb.js';
import { countMoneyLogs } from '../db/money/moneyLimitDb.js';
import { QUICK_REPLIES } from '../constant/constants.js';

// 친구 리스트 제한 체크 (비활성화)
export const checkFriendListLimit = async (req, res, next) => {
    // TODO: 활성화 시 주석 해제
    // const user = req.user;
    // const listType = req.body.action?.params?.listType;
    // const currentCount = await countFriendsInList(user.id, listType);

    // if (currentCount >= FREE_PLAN_LIMITS.MAX_FRIENDS_PER_LIST) {
    //     return res.status(200).json({
    //         version: '2.0',
    //         template: {
    //             outputs: [
    //                 {
    //                     simpleText: {
    //                         text: `각 리스트당 최대 ${FREE_PLAN_LIMITS.MAX_FRIENDS_PER_LIST}명까지만 추가할 수 있습니다.`,
    //                     },
    //                 },
    //             ],
    //             quickReplies: [QUICK_REPLIES.HOME],
    //         },
    //     });
    // }

    next();
};

// 부조금 기록 제한 체크 (비활성화)
export const checkMoneyLogLimit = async (req, res, next) => {
    // TODO: 활성화 시 주석 해제
    // const user = req.user;
    // const currentCount = await countMoneyLogs(user.id);

    // if (currentCount >= FREE_PLAN_LIMITS.MAX_MONEY_LOGS) {
    //     return res.status(200).json({
    //         version: '2.0',
    //         template: {
    //             outputs: [
    //                 {
    //                     simpleText: {
    //                         text: `최대 ${FREE_PLAN_LIMITS.MAX_MONEY_LOGS}개까지만 부조금을 기록할 수 있습니다.`,
    //                     },
    //                 },
    //             ],
    //             quickReplies: [QUICK_REPLIES.HOME],
    //         },
    //     });
    // }

    next();
};

// 나를 궁금해하는 사람들 조회 권한 체크 (비활성화)
export const checkCuriousAboutMePermission = (req, res, next) => {
    // TODO: 활성화 시 주석 해제
    // if (!FREE_PLAN_LIMITS.CAN_VIEW_CURIOUS_ABOUT_ME) {
    //     return res.status(200).json({
    //         version: '2.0',
    //         template: {
    //             outputs: [
    //                 {
    //                     simpleText: {
    //                         text: '나를 궁금해하는 사람들 목록 조회는 제한된 기능입니다.',
    //                     },
    //                 },
    //             ],
    //             quickReplies: [QUICK_REPLIES.HOME],
    //         },
    //     });
    // }

    next();
};
