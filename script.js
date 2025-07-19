// HTML 문서가 모두 로드되면 이 코드를 실행합니다.
document.addEventListener('DOMContentLoaded', () => {

    // id가 "myButton"인 버튼 요소를 찾습니다.
    const myButton = document.getElementById('myButton');

    // 버튼에 'click' 이벤트 리스너를 추가합니다.
    myButton.addEventListener('click', () => {
        // 버튼을 클릭하면 경고창을 띄웁니다.
        alert('환영합니다! 제 첫 홈페이지에 오신 것을 축하해요!');
    });

});