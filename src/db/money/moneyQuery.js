// 부조금 기록 생성
export const INSERT_MONEY_LOG = `
    INSERT INTO money_logs (user_id, target_user_id, target_name, category, log_type, amount, event_date, memo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

// 부조금을 주고받은 대상자 목록 조회 (target_user_id 기준)
export const SELECT_MONEY_OBSERVERS_BY_USER_ID = `
    SELECT DISTINCT 
        target_user_id,
        u.user_id AS target_user_name
    FROM money_logs ml
    LEFT JOIN users u ON ml.target_user_id = u.id
    WHERE ml.user_id = ? AND ml.target_user_id IS NOT NULL
    ORDER BY ml.created_at DESC
`;

// 부조금을 주고받은 대상자 목록 조회 (target_name 기준)
export const SELECT_MONEY_OBSERVERS_BY_NAME = `
    SELECT DISTINCT 
        target_name
    FROM money_logs
    WHERE user_id = ? AND target_name IS NOT NULL
    ORDER BY created_at DESC
`;

// 특정 대상자와의 부조금 내역 조회 (target_user_id 기준)
export const SELECT_MONEY_LOGS_BY_TARGET_USER_ID = `
    SELECT 
        ml.id,
        ml.category,
        ml.log_type,
        ml.amount,
        ml.event_date,
        ml.memo,
        u.user_id AS target_user_name,
        ml.created_at
    FROM money_logs ml
    LEFT JOIN users u ON ml.target_user_id = u.id
    WHERE ml.user_id = ? AND ml.target_user_id = ?
    ORDER BY ml.event_date DESC, ml.created_at DESC
`;

// 특정 대상자와의 부조금 내역 조회 (target_name 기준)
export const SELECT_MONEY_LOGS_BY_TARGET_NAME = `
    SELECT 
        id,
        category,
        log_type,
        amount,
        event_date,
        memo,
        target_name AS target_user_name,
        created_at
    FROM money_logs
    WHERE user_id = ? AND target_name = ?
    ORDER BY event_date DESC, created_at DESC
`;
