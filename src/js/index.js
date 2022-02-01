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


// TODO : 단일 로직으로 바꾸기
function delegate(이벤트명, 자식, 핸들러함수, 부모) { //이벤트 위임 함수
  부모.addEventListener(이벤트명, (event) => { //부모(ul) 클릭시
      const 이벤트타겟 = event.target; //타겟 변수 설정

      const 자식들 = 부모.querySelectorAll(자식); //자식들 : ul의 자식들 li 여러개


      // TODO: filter -> find
      const 이벤트자식들 = Array.from(자식들).filter((element) => { //이벤트자식들 : 자식들 array화 시켜주고 filter함수로 자식들 중에 이벤트 타겟 출력
          return element.contains(이벤트타겟); //이벤트타겟이 포함되어있는 것 출력
      });


      이벤트자식들.forEach((element) => { //이벤트자식들을 하나씩 반복 
          핸들러함수({
              event,
              element
          }); //editHandler함수 호출
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

  function soldOutHandler({
      event,
      element: 버튼
  }) {
      const liElement3 = 버튼.closest(".menu-list-item");
      const nameElement2 = liElement3.querySelector(".menu-name");

      nameElement2.classList.add("sold-out");
  }

  function editHandler({
      event,
      element: 버튼
  }) {
      const liElement = 버튼.closest(".menu-list-item"); //타겟이 일어난 버튼과 가까이 있는 부모 li 
      const nameElement = liElement.querySelector(".menu-name"); //타겟부모 li의 자식(span)

      let editVal = prompt("무엇으로 바꾸시겠습니까?", ""); //prompt 출력
      if (editVal != null) { // 값이 없지 않으면
          nameElement.innerHTML = editVal; //자식(span)에 editVal의 값 대입
      }
  }

  function removeHandler({
      event,
      element: 버튼
  }) {
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
  delegate("click", ".menu-sold-out-button", soldOutHandler, menuList);

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


// delegate 함수 구현 (중간중간 console.log) 고도화

// 유사배열, 배열

// 아래 함수 구현

// 생활코딩 git 수업

// 페이지를 로드
function loadMenu() {
  localStorage.setItem('espresso', JSON.stringify({
      espresso: [{
          id: 1,
          name: 'papico'
      }, {
          id: 2,
          name: 'siwon'
      }]
  }));

  loging();
}

loadMenu();


// 메뉴추가
function addMenu() {
  const espressoMenuList = JSON.parse(localStorage.getItem('espresso'));
  
  const newMenu = {
      id: 3,
      name: 'cool-jung'
  };
  const copyEspressoMenuList = [...espressoMenuList.espresso,newMenu];
  localStorageSetItem({espresso,copyEspressoMenuList});
}
addMenu();

// 메뉴 삭제
function removeMenu() {
  const espressoMenuList = JSON.parse(localStorage.getItem('espresso'));
  console.log(espressoMenuList.espresso);
  const deleteMenuId = 1;
  const removeMenuList = espressoMenuList.espresso.filter((element)=>{
      return element.id !== deleteMenuId;
  });
  console.log(removeMenuList);
  
  localStorageSetItem({espresso,removeMenuList});
}
removeMenu();

// 메뉴 수정
function editMenu(){
  const espressoMenuList = JSON.parse(localStorage.getItem('espresso'));
  const editMenu = {
      id: 2,
      name: 'luya'
  };
  const updatedName = espressoMenuList.espresso.map((element)=>{
      if(element.id == 2){
          element.name = editMenu.name;
          return element;
      }else{
          return element;
      }
  });
  console.log(updatedName);
  localStorageSetItem({key:'espresso', val:updatedName});
}
editMenu();

// 로깅
function loging(){
  const espressoMenuList = JSON.parse(localStorage.getItem('espresso'));

  console.log(espressoMenuList);
}

function localStorageSetItem({key,val}){
  localStorage.setItem('espresso',JSON.stringify({[key]:val}));
} 