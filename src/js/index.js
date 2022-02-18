function counterTmpl(count) {
  return `<span>총 ${count}개</span>`;
}

function menuItemTmpl({ id, name, soldout }) {
  return `<li class="menu-list-item d-flex items-center py-2" id="${id}">
<span class="w-100 pl-2 menu-name ${soldout ? 'sold-out' : ''}">${name}</span>
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


  // 금방
  function soldOutHandler({ event, element: 버튼 }) {
    const liElement = 버튼.closest(".menu-list-item");
    const nameElement2 = liElement.querySelector(".menu-name");

    // toggle
    nameElement2.classList.toggle("sold-out");
    console.log(nameElement2.classList.contains('sold-out'));
    // localstorage 값 변경
    const menuData = JSON.parse(localStorage.getItem("menuData"));
    const soldOutList = menuData.espresso.map((menu)=>{
      console.log(nameElement2.classList.contains('sold-out'));
      console.log(menu.id);
      console.log(liElement.id);
      if(nameElement2.classList.contains('sold-out') && menu.id === Number(liElement.id)){
        return { ...menu, soldout: true };
      }else{
        return { ...menu, soldout: false };
      }
      
    });  
    console.log(soldOutList);
    localStorageSetItem({key:"espresso", val: soldOutList});


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

    // 엘리먼트와 -> 수정 완료

    // 실제 localstorage data -> 지금 해야되는거죠?
    // 저장되어있는 데이터 가져오기
    const menuData = JSON.parse(localStorage.getItem("menuData"));
    // 수정해야 되는 친구찾기

    // 바꾸기
    const editMenuList = menuData.espresso.map((menu)=>{
      if (menu.id === liElement.id) {
        return { ...menu, name: editVal };
      }
      return menu;
    });
    
    localStorageSetItem({ key: "espresso", val: editMenuList });
  }

  function removeHandler({
      event,
      element: 버튼
  }) {
      const menuData = JSON.parse(localStorage.getItem('menuData'));
      const liElement = 버튼.closest(".menu-list-item");
      console.log(liElement.id);
      console.log(typeof liElement.id);
      const removeMenuList = menuData.espresso.filter((element)=>{
          return element.id !== parseInt(liElement.id);
      });
      localStorageSetItem({key:'espresso',val:removeMenuList});

      if (confirm('삭제하시겠습니까?')) { // true면
          liElement.remove(); //타겟 li 삭제
          renderCounter();
      }
  }

  function submitHandler(event) {
      event.preventDefault();

      const menuData = JSON.parse(localStorage.getItem('menuData'));
      const input = document.querySelector("#espresso-menu-name");
      const inputValue = input.value.trim();
      if (inputValue.length === 0) {
          return;
      }

      const newMenu = {
          id: Date.now(),
          name: inputValue
      };

      const copymenuData = [...menuData.espresso,newMenu];
      localStorageSetItem({key:'espresso',val:copymenuData});

      menuList.insertAdjacentElement(
          "afterbegin",
          createElement(menuItemTmpl(newMenu))
      );

      input.value = "";

      renderCounter();
  }

  // 화면 처음 렌더링 하는 시점에 그려야하는 것들
  function initRender() {
    const menuData = JSON.parse(localStorage.getItem("menuData"));

    menuData.espresso.forEach(function (menu) {
      menuList.insertAdjacentElement(
        "afterbegin",
        createElement(menuItemTmpl(menu))
      );
    });
  }

  // 품절
  delegate("click", ".menu-sold-out-button", soldOutHandler, menuList);

  // 수정을 하면은 prompt 가 뜨고 이후 수정후에 해당 돔이 변경
  delegate("click", ".menu-edit-button", editHandler, menuList);

  // TODO 삭제를 하면은 alert 가 뜨고 이후 해당 돔이 삭제된다.
  delegate("click", ".menu-remove-button", removeHandler, menuList);

  form.addEventListener("submit", submitHandler);
  submitBtn.addEventListener("click", submitHandler);

  initRender();
}

document.addEventListener("DOMContentLoaded", function () {
  init();
});

// delegate 함수 구현 (중간중간 console.log) 고도화

// 유사배열, 배열

// 아래 함수 구현

// 생활코딩 git 수업


function localStorageSetItem({ key, val }) {
  localStorage.setItem("menuData", JSON.stringify({ [key]: val }));
}


// dataset 
// 기존에 id 로 넣어던 템플릿을 -> data-id 로 변경 하고 동작 테스트


[{ id: 1, name: 'papico', soldout: false }]

// localstorage

// 돔데이터