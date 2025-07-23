const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000; // Cloudtype이 자동으로 포트를 할당합니다.

// 보안: API 토큰을 코드에서 분리하는 것이 좋지만, 이 예제에서는 상수로 정의합니다.
const SECRET_API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJtNW1va243bjIyYjA1Zjk4IiwiaWF0IjoxNzUzMjY5NzM1fQ.JfplkFmSPs2iAY16stTYG6RLrlIJO1J2pl-a14ePWnI";
const DATA_FILE_PATH = path.join(__dirname, 'data.txt');

// POST 요청의 JSON 본문을 파싱하기 위한 미들웨어 설정
app.use(express.json());

// --- 라우트(Route) 설정 ---

/**
 * @route GET /
 * @description 웹 페이지를 렌더링하여 보여줍니다.
 */
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
        console.error("파일 읽기 오류:", error);
        res.status(500).send("데이터 파일을 읽는 중 오류가 발생했습니다.");
    }
});

/**
 * @route POST /api/update
 * @description 봇으로부터 메시지를 수신하여 파일에 저장합니다.
 */
app.post('/api/update', (req, res) => {
    // 1. 인증 헤더 확인
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${SECRET_API_TOKEN}`) {
        console.warn("인증 실패:", authHeader);
        return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }

    // 2. 요청 본문에서 메시지 추출
    const { message } = req.body;
    if (!message) {
        return res.status(400).send({ status: 'error', message: 'No message provided' });
    }

    // 3. 파일에 내용 쓰기 (동기 방식)
    try {
        fs.writeFileSync(DATA_FILE_PATH, message, 'utf8');
        console.log(`[${new Date().toLocaleString('ko-KR')}] 웹 페이지 내용 변경: ${message}`);
        res.status(200).send({ status: 'success', message: 'Updated successfully' });
    } catch (error) {
        console.error("파일 쓰기 오류:", error);
        res.status(500).send({ status: 'error', message: 'Failed to write to file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
