// List Type 상수
export const VALID_LIST_TYPES = ['SEND', 'SEND_BLOCK', 'CURIOUS', 'RECEIVE_BLOCK'];

export const LIST_TYPE_NAMES = {
    SEND: '전송 리스트(Send List)',
    SEND_BLOCK: '전송 차단 리스트(Send Block List)',
    CURIOUS: '궁금 리스트(Curious List)',
    RECEIVE_BLOCK: '수신 차단 리스트(Receive Block List)',
};

// Quick Replies 템플릿
export const QUICK_REPLIES = {
    HOME: {
        label: '홈',
        action: 'message',
        messageText: '홈',
    },
    RETRY_ADD_FRIEND: {
        label: '다시 추가하기',
        action: 'message',
        messageText: '친구 추가',
    },
    CREATE_ID: {
        label: '아이디 생성',
        action: 'message',
        messageText: 'ID 생성하기',
    },
    RETRY_CREATE_ID: {
        label: '아이디 다시 생성하기',
        action: 'message',
        messageText: 'ID 생성하기',
    },
    LOOKUP_ID: {
        label: '아이디 조회',
        action: 'message',
        messageText: 'ID 조회하기',
    },
};

