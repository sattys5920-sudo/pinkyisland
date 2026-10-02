# 핑키 디저트 아일랜드

14명이 함께 사는 디저트 섬 생활 웹게임이에요. 캐릭터를 만들고, 지붕 색과 집터를 고르고, 집 앞 텃밭에서 토마토를 키우고, 동물 주민 14명과 친해져요.

- 화면: `public/index.html` (게임 전체가 이 파일 하나에 있어요)
- 저장과 실시간 접속: Firebase Realtime Database
- 로그인: Firebase 인증 (구글 / 게스트)
- 배포: `main` 브랜치에 푸시하면 GitHub Actions가 Firebase Hosting에 올려요

## 처음 한 번만 하는 설정

### 1. Firebase 프로젝트 만들기
1. https://console.firebase.google.com 에서 **프로젝트 추가**
2. **Authentication > 시작하기 > 로그인 방법**에서 **Google**과 **익명**을 사용 설정
3. **Realtime Database > 데이터베이스 만들기**
   - 위치: 싱가포르(`asia-southeast1`) 추천
   - **잠금 모드**로 시작 (규칙은 배포할 때 `database.rules.json`으로 덮어써요)
4. **프로젝트 설정(톱니바퀴) > 일반 > 내 앱 > 웹 앱 추가(`</>`)**
   - 나오는 `firebaseConfig` 값을 `public/firebase-config.js`에 붙여 넣어요
   - `databaseURL`이 빠져 있으면 Realtime Database 화면 위쪽 주소를 넣어 주세요
5. `.firebaserc`의 `YOUR_PROJECT_ID`를 내 프로젝트 ID로 바꿔요

### 2. GitHub 자동 배포 연결
1. Firebase **프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성** → JSON 파일이 받아져요
2. GitHub 저장소 **Settings > Secrets and variables > Actions > New repository secret**
   - 이름: `FIREBASE_SERVICE_ACCOUNT`
   - 값: 받은 JSON 파일 내용 전체
3. `main` 브랜치에 푸시하면 자동 배포돼요 (Actions 탭에서 수동 실행도 가능)
4. 주소: `https://<프로젝트ID>.web.app` → 이 주소를 친구들에게 보내면 끝

> 서비스 계정 키는 비밀번호와 같아요. 저장소에 파일로 올리지 말고 시크릿에만 넣어 주세요.

## 내 컴퓨터에서 미리 보기
```
npx firebase-tools emulators:start --only hosting
```
또는 `public` 폴더를 아무 정적 서버로 열어도 돼요. `firebase-config.js`를 채우기 전에는 **혼자 보기 모드**로 실행돼요.

## 무료 요금제(Spark)로 충분할까?
- 동시 접속 100명, 저장 1GB, 다운로드 월 10GB까지 무료예요.
- 움직임은 목적지만 보내고 각자 화면에서 걸어가게 해서 데이터를 아꼈어요. 14명이 하루 몇 시간 노는 정도는 무료 범위 안이에요.
- 사용량은 Firebase 콘솔 **Realtime Database > 사용량**에서 볼 수 있어요.

## 데이터 구조
| 경로 | 내용 |
|---|---|
| `players/<uid>` | 닉네임, 외형, 지붕 색, 집터, 가방, 텃밭, 튜토리얼 단계 |
| `roofs/<0~13>` | 지붕 색 선착순 선점 (입주 안 하고 10분 지나면 풀려요) |
| `lots/<0~13>` | 집터 선착순 선점 |
| `online/<uid>` | 지금 접속 중인 사람의 위치와 이모티콘 (나가면 자동 삭제) |
| `chat` | 채팅 |

지붕 색이 14개뿐이라 섬 주민은 최대 14명이에요. 규칙(`database.rules.json`)이 이걸 서버 쪽에서도 지켜요.

`artifact/pinky-island.html`은 claude.ai Artifact로 만든 첫 시험판이에요. 지금 버전은 `public/`이에요.
