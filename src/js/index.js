function counterTmpl(count) {
  return `<span>총 ${count}개</span>`;
}

function menuItemTmpl(name) {
  return `<li class="menu-list-item d-flex items-center py-2">
  <span class="w-100 pl-2 menu-name">${name}</span>
  <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
  >
    품절
  </button>
  <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
  >
    수정
  </button>
  <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
  >
    삭제
  </button>
</li>`;
}

function delegate(이벤트명, 자식, 핸들러함수, 부모) {  //이벤트 위임 함수
  부모.addEventListener(이벤트명, (event) => { //부모(ul) 클릭시
    const 이벤트타겟 = event.target; //타겟 변수 설정

    const 자식들 = 부모.querySelectorAll(자식); //자식들 : ul의 자식들 li 여러개

    const 이벤트자식들 = Array.from(자식들).filter((element) => { //이벤트자식들 : 자식들 array화 시켜주고 filter함수로 자식들 중에 이벤트 타겟 출력
      return element.contains(이벤트타겟); //이벤트타겟이 포함되어있는 것 출력
    });
    

    이벤트자식들.forEach((element) => {  //이벤트자식들을 하나씩 반복 
      핸들러함수({ event, element }); //editHandler함수 호출
    });
  });
}


function init() {
  function createElement(htmlString) {
    const div = document.createElement("div");
    div.innerHTML = htmlString;

    return div.firstChild;
  }

  // nvm 설치 환경
  // submit 이벤트의 기본 동작
  // preventDefault MDN
  // insertAdjacentElement MDN
  // 템플릿 함수 : 문자열 리턴 menuItemTmpl
  // 문자열을 element 로 만들어주는 함수의 원리
  // 조건을 충족시키면서 꼼꼼 하게 개발하는 거
  // event delegate pattern (event delegation)

  let count = 0;
  const form = document.querySelector("#espresso-menu-form");
  const menuList = document.querySelector("#espresso-menu-list");
  const submitBtn = document.querySelector("#espresso-menu-submit-button"); 

  function renderCounter() {
    const counter = document.querySelectorAll(".menu-list-item").length;

    const menuCount = document.querySelector(".menu-count");
    menuCount.innerHTML = counterTmpl(counter);
  }

  function soldOutHandler({event, element: 버튼}){
    const liElement3 = 버튼.closest(".menu-list-item");
    const nameElement2 = liElement3.querySelector(".menu-name");

    nameElement2.classList.add("sold-out");
  }

  function editHandler({ event, element: 버튼 }) { 
    const liElement = 버튼.closest(".menu-list-item"); //타겟이 일어난 버튼과 가까이 있는 부모 li 
    const nameElement = liElement.querySelector(".menu-name"); //타겟부모 li의 자식(span)

    let editVal = prompt("무엇으로 바꾸시겠습니까?", ""); //prompt 출력
    if (editVal != null) { // 값이 없지 않으면
      nameElement.innerHTML = editVal; //자식(span)에 editVal의 값 대입
    }
  }

  function removeHandler({ event, element: 버튼 }) { 
    const liElement2 = 버튼.closest(".menu-list-item"); 
    if (confirm('삭제하시겠습니까?')) { // true면
      liElement2.remove(); //타겟 li 삭제
      renderCounter();
    }
  }

  function submitHandler(event) {
    event.preventDefault();

    const input = document.querySelector("#espresso-menu-name");
    const inputValue = input.value.trim();
    if (inputValue.length === 0) {
      return;
    }

    menuList.insertAdjacentElement(
      "afterbegin",
      createElement(menuItemTmpl(inputValue))
    );

    input.value = "";

    renderCounter();
  }
  //품절
  delegate("click",".menu-sold-out-button",soldOutHandler,menuList);

  // 수정을 하면은 prompt 가 뜨고 이후 수정후에 해당 돔이 변경
  delegate("click", ".menu-edit-button", editHandler, menuList);

  // TODO 삭제를 하면은 alert 가 뜨고 이후 해당 돔이 삭제된다.
  delegate("click", ".menu-remove-button", removeHandler, menuList);

  form.addEventListener("submit", submitHandler);
  submitBtn.addEventListener("click", submitHandler);
}

document.addEventListener("DOMContentLoaded", function () {
  init();
});

// 1. 브라우져 렌더링 과정
// dom tree cssom tree render tree
// script tag (defer async)

// 2. DOMContentLoaded, window.onload 돔이 렌더링이 된 이후에 울리는 함수 (브라우져)

// 3. querySelectorAll, querySelector

// 4. delegate 함수 구현 (중간중간 console.log)

// 5. 유사배열, 배열

// 6. 삭제를 delegate 구현하기