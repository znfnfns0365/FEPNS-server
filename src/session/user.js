import { userSessions } from './session.js';

// 세션 타임아웃 (10분)
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10분

// 사용자 세션 찾기
export const findUserSession = (userId) => {
    return userSessions.find((session) => session.userId === userId);
};

// 사용자 알림 세션 초기화
export const initNotificationSession = (userId, notifications) => {
    // 기존 세션 제거 (타이머 포함)
    clearUserSession(userId);

    // 새 세션 생성
    const session = {
        userId: userId,
        type: 'notification', // 세션 타입
        notifications: notifications,
        currentPage: 0, // 0-based index
        timer: null,
    };

    // 10분 타이머 설정
    session.timer = setTimeout(() => {
        console.log(`⏰ 세션 타임아웃: userId=${userId}`);
        clearUserSession(userId);
    }, SESSION_TIMEOUT);

    userSessions.push(session);
    return session;
};

// 사용자 경조사 세션 초기화
export const initEventSession = (userId, events) => {
    // 기존 세션 제거 (타이머 포함)
    clearUserSession(userId);

    // 새 세션 생성
    const session = {
        userId: userId,
        type: 'event', // 세션 타입
        events: events,
        currentPage: 0, // 0-based index
        timer: null,
    };

    // 10분 타이머 설정
    session.timer = setTimeout(() => {
        console.log(`⏰ 세션 타임아웃: userId=${userId}`);
        clearUserSession(userId);
    }, SESSION_TIMEOUT);

    userSessions.push(session);
    return session;
};

// 현재 페이지 업데이트 (타이머 리셋)
export const updateCurrentPage = (userId, newPage) => {
    const session = findUserSession(userId);
    if (!session) {
        throw new Error('Session not found');
    }

    // 기존 타이머 취소
    if (session.timer) {
        clearTimeout(session.timer);
    }

    // 새 타이머 설정 (10분 연장)
    session.timer = setTimeout(() => {
        console.log(`⏰ 세션 타임아웃: userId=${userId}`);
        clearUserSession(userId);
    }, SESSION_TIMEOUT);

    session.currentPage = newPage;
    return session;
};

// 세션 삭제
export const clearUserSession = (userId) => {
    const index = userSessions.findIndex((session) => session.userId === userId);
    if (index !== -1) {
        const session = userSessions[index];
        // 타이머 취소
        if (session.timer) {
            clearTimeout(session.timer);
        }
        userSessions.splice(index, 1);
        console.log(`🗑️  세션 삭제: userId=${userId}`);
    }
};
