# FEPNS (Friend Event Push Notification Service)

카카오톡 챗봇 기반 경조사 알림 서비스

## 📋 목차

-   [프로젝트 소개](#프로젝트-소개)
-   [주요 기능](#주요-기능)
-   [기술 스택](#기술-스택)
-   [시작하기](#시작하기)
-   [API 문서](#api-문서)
-   [데이터베이스 스키마](#데이터베이스-스키마)

## 프로젝트 소개

FEPNS는 카카오톡 챗봇을 통해 친구들의 경조사 소식을 관리하고 알림을 받을 수 있는 서비스입니다. 사용자는 친구 목록을 관리하고, 경조사를 등록하면 자동으로 지정된 친구들에게 알림이 전송됩니다.

### 핵심 개념

-   **SEND 리스트**: 내 경조사를 알릴 친구들
-   **SEND_BLOCK 리스트**: 경조사를 알리지 않을 친구들
-   **CURIOUS 리스트**: 내가 궁금해하는 친구들 (친구의 SEND 리스트에 없어도 알림 받음)
-   **RECEIVE_BLOCK 리스트**: 알림을 받지 않을 친구들

## 주요 기능

### 👤 사용자 관리

-   카카오 ID 기반 사용자 등록
-   사용자 ID 생성 및 조회
-   사용자 ID 유효성 검증 (2-20자, 영문/숫자/언더스코어)

### 👥 친구 관계 관리

-   친구를 4가지 리스트에 추가/삭제
    -   SEND: 전송 리스트
    -   SEND_BLOCK: 전송 차단 리스트
    -   CURIOUS: 궁금 리스트
    -   RECEIVE_BLOCK: 수신 차단 리스트
-   리스트별 친구 목록 조회
-   나를 궁금해하는 사람들 조회
-   SEND와 SEND_BLOCK 상호 배타적 관리

### 🔔 알림 기능

-   경조사 등록 시 자동 알림 전송
-   리스트 타입에 따른 알림 규칙 적용

## 기술 스택

### Backend

-   **Runtime**: Node.js (ES Module)
-   **Framework**: Express.js 5.1.0
-   **Database**: MySQL 2 (with connection pooling)
-   **Authentication**: JWT (jsonwebtoken)

### Dependencies

-   `mysql2`: MySQL 데이터베이스 연결
-   `express`: 웹 프레임워크
-   `cors`: CORS 미들웨어
-   `dotenv`: 환경 변수 관리
-   `bcrypt`: 비밀번호 암호화
-   `axios`: HTTP 클라이언트
-   `multer`: 파일 업로드
-   `@aws-sdk/client-s3`: AWS S3 연동

### Dev Dependencies

-   `nodemon`: 개발 서버 자동 재시작

## 시작하기

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Server
PORT=3000
HOST=localhost

# JWT
JWT_SECRET_KEY=your_secret_key_here

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=fepns
```

### 2. 의존성 설치

```bash
yarn install
# or
npm install
```

### 3. 데이터베이스 마이그레이션

```bash
yarn migrate
# or
npm run migrate
```

### 4. 서버 실행

**개발 모드** (nodemon 사용):

```bash
yarn dev
# or
npm run dev
```

**프로덕션 모드**:

```bash
yarn start
# or
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 문서

### Health Check

#### POST `/api/health`

서버 상태 확인

**Response:**

```json
{
    "status": "OK",
    "timestamp": "2025-11-30T12:00:00.000Z"
}
```

---

### 사용자 관리

#### POST `/api/users/register`

사용자 ID 생성

**Request:**

```json
{
    "action": {
        "params": {
            "userId": "myUserId123"
        }
    }
}
```

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "✅ 아이디가 성공적으로 생성되었습니다!\n당신의 아이디: myUserId123"
                }
            }
        ]
    }
}
```

**Response (중복):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "이미 사용 중인 아이디입니다."
                }
            }
        ],
        "quickReplies": [
            {
                "label": "아이디 다시 생성하기",
                "action": "message",
                "messageText": "ID 생성하기"
            }
        ]
    }
}
```

#### POST `/api/users/lookup`

사용자 ID 조회

**Response:**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "당신의 아이디: myUserId123"
                }
            }
        ]
    }
}
```

---

### 친구 관계 관리

#### POST `/api/relations/add`

친구를 리스트에 추가

**Request:**

```json
{
    "action": {
        "params": {
            "friendId": "friendUserId",
            "listType": "SEND"
        }
    }
}
```

**listType 옵션:**

-   `SEND`: 전송 리스트
-   `SEND_BLOCK`: 전송 차단 리스트
-   `CURIOUS`: 궁금 리스트
-   `RECEIVE_BLOCK`: 수신 차단 리스트

**Response (성공 - SEND):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "✅ 'friendUserId'님을 전송 리스트(Send List)에 추가했습니다.\n이제 경조사를 올리면 friendUserId님에게 알림이 전달됩니다."
                }
            }
        ]
    }
}
```

**Response (성공 - SEND_BLOCK):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "✅ 'friendUserId'님을 전송 차단 리스트(Send Block List)에 추가했습니다.\nfriendUserId님이 나를 궁금 리스트에 추가해놨어도 경조사를 전송하지 않습니다."
                }
            }
        ]
    }
}
```

**Response (성공 - CURIOUS):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "✅ 'friendUserId'님을 궁금 리스트(Curious List)에 추가했습니다.\nfriendUserId님의 전송 리스트에 없어도 friendUserId님의 경조사 소식을 알 수 있습니다."
                }
            }
        ]
    }
}
```

