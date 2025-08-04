const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'mysql',
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// 기본 라우트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 미니홈피 라우트
app.get('/minihompy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'minihompy.html'));
});

// 방명록 API (기존)
app.get('/api/guestbook', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM guestbook ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('방명록 조회 중 오류 발생:', error);
    res.status(500).json({ message: '데이터를 불러오는 중 서버에 문제가 발생했습니다.' });
  }
});

app.post('/api/guestbook', async (req, res) => {
  const { author, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({ message: '이름과 내용을 모두 입력해주세요.' });
  }

  try {
    const [result] = await connection.query('INSERT INTO guestbook (author, content) VALUES (?, ?)', [author, content]);
    res.status(201).json({ id: result.insertId, author, content });
  } catch (error) {
    console.error('방명록 작성 중 오류 발생:', error);
    res.status(500).json({ message: '데이터를 저장하는 중 서버에 문제가 발생했습니다.' });
  }
});

// 게임 랭킹 API
app.get('/api/ranking', async (req, res) => {
  try {
    // 게임 스코어 테이블이 없으면 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS game_scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        player_name VARCHAR(50) NOT NULL,
        score INT NOT NULL,
        level INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.query(
      'SELECT player_name, MAX(score) as best_score, MAX(level) as best_level FROM game_scores GROUP BY player_name ORDER BY best_score DESC LIMIT 10'
    );
    res.json(rows);
  } catch (error) {
    console.error('랭킹 조회 중 오류 발생:', error);
    res.status(500).json({ message: '랭킹을 불러오는 중 오류가 발생했습니다.' });
  }
});

app.post('/api/ranking', async (req, res) => {
  const { playerName, score, level } = req.body;

  if (!playerName || score === undefined || level === undefined) {
    return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
  }

  try {
    const [result] = await connection.query(
      'INSERT INTO game_scores (player_name, score, level) VALUES (?, ?, ?)',
      [playerName, score, level]
    );
    res.status(201).json({ id: result.insertId, playerName, score, level });
  } catch (error) {
    console.error('점수 저장 중 오류 발생:', error);
    res.status(500).json({ message: '점수를 저장하는 중 오류가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
