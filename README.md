# test
/*
  '$': 터미널에서 작성하는 명령
  '#main.js': 'main.js'파일의 소스코드
*/

### 만약 소스코드를 받았다면,
- $ npm i
- $ npm start


#### 소스 제작 과정

- Node.js 설치 (https://nodejs.org/ko)
- 사용하고자 하는 폴더의 위치로 간다.
- 해당 위치에서 터미널을 연다 / 혹은 터미널에서 해당 폴더의 위치로 이동한다.
- $ npm init -y
- $ npm i express
- #package.json에 아래 소스 붙여넣기.
```json
{
  "name": "test",
- "main": "index.js", // 기존 코드
+ "main": "main.js",  // 수정된 코드
  "version": "1.0.0",
  "description": "",
- "scripts": {
-   "test": "echo test hi" // 기존 코드
- },
+ "scripts": {
+   "start": "node ." // 수정된 코드
+ }, 
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.21.2"
  }
}

```

- #main.js에 아래 소스 붙여넣기.

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/:msg', (req, res) => {
    let msg = req.params.msg;
    let message = `받은 메시지: ${msg}`;
    res.send(message);
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 작동 중입니다.`);
});
```

- #.gitignore 파일 생성
- #.gitignore 파일에 아래 소스 작성

```gitignore
node_modules/
```

- __npm start로 서버 실행 테스트__
- $ npm start
- 끝