// server.js
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: process.env.DB_HOST,       // Cloudtype에서 설정할 환경변수
  user: 'root',
  password: process.env.DB_PASSWORD, // Cloudtype에서 설정할 환경변수
  database: 'mysql',
  port: process.env.DB_PORT        // Cloudtype에서 설정할 환경변수
});

connection.connect(err => {
  if (err) {
    console.error('DB 연결 실패: ', err);
    return;
  }
  console.log('DB에 성공적으로 연결되었습니다.');
});

// 프론트엔드 파일(index.html) 제공
app.use(express.static(path.join(__dirname)));

// 기본 접속 경로
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
