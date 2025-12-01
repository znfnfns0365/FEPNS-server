import { userSessions } from './session.js';

// 사용자 세션 찾기
export const findUserSession = (userId) => {
    return userSessions.find((session) => session.userId === userId);
};

// 사용자 알림 세션 초기화
export const initNotificationSession = (userId, notifications) => {
    // 기존 세션 제거
    const index = userSessions.findIndex((session) => session.userId === userId);
    if (index !== -1) {
        userSessions.splice(index, 1);
    }

    // 새 세션 생성
    const session = {
        userId: userId,
        notifications: notifications,
        currentPage: 0, // 0-based index
    };
    userSessions.push(session);
    return session;
};

// 현재 페이지 업데이트
export const updateCurrentPage = (userId, newPage) => {
    const session = findUserSession(userId);
    if (!session) {
        throw new Error('Session not found');
    }
    session.currentPage = newPage;
    return session;
};

// 세션 삭제
export const clearUserSession = (userId) => {
    const index = userSessions.findIndex((session) => session.userId === userId);
    if (index !== -1) {
        userSessions.splice(index, 1);
    }
};
