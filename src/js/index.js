function createElement(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString;

  return div.firstChild;
}

function menuItemTmpl(name) {
  return `<li class="menu-list-item d-flex items-center py-2">
  <span class="w-100 pl-2 menu-name">${name}</span>
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
</li>`
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
const form = document.querySelector('#espresso-menu-form');
const menuName = document.querySelector('.menu-name');
// const count = document.querySelector('.menu-count');
const menuList = document.querySelector('#espresso-menu-list');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  
  

  // const menuList = document.querySelector('#espresso-menu-list');
  const input = document.querySelector('#espresso-menu-name');
  const inputValue = input.value.trim();
  if (inputValue.length === 0) {
      return;
  } 

  menuList.insertAdjacentElement('afterbegin', createElement(menuItemTmpl(inputValue)));

  input.value = '';

  renderCounter();
});



function counterTmpl (count) {
return `<span>총 ${count}개</span>`
}
function renderCounter() {
    const counter = document.querySelectorAll('.menu-list-item').length; 

    const menuCount = document.querySelector('.menu-count');
    menuCount.innerHTML = counterTmpl(counter);
}




function clickHandler(event){
let targetBtn = event.target;
let targetLi = targetBtn.parentNode;
// let targetLi = targetBtn.previousSibling;
if(targetBtn.classList.contains('menu-edit-button')){
      let editVal = prompt('무엇으로 바꾸시겠습니까?','');
      if(editVal != null){
        targetLi.innerHTML = editVal;
      }
}

if(targetBtn.classList.contains('menu-remove-button')){
      let removeAgree = confirm('삭제하시겠습니까?')
      if(removeAgree) {
        targetLi.remove();
        renderCounter();
      }
}
}


document.addEventListener('DOMContentLoaded',function(){
menuList.addEventListener('click',clickHandler);
});

