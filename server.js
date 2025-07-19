// server.js
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// 데이터베이스 연결 설정 (Connection Pool 사용)
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'mysql', // 기본 데이터베이스 이름
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise(); // Promise 기반으로 변경하여 async/await 사용

// 프론트엔드 파일(index.html 등)을 제공하는 폴더 설정
app.use(express.static(path.join(__dirname)));

// 웹사이트의 기본 주소('/')로 접속하면 index.html 파일을 보여줌
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- 방명록 API (Application Programming Interface) ---

// 1. 방명록 글 전체를 가져오는 API
app.get('/api/guestbook', async (req, res) => {
  try {
    // guestbook 테이블에서 모든 데이터를 작성 시간의 내림차순으로 조회
    const [rows] = await connection.query('SELECT * FROM guestbook ORDER BY created_at DESC');
    // 조회된 데이터를 JSON 형태로 응답
    res.json(rows);
  } catch (error) {
    console.error('방명록 조회 중 오류 발생:', error);
    res.status(500).json({ message: '데이터를 불러오는 중 서버에 문제가 발생했습니다.' });
  }
});

// 2. 새로운 방명록 글을 작성하는 API
app.post('/api/guestbook', async (req, res) => {
  // 사용자가 보낸 데이터에서 author와 content를 추출
  const { author, content } = req.body;

  // 이름과 내용이 비어있는지 확인
  if (!author || !content) {
    return res.status(400).json({ message: '이름과 내용을 모두 입력해주세요.' });
  }

  try {
    // guestbook 테이블에 새로운 데이터 삽입
    const [result] = await connection.query('INSERT INTO guestbook (author, content) VALUES (?, ?)', [author, content]);
    // 성공적으로 삽입되었음을 201 상태 코드와 함께 응답
    res.status(201).json({ id: result.insertId, author, content });
  } catch (error) {
    console.error('방명록 작성 중 오류 발생:', error);
    res.status(500).json({ message: '데이터를 저장하는 중 서버에 문제가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
