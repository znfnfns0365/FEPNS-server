CREATE TABLE events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    creator_user_id BIGINT UNSIGNED NOT NULL,
    event_id BIGINT UNSIGNED NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    event_date DATE NOT NULL,
    event_location VARCHAR(255),
    event_desc TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_creator FOREIGN KEY (creator_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_events_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT uq_events_creator_title_date UNIQUE (creator_user_id, event_title, event_date)
);