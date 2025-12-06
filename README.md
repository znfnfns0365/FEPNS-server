# FEPNS (Friend Event Push Notification Service)

카카오톡 챗봇 기반 경조사 알림 서비스

## 👩‍💻 팀원

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/juwon-G"><sub><b> 팀원 : 권주원 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/znfnfns0365"><sub><b> 팀원 : 김동헌 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/buyanaa"><sub><b> 팀원 : 보이나 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/yoonhaejeong"><sub><b> 팀원 : 정해윤 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

## 📋 목차

-   [프로젝트 소개](#프로젝트-소개)
-   [주요 기능](#주요-기능)
-   [기술 스택](#기술-스택)
-   [시작하기](#시작하기)
-   [API 문서](#api-문서)
-   [데이터베이스 스키마](#데이터베이스-스키마)

## 📎 관련 링크

-   [카카오톡 챗봇](https://pf.kakao.com/_xaxdxdpn)
-   [API 문서 (Notion)](https://www.notion.so/API-2b522672341081798fcdd11e366a4ef9)
-   [DB 다이어그램 (dbdiagram.io)](https://dbdiagram.io/d/67e2d44275d75cc8446bc026)

## 프로젝트 소개

FEPNS는 카카오톡 챗봇을 통해 친구들의 경조사 소식을 관리하고 알림을 받을 수 있는 서비스입니다. 사용자는 친구 목록을 관리하고, 경조사를 등록하면 자동으로 지정된 친구들에게 알림이 전송됩니다.

### 핵심 개념

-   **SEND 리스트**: 내 경조사를 알릴 친구들
-   **SEND_BLOCK 리스트**: 경조사를 알리지 않을 친구들
-   **CURIOUS 리스트**: 내가 궁금해하는 친구들 (친구의 SEND 리스트에 없어도 알림 받음)
-   **RECEIVE_BLOCK 리스트**: 알림을 받지 않을 친구들

## 주요 기능

> ⚠️ **무료 버전 제한 기능**: 각 친구 리스트별 최대 50명, 부조금 기록 최대 100개, 나를 궁금해하는 사람들 조회 불가 등의 제한 기능이 구현되어 있으나, **시연을 위해 현재 비활성화** 상태입니다.

### 👤 사용자 관리

-   카카오 ID 기반 사용자 등록
-   사용자 ID 생성 및 조회
-   사용자 ID 유효성 검증 (2-20자, 영문/숫자/언더바)

### 👥 친구 관계 관리

-   친구를 4가지 리스트에 추가/삭제
    -   SEND: 전송 리스트
    -   SEND_BLOCK: 전송 차단 리스트
    -   CURIOUS: 궁금 리스트
    -   RECEIVE_BLOCK: 수신 차단 리스트
-   리스트별 친구 목록 조회
-   나를 궁금해하는 사람들 조회
-   SEND와 SEND_BLOCK 상호 배타적 관리
-   CURIOUS와 RECEIVE_BLOCK 상호 배타적 관리

### 📅 경조사 관리

-   경조사 등록 (결혼, 장례, 돌잔치, 생일, 직접 입력력)
-   내 경조사 목록 조회 (페이지네이션)
-   경조사 삭제
-   전송 유형 선택 (Send Only / Send + Curious)

### 💰 부조금 관리

-   부조금 기록 추가 (보낸 돈 / 받은 돈)
-   앱 사용자 및 미사용자 대상 id 혹은은 이름으로 기록 가능
-   부조금 목록 조회
-   대상별 부조금 상세 내역 및 합계 조회
-   부조금 기록 삭제

### 🔔 알림 기능

-   경조사 등록 시 자동 알림 전송
-   리스트 타입에 따른 알림 규칙 적용
-   받은 알림 목록 조회 (페이지네이션)
-   알림 삭제 (읽음 처리)

## 기술 스택

### Client

![KakaoTalk](https://img.shields.io/badge/KakaoTalk-FFCD00?style=for-the-badge&logo=kakaotalk&logoColor=black)

-   **카카오톡 챗봇 스킬 서버**: 카카오 i 오픈빌더 기반 챗봇 인터페이스
-   **카카오톡 챗봇 관리자 센터**: 챗봇 시나리오 및 스킬 관리

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)

-   **Runtime**: Node.js (ES Module)
-   **Framework**: Express.js 5.1.0
-   **Database**: MySQL 2 (with connection pooling)
-   **Package Manager**: Yarn

### Infrastructure

![AWS EC2](https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![AWS RDS](https://img.shields.io/badge/Amazon%20RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white)

-   **AWS EC2**: 클라우드 서버 호스팅
-   **AWS RDS**: MySQL 데이터베이스 호스팅

### Tools

![Cursor](https://img.shields.io/badge/Cursor-000000?style=for-the-badge&logo=cursor&logoColor=white)
![Insomnia](https://img.shields.io/badge/Insomnia-4000BF?style=for-the-badge&logo=insomnia&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)

-   **Cursor**: AI 기반 코드 에디터
-   **Insomnia**: API 테스트 및 디버깅 도구
-   **Git**: 버전 관리 시스템
-   **GitHub**: 코드 저장소 및 협업 플랫폼
-   **PM2**: 프로덕션 프로세스 관리자
-   **Nodemon**: 개발 서버 자동 재시작

## 시작하기

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Server
PORT=3000
HOST=localhost

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=fepns
```

### 2. 의존성 설치

```bash
yarn install #(권장)
# or
npm install
```

### 3. 데이터베이스 마이그레이션

```bash
yarn migrate #(권장)
# or
npm run migrate
```

### 4. 서버 실행

**개발 모드** (nodemon 사용):

```bash
yarn dev #(권장)
# or
npm run dev
```

**프로덕션 모드**:

```bash
yarn start #(권장)
# or
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 문서 [(Notion)](https://www.notion.so/API-2b522672341081798fcdd11e366a4ef9)

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

<summary><h3>👤 사용자 관리 API</h3></summary>
<details>

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

</details>

---

<summary><h3>👥 친구 관계 관리 API</h3></summary>
<details>

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

</details>

---

<summary><h3>📅 경조사 관리 API</h3></summary>
<details>

#### POST `/api/events`

경조사 메뉴 진입

**Response:**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "경조사를 등록하실 건가요?\n지금까지 등록한 경조사를 볼까요?"
                }
            }
        ],
        "quickReplies": [
            { "label": "경조사 등록", "action": "message", "messageText": "경조사 등록" },
            { "label": "경조사 조회", "action": "message", "messageText": "경조사 조회" },
            { "label": "홈", "action": "message", "messageText": "홈" }
        ]
    }
}
```

#### POST `/api/events/add`

경조사 등록

**Request:**

```json
{
    "action": {
        "params": {
            "eventTitle": "결혼식",
            "eventType": "결혼",
            "eventDate": "{\"value\": \"2025-12-25\"}",
            "eventLocation": "서울 강남구",
            "eventDesc": "많이 와주세요!",
            "sendType": "Send + Curious"
        }
    }
}
```

**sendType 옵션:**

-   `Send`: SEND 리스트에 있는 사람들에게만 알림
-   `Send + Curious`: SEND 리스트 + 나를 CURIOUS에 추가한 사람들에게 알림

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "basicCard": {
                    "title": "[전송 완료] 결혼식",
                    "description": "일시: 2025년 12월 25일\n장소: 서울 강남구\n내용: 많이 와주세요!",
                    "thumbnail": {
                        "imageUrl": "https://example.com/wedding.png"
                    }
                }
            }
        ],
        "quickReplies": [{ "label": "홈", "action": "message", "messageText": "홈" }]
    }
}
```

#### POST `/api/events/observers`

내 경조사 목록 조회

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "basicCard": {
                    "title": "결혼식",
                    "description": "일시: 2025년 12월 25일\n장소: 서울 강남구",
                    "thumbnail": {
                        "imageUrl": "https://example.com/wedding.png"
                    }
                }
            },
            {
                "simpleText": {
                    "text": "📅 경조사 1/3"
                }
            }
        ],
        "quickReplies": [
            { "label": "홈", "action": "message", "messageText": "홈" },
            { "label": "다음", "action": "message", "messageText": "다음" },
            { "label": "삭제", "action": "message", "messageText": "경조사 삭제" }
        ]
    }
}
```

#### POST `/api/events/observers/next`

다음 경조사 조회 (페이지네이션)

#### POST `/api/events/observers/prev`

이전 경조사 조회 (페이지네이션)

#### POST `/api/events/delete`

현재 조회 중인 경조사 삭제

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "🗑️ 경조사가 삭제되었습니다."
                }
            }
        ],
        "quickReplies": [{ "label": "홈", "action": "message", "messageText": "홈" }]
    }
}
```

</details>

---

<summary><h3>💰 부조금 관리 API</h3></summary>
<details>

#### POST `/api/money`

부조금 메뉴 진입

**Response:**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "부조금을 기록 및 조회/삭제하는 공간입니다."
                }
            }
        ],
        "quickReplies": [
            { "label": "부조금 기록", "action": "message", "messageText": "부조금 기록" },
            { "label": "부조금 조회", "action": "message", "messageText": "부조금 조회" },
            { "label": "홈", "action": "message", "messageText": "홈" }
        ]
    }
}
```

#### POST `/api/money/add`

부조금 기록 추가

**Request:**

```json
{
    "action": {
        "params": {
            "friendId": "friendUserId",
            "logType": "GIVEN",
            "category": "결혼",
            "eventDate": "{\"value\": \"2025-12-25\"}",
            "amount": "50000",
            "memo": "친구 결혼식"
        }
    }
}
```

**logType 옵션:**

-   `GIVEN`: 보낸 부조금
-   `RECEIVED`: 받은 부조금

**friendId:**

-   영문/숫자/언더바: 앱 사용자 ID로 인식
-   한글: 앱 미사용자 이름으로 저장

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "정상적으로 저장되었습니다."
                }
            }
        ],
        "quickReplies": [{ "label": "홈", "action": "message", "messageText": "홈" }]
    }
}
```

#### POST `/api/money/observers/list`

부조금 대상자 목록 조회

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "📋 부조금 목록\n총 3명\n\n1. friend1\n2. friend2\n3. 홍길동"
                }
            }
        ],
        "quickReplies": [
            { "label": "상세 조회", "action": "message", "messageText": "부조금 상세 조회" },
            { "label": "홈", "action": "message", "messageText": "홈" }
        ]
    }
}
```

#### POST `/api/money/observers/detail`

특정 대상자와의 부조금 상세 조회

**Request:**

```json
{
    "action": {
        "params": {
            "friendId": "1"
        }
    }
}
```

**friendId:**

-   숫자: 목록에서 해당 번호의 대상자 조회
-   영문: 앱 사용자 ID로 조회
-   한글: 앱 미사용자 이름으로 조회

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "📋 friend1와의 부조금 목록\n총 2개\n\n1. friend1님의 \"결혼\", 보냄, 50,000원, 2025년 12월 25일\n2. friend1님의 \"돌잔치\", 받음, 30,000원, 2025년 11월 15일\n\n총 보낸 돈: 50,000원\n총 받은 돈: 30,000원"
                }
            }
        ],
        "quickReplies": [
            { "label": "삭제", "action": "message", "messageText": "부조금 삭제" },
            { "label": "홈", "action": "message", "messageText": "홈" }
        ]
    }
}
```

#### POST `/api/money/observers/delete`

부조금 기록 삭제

**Request:**

```json
{
    "action": {
        "params": {
            "number": "1"
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
                    "text": "🗑️ 부조금 기록이 삭제되었습니다."
                }
            }
        ],
        "quickReplies": [{ "label": "홈", "action": "message", "messageText": "홈" }]
    }
}
```

</details>

---

<summary><h3>🔔 알림 관리 API</h3></summary>
<details>

#### POST `/api/notifications/observers`

받은 알림 목록 조회

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "basicCard": {
                    "title": "친구의 결혼식",
                    "description": "일시: 2025년 12월 25일\n장소: 서울 강남구",
                    "thumbnail": {
                        "imageUrl": "https://example.com/wedding.png"
                    }
                }
            },
            {
                "simpleText": {
                    "text": "📬 알림 1/5"
                }
            }
        ],
        "quickReplies": [
            { "label": "홈", "action": "message", "messageText": "홈" },
            { "label": "다음", "action": "message", "messageText": "다음" },
            { "label": "읽음 처리", "action": "message", "messageText": "읽음" }
        ]
    }
}
```

**Response (빈 알림):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "📭 받은 알림이 없습니다."
                }
            }
        ],
        "quickReplies": [{ "label": "홈", "action": "message", "messageText": "홈" }]
    }
}
```

#### POST `/api/notifications/observers/next`

다음 알림 조회 (페이지네이션)

#### POST `/api/notifications/observers/prev`

이전 알림 조회 (페이지네이션)

#### POST `/api/notifications/delete`

현재 조회 중인 알림 삭제 (읽음 처리)

**Response (성공):**

```json
{
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": "🗑️ 알림이 삭제되었습니다."
                }
            }
        ],
        "quickReplies": [{ "label": "홈", "action": "message", "messageText": "홈" }]
    }
}
```

</details>

---

## 데이터베이스 스키마 [(Database Diagram)](https://dbdiagram.io/d/67e2d44275d75cc8446bc026)

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

### Money_logs Table

```sql
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

    INDEX idx_money_user_date (user_id, event_date)
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
│   │   ├── env.js                 # 환경 변수
│   │   └── imageUrls.js           # 이미지 URL 상수
│   ├── db/
│   │   ├── database.js            # DB 연결 풀
│   │   ├── testConnection.js      # DB 연결 테스트
│   │   ├── migration/
│   │   │   └── createSchemas.js   # 마이그레이션 스크립트
│   │   ├── sql/
│   │   │   ├── config.sql
│   │   │   ├── users.sql
│   │   │   ├── relations.sql
│   │   │   ├── events.sql
│   │   │   ├── notifications.sql
│   │   │   └── money.sql
│   │   ├── users/
│   │   │   ├── userDb.js          # 사용자 DB 함수
│   │   │   └── userQuery.js       # 사용자 쿼리
│   │   ├── relations/
│   │   │   ├── relationDb.js      # 관계 DB 함수
│   │   │   └── relationQuery.js   # 관계 쿼리
│   │   ├── events/
│   │   │   ├── eventDb.js         # 경조사 DB 함수
│   │   │   └── eventQuery.js      # 경조사 쿼리
│   │   ├── notifications/
│   │   │   ├── notificationDb.js  # 알림 DB 함수
│   │   │   └── notificationQuery.js # 알림 쿼리
│   │   └── money/
│   │       ├── moneyDb.js         # 부조금 DB 함수
│   │       └── moneyQuery.js      # 부조금 쿼리
│   ├── handler/
│   │   ├── userHandler/
│   │   │   ├── userRegisterHandler.js
│   │   │   └── userLookUpHandler.js
│   │   ├── relationHandler/
│   │   │   ├── relationAddHandler.js
│   │   │   ├── relationCheckHandler.js
│   │   │   ├── relationDeleteHandler.js
│   │   │   ├── relationObserversHandler.js
│   │   │   └── relationCuriousAboutMeHandler.js
│   │   ├── eventHandler/
│   │   │   ├── eventCheckHandler.js
│   │   │   ├── eventCreateHandler.js
│   │   │   ├── eventViewHandler.js
│   │   │   ├── eventNextHandler.js
│   │   │   ├── eventPrevHandler.js
│   │   │   └── eventDeleteHandler.js
│   │   ├── notificationHandler/
│   │   │   ├── notificationViewHandler.js
│   │   │   ├── notificationNextHandler.js
│   │   │   ├── notificationPrevHandler.js
│   │   │   └── notificationDeleteHandler.js
│   │   └── moneyHandler/
│   │       ├── moneyCheckHandler.js
│   │       ├── moneyAddHandler.js
│   │       ├── moneyObserversHandler.js
│   │       ├── moneyDetailHandler.js
│   │       └── moneyDeleteHandler.js
│   ├── middleware/
│   │   └── findUser.js            # 사용자 조회 미들웨어
│   ├── session/
│   │   └── user.js                # 사용자 세션 관리
│   ├── routers/
│   │   ├── health.js              # Health check 라우터
│   │   ├── userRouter.js          # 사용자 라우터
│   │   ├── relationRouter.js      # 관계 라우터
│   │   ├── eventRouter.js         # 경조사 라우터
│   │   ├── notificationRouter.js  # 알림 라우터
│   │   └── moneyRouter.js         # 부조금 라우터
│   ├── init/
│   │   └── index.js               # 초기화 로직
│   └── server.js                  # 서버 진입점
├── package.json
├── .env
└── README.md
```

## 무료 버전 제한 기능 (비활성화 상태)

현재 다음과 같은 제한 기능이 구현되어 있으나, **시연 및 테스트를 위해 비활성화** 되어 있습니다:

### 제한 사항 (`src/constant/limits.js`)

-   **각 친구 리스트별 최대 50명**: SEND, SEND_BLOCK, CURIOUS, RECEIVE_BLOCK 각각 50명까지
-   **부조금 기록 최대 100개**: 총 부조금 내역 100개까지 기록 가능
-   **하루 알림 전송 최대 50개**: 하루에 최대 50개의 알림만 전송 가능
-   **나를 궁금해하는 사람들 조회 불가**: 무료 버전에서는 조회 제한

### 활성화 방법

제한 기능을 활성화하려면 다음 파일들의 TODO 주석을 해제하세요:

1. `src/middleware/checkLimits.js`: 각 제한 체크 로직 주석 해제
2. `src/routers/relationRouter.js`: `checkFriendListLimit` 미들웨어 추가
3. `src/routers/moneyRouter.js`: `checkMoneyLogLimit` 미들웨어 추가

---

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
**버전**: 1.0.1  
**최종 업데이트**: 2025-11-30
