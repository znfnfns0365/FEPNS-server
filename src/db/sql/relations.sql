CREATE TABLE relations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,          
    friend_user_id BIGINT UNSIGNED NOT NULL,  
    list_type ENUM('SEND','SEND_BLOCK','CURIOUS','RECEIVE_BLOCK') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rel_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rel_friend FOREIGN KEY (friend_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_rel_not_self CHECK (user_id <> friend_user_id),
    CONSTRAINT uq_relation_pair_list UNIQUE (user_id, friend_user_id, list_type),
    INDEX idx_rel_user_listtype (user_id, list_type),
    INDEX idx_rel_friend (friend_user_id)
);