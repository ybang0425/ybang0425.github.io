import express from 'express';
const app = express();
const PORT = 3000;

import { response } from './app.js';
import { debugMode } from './debugMode.js';

// 주 코드
app.get('/', (req, res) => {
    // console.log(req.query);

    let query = req.query; // 쿼리 매개변수로 메시지 받기

    const replier = {
        reply(message) {
            // 채팅 메시지를 보냄
            res.send(message);
        }
    }

    if(query.room && query.content && query.name && query.isGroupChat) {
        const error = response(query.room, query.content, query.name, query.isGroupChat, replier, null)
    } else {
        res.send("데이터가 정상적으로 전송되지 않았습니다.");
    }
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 작동 중입니다.`);
    debugMode();
});