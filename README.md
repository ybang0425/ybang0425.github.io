파스텔 러너 게임 & 미니홈피
CloudType에서 호스팅되는 웹 게임과 미니홈피 프로젝트입니다.
주요 기능
게임 (/)

로그인 시스템 (이름 커스터마이징)
레벨별 다양한 장애물 타입
실시간 랭킹 시스템
모바일/PC 지원

미니홈피 (/minihompy)

방명록 시스템
게임 링크 연동

기술 스택

Frontend: HTML5 Canvas, Vanilla JavaScript
Backend: Node.js, Express
Database: MariaDB (CloudType 제공)
Hosting: CloudType

로컬 개발 환경 설정
bash# 패키지 설치
npm install

# 환경 변수 설정 (.env 파일)
DB_HOST=your_db_host
DB_PASSWORD=your_db_password
DB_PORT=your_db_port

# 개발 서버 실행
npm run dev
데이터베이스 구조
guestbook 테이블

id (INT, PRIMARY KEY, AUTO_INCREMENT)
author (VARCHAR(50))
content (TEXT)
created_at (TIMESTAMP)

game_scores 테이블

id (INT, PRIMARY KEY, AUTO_INCREMENT)
player_name (VARCHAR(50))
score (INT)
level (INT)
created_at (TIMESTAMP)

게임 레벨 시스템

레벨 1: 기본 장애물
레벨 2: 기본 + 높은 장애물
레벨 3: + 날아다니는 장애물
레벨 4: + 이중 장애물
레벨 5+: + 움직이는 장애물

