// List Type 상수
export const VALID_LIST_TYPES = {
    '보내고 싶은 목록': 'SEND',
    '보내기 싫은 목록': 'SEND_BLOCK',
    '궁금한 목록': 'CURIOUS',
    '받기 싫은 목록': 'RECEIVE_BLOCK',
    '나를 궁금해 하는 목록': 'CURIOUS_ABOUT_ME',
};

// Event Type 상수
export const VALID_EVENT_TYPES = {
    결혼식: 'wedding',
    장례식: 'funeral',
    돌잔치: 'firstBirthday',
    생일: 'birthday',
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
    RETRY_LIST_LOOKUP: {
        label: '다시 조회하기',
        action: 'message',
        messageText: '친구 목록',
    },
    RETRY_DELETE_FRIEND: {
        label: '다시 삭제하기',
        action: 'message',
        messageText: '친구 삭제',
    },
    RETRY_CREATE_EVENT: {
        label: '다시 등록하기',
        action: 'message',
        messageText: '경조사 등록',
    },
    NEXT_NOTIFICATION: {
        label: '다음으로',
        action: 'message',
        messageText: '다음 알림',
    },
    PREV_NOTIFICATION: {
        label: '이전으로',
        action: 'message',
        messageText: '이전 알림',
    },
    NEXT_EVENT: {
        label: '다음으로',
        action: 'message',
        messageText: '다음 경조사',
    },
    PREV_EVENT: {
        label: '이전으로',
        action: 'message',
        messageText: '이전 경조사',
    },
    DELETE_EVENT: {
        label: '삭제하기',
        action: 'message',
        messageText: '경조사 삭제',
    },
    READ_NOTIFICATION: {
        label: '읽음',
        action: 'message',
        messageText: '알림 삭제',
    },
    MONEY_DETAIL: {
        label: '상세 조회하기',
        action: 'message',
        messageText: '상세 조회하기',
    },
    RETRY_ADD_MONEY: {
        label: '부조금 다시 기록하기',
        action: 'message',
        messageText: '부조금 기록',
    },
    DELETE_MONEY: {
        label: '삭제하기',
        action: 'message',
        messageText: '부조금 삭제',
    },
    CREATE_EVENT: {
        label: '경조사 등록',
        action: 'message',
        messageText: '경조사 등록',
    },
    VIEW_EVENTS: {
        label: '경조사 목록',
        action: 'message',
        messageText: '경조사 목록',
    },
    CREATE_RELATION: {
        label: '친구 추가',
        action: 'message',
        messageText: '친구 추가',
    },
    VIEW_RELATIONS: {
        label: '친구 목록',
        action: 'message',
        messageText: '친구 목록',
    },
    DELETE_RELATION: {
        label: '친구 삭제',
        action: 'message',
        messageText: '친구 삭제',
    },
    CREATE_MONEY: {
        label: '부조금 기록',
        action: 'message',
        messageText: '부조금 기록',
    },
    VIEW_MONEY: {
        label: '부조금 목록',
        action: 'message',
        messageText: '부조금 목록',
    },
};