**Response (성공 - RECEIVE_BLOCK):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "✅ 'friendUserId'님을 수신 차단 리스트(Receive Block List)에 추가했습니다.\nfriendUserId님이 나를 전송 리스트에 넣어놓고 경조사를 생성해도 알림을 받지 않습니다."
                }
            }
        ]
    }
}
```

#### POST `/api/relations/delete`

친구를 리스트에서 삭제

**Request:**

```json
{
    "action": {
        "params": {
            "friendId": "friendUserId",
            "listType": "SEND"
        }
    }
}
```

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "🗑️ 정상적으로 삭제되었습니다."
                }
            }
        ]
    }
}
```

**Response (목록에 없음):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "전송 리스트(Send List)에 friendUserId님이 없습니다."
                }
            }
        ],
        "quickReplies": [
            {
                "label": "다시 삭제하기",
                "action": "message",
                "messageText": "친구 삭제"
            }
        ]
    }
}
```

#### POST `/api/relations/observers`

리스트별 친구 목록 조회

**Request:**

```json
{
    "action": {
        "params": {
            "listType": "SEND"
        }
    }
}
```

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "📋 전송 리스트(Send List)\n총 2명\n\n1. friend1\n2. friend2"
                }
            }
        ],
        "quickReplies": [
            {
                "label": "홈",
                "action": "message",
                "messageText": "홈"
            }
        ]
    }
}
```

**Response (빈 리스트):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "전송 리스트(Send List)이(가) 비어있습니다."
                }
            }
        ],
        "quickReplies": [
            {
                "label": "홈",
                "action": "message",
                "messageText": "홈"
            }
        ]
    }
}
```

#### POST `/api/relations/curiousAboutMe`

나를 궁금해하는 사람들 조회

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "📋 나를 궁금해하는 사람들\n총 1명\n\n1. someUserId"
                }
            }
        ],
        "quickReplies": [
            {
                "label": "홈",
                "action": "message",
                "messageText": "홈"
            }
        ]
    }
}
```

**Response (없음):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "📋 나를 궁금해하는 사람들이 아직 없습니다."
                }
            }
        ],
        "quickReplies": [
            {
                "label": "홈",
                "action": "message",
                "messageText": "홈"
            }
        ]
    }
}
```

---

## 데이터베이스 스키마

### Users Table

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    kakao_id VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_users_userid_len CHECK (CHAR_LENGTH(user_id) BETWEEN 2 AND 20),
    CONSTRAINT chk_users_userid_chars CHECK (user_id REGEXP '^[A-Za-z0-9_]+$')
);
```

### Relations Table

```sql
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
```

### Events Table

```sql
CREATE TABLE events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    creator_user_id BIGINT UNSIGNED NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    event_type ENUM('wedding','funeral','firstBirthday','birthday') NOT NULL,
    event_date DATE NOT NULL,
    event_location VARCHAR(255),
    event_desc TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_creator FOREIGN KEY (creator_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_event_user_title_date UNIQUE (creator_user_id, event_title, event_date)
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    event_id BIGINT UNSIGNED,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    response_payload JSON,
    is_read TINYINT NOT NULL DEFAULT 0,
    is_sent TINYINT NOT NULL DEFAULT 0,
    scheduled_at DATETIME,
    delivery_attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    INDEX idx_notif_user_created (user_id, created_at)
);
```

## 프로젝트 구조

```
FEPNS/
├── src/
│   ├── config/
│   │   └── config.js              # 설정 파일
│   ├── constant/
│   │   ├── constants.js           # 상수 정의
│   │   └── env.js                 # 환경 변수
│   ├── db/
│   │   ├── database.js            # DB 연결 풀
│   │   ├── testConnection.js     # DB 연결 테스트
│   │   ├── migration/
│   │   │   └── createSchemas.js  # 마이그레이션 스크립트
│   │   ├── sql/
│   │   │   ├── config.sql
│   │   │   ├── users.sql
│   │   │   ├── relations.sql
│   │   │   ├── events.sql
│   │   │   └── notifications.sql
│   │   ├── users/
│   │   │   ├── userDb.js         # 사용자 DB 함수
│   │   │   └── userQuery.js      # 사용자 쿼리
│   │   └── relations/
│   │       ├── relationDb.js     # 관계 DB 함수
│   │       └── relationQuery.js  # 관계 쿼리
│   ├── handler/
│   │   ├── userHandler/
│   │   │   ├── userRegisterHandler.js
│   │   │   └── userLookUpHandler.js
│   │   └── relationHandler/
│   │       ├── relationAddHandler.js
│   │       ├── relationDeleteHandler.js
│   │       ├── relationObserversHandler.js
│   │       └── relationCuriousAboutMeHandler.js
│   ├── middleware/
│   │   └── findUser.js           # 사용자 조회 미들웨어
│   ├── routers/
│   │   ├── health.js             # Health check 라우터
│   │   ├── userRouter.js         # 사용자 라우터
│   │   └── relationRouter.js     # 관계 라우터
│   ├── init/
│   │   └── index.js              # 초기화 로직
│   └── server.js                 # 서버 진입점
├── package.json
├── .env
└── README.md
```

## 에러 처리

모든 API는 카카오톡 챗봇 형식의 응답을 반환합니다:

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "에러 메시지"
                }
            }
        ],
        "quickReplies": [
            {
                "label": "재시도 버튼",
                "action": "message",
                "messageText": "재시도 명령"
            }
        ]
    }
}
```

## 라이선스

MIT License

## 기여

이 프로젝트는 데이터베이스 응용 수업의 일환으로 개발되었습니다.

---

**개발자**: FEPNS Team  
**버전**: 1.0.0  
**최종 업데이트**: 2025-11-30
