const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const SECRET_API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJtNW1va243bjIyYjA1Zjk4IiwiaWF0IjoxNzUzMjY5NzM1fQ.JfplkFmSPs2iAY16stTYG6RLrlIJO1J2pl-a14ePWnI";
const DATA_FILE_PATH = path.join(__dirname, 'data.txt');

app.use(express.json());

app.get('/', (req, res) => {
    try {
        const message = fs.readFileSync(DATA_FILE_PATH, 'utf8');
        res.send(`
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bot Display</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');
                    body { 
                        font-family: 'Noto Sans KR', sans-serif; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        text-align: center;
                        height: 100vh; 
                        margin: 0;
                        background-color: #1e1e1e; 
                        color: #e0e0e0;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    h1 { 
                        font-size: 3rem; 
                        word-break: break-all;
                    }
                    @media (max-width: 768px) {
                        h1 { font-size: 2rem; }
                    }
                </style>
            </head>
            <body>
                <h1>${message}</h1>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send("데이터 파일을 읽는 중 오류가 발생했습니다.");
    }
});

app.post('/api/update', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${SECRET_API_TOKEN}`) {
        return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }

    // [수정됨] userName과 message를 함께 받습니다.
    const { userName, message } = req.body;
    if (!message) {
        return res.status(400).send({ status: 'error', message: 'No message provided' });
    }

    try {
        fs.writeFileSync(DATA_FILE_PATH, message, 'utf8');
        // [수정됨] 로그에 사용자 이름도 함께 기록합니다.
        console.log(`[${new Date().toLocaleString('ko-KR')}] ${userName}님이 내용 변경: ${message}`);
        res.status(200).send({ status: 'success', message: 'Updated successfully' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Failed to write to file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
