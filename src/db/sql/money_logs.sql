CREATE TABLE money_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL COMMENT '기록한 사용자 ID',
    target_user_id BIGINT UNSIGNED NULL COMMENT '대상자가 앱 사용자일 경우 ID',
    target_name VARCHAR(100) NULL COMMENT '대상자 이름 (앱 미사용자 고려)',
    
    category VARCHAR(50) NOT NULL COMMENT '경조사 종류 (결혼식, 장례식 등)',
    log_type ENUM('GIVEN', 'RECEIVED') NOT NULL COMMENT 'GIVEN: 냄, RECEIVED: 받음',
    amount BIGINT NOT NULL COMMENT '금액',
    event_date DATE NOT NULL COMMENT '경조사 날짜',
    memo TEXT COMMENT '비고',
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_money_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_money_target FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_money_user_date (user_id, event_date) -- 날짜별 조회 성능 향상
);