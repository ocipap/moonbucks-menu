const form = document.querySelector('#espresso-menu-form');


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
    
    counter();

});

function counter(){

  if(menuList !== null){
    for(let i=0; i<=menuList.length; i++){
      count++;
    }
  }
  return count;
}

function clickHandler(event){
  let elem = event.target;
  if(elem.classList.contains('menu-edit-button')){
    let editVal = prompt('무엇으로 바꾸시겠습니까?','');
    if(editVal != null){
      document.querySelector('.menu-name').innerHTML = editVal;
    }
  }

  if(elem.classList.contains('menu-remove-button')){
    let removeAgree = confirm('삭제하시겠습니까?')
    if(removeAgree) {
      return document.querySelector('.menu-list-item').remove();
      // console.log(count--);
    }
  }
}
menuList.addEventListener('click',clickHandler);


