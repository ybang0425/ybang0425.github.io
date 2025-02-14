import fetch from 'node-fetch'; // Node.js 18 이상은 내장 fetch 사용 가능
import readline from 'readline';

const env = {
  content: "",
  room: "방이름",
  author: "사용자",
  name: "사용자이름",
  avatar: "프로필",
  getBase64: "프로필데이터",
  isGroupChat: "그룹챗인가?",
  isDebugRoom: "디버그룸인가?",
  packageName: "패키지네임"
}

export function debugMode() {
  let msg = env.content;

  if(process.env.DEBUG) {
    // 인터페이스 설정 (입력 및 출력 스트림)
    const rl = readline.createInterface({
      input: process.stdin, // 표준 입력 (터미널)
      output: process.stdout // 표준 추력 (터미널)
    });

    // 반복적인 입력을 처리하는 함수
    const askQuestion = () => {
      rl.question("채팅을 입력하세요 (exit을 입력해서 종료): ", (msg) => {
        if (msg === "exit") {
          // "exit" 입력 시 인터페이스 종료
          console.log('프로그램을 종료합니다.');
          rl.close();
          process.exit(0);
        }

        // fetch 요청 실행
        fetch("http://localhost:3000/"+
        "?content="+msg+
        "&room="+env.room+
        "&author="+env.author+
        "&name="+env.name+
        "&avatar="+env.avatar+
        "&getBase64="+env.getBase64+
        "&isGroupChat="+env.isGroupChat+
        "&isDebugRoom="+env.isDebugRoom+
        "&packageName="+env.packageName)
          .then(response => response.text()) // 응답 데이터를 텍스트로 변환
          .then(data => {
            console.log('Text Data:', data);
            // fetch 요청 후 다시 입력 받기
            askQuestion(); // 재귀적으로 다시 질문을 던짐
          })
          .catch(error => {
            console.error('Error:', error);
            askQuestion(); // 에러가 나도 다시 질문을 던짐
          });
      });
    };

    // 첫 번째 질문을 던짐
    askQuestion();
  }
}