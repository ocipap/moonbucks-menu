function countTmpl(count) {
    return `<span class="mr-2 mt-4 menu-count">총 ${count}개</span>`
}

function menuItemTmpl({
    id,
    name,
    soldout
}) {
    return `<li class="menu-list-item d-flex items-center py-2" id="${id}">
    <span class="w-100 pl-2 menu-name ${soldout?'sold-out':''}">${name}</span>
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

function delegate(eventName, child, handler, parent) {
    parent.addEventListener(eventName, function (event) { //부모 클릭시
        const eventTarget = event.target; //타겟 지정
        const children = parent.querySelectorAll(child); // 자식들 중에
        const eventChild = Array.from(children).filter((element) => {
            return element.contains(eventTarget);
        }); // 내가 고른 자식만 추출

        eventChild.forEach((element) => {
            handler({
                event,
                element
            });
        }); //추출한 자식 객체 저장하기
    });
}

function init() {
    const form = document.querySelector("#espresso-menu-form");
    const ul = document.querySelector("#espresso-menu-list");
    const submitButton = document.querySelector("#espresso-menu-submit-button");
    const input = document.querySelector("#espresso-menu-name");

    function createElement(html) {
        const div = document.createElement("div");//html담을 태그 만들기
        div.innerHTML = html;//만든 태그에 html집어넣기
        return div.firstChild;//태그에 맨 첫번째 하위요소로 넣기
    }

    function counter(){
        const liCount = document.querySelectorAll(".menu-list-item").length;//리스트 개수

        const menuCount = document.querySelector(".menu-count");//리스트 표시하는 텍스트에
        menuCount.innerHTML = countTmpl(liCount);//개수 넣기
    }
    //====메뉴추가 함수====
    function submitHandler(event){
        event.preventDefault();//submit할때 화면이 새로고침 되지 않도록 하기
        //input값이 빈값이 아니라면 
        const inputValue = input.value.trim();
        if(inputValue.length===0){
            return;
        }
        //리스트만들어서 추가
        const savemenu = JSON.parse(localStorage.getItem("savemenu"));//스토리지 데이터 가져오기
        
        const newMenu = {
            id: Date.now(),
            name: inputValue
        }//1. 내가 추가 할 객체를 변수에 담기
        //2. 기존에 있는 리스트에 새로운 리스트 추가
        const addMenuList = [...savemenu.espresso, newMenu]; 
        console.log(addMenuList);
        //3. 추가된 새로운 리스트 저장하기
        funcsetItem({key:'espresso',val:addMenuList});

        ul.insertAdjacentElement("afterbegin",createElement(menuItemTmpl(newMenu)));
        
        //input은 빈값으로 초기화
        input.value="";
        counter();
        //갯수 카운터 
        console.log(inputValue);
    }

    //====메뉴수정 함수====
    function editHandler({event,element}){
        const liElement = element.closest(".menu-list-item"); //타겟 버튼의 부모
        const menuName = liElement.querySelector(".menu-name");//타겟 부모의 바뀔 자식
        let changeTxt = prompt("무엇으로 바꾸시겠습니까?","");//바꿀 텍스트 입력창 켜기(prompt)
        if(changeTxt != null){
            menuName.innerHTML = changeTxt;
        }//내가 고른 버튼이 리스트 버튼과 같다면
        //바꾸기

        const savemenu = JSON.parse(localStorage.getItem("savemenu"));
        //1.수정 할 것 찾기
        //2. 바꾸기
        const editMenuList = savemenu.espresso.map((menu)=>{
            console.log(menu.id);
            console.log(liElement.id);
            if(parseInt(liElement.id) === menu.id){
                return {...menu,name: changeTxt};
            }else{
                return menu;
            }
        
        });
        //3.바뀐 내용 저장
        funcsetItem({key:'espresso',val:editMenuList});
    }

    //====메뉴삭제 함수====
    function removeHandler({event,element}){
        const liElement = element.closest(".menu-list-item");//타겟 버튼의 부모
        if(confirm(`지울까요?`)){
            liElement.remove(); //지우기
            counter();
        }//지울까요? 
        //1.지울 것 찾기
        const savemenu = JSON.parse(localStorage.getItem("savemenu"));
        //2.삭제
        const removeMenuList = savemenu.espresso.filter((menu)=>{
            return parseInt(liElement.id) !== menu.id;                
        });
        funcsetItem({key:'espresso',val:removeMenuList});
    }

    //====메뉴품절 함수====
    function soldOutHandler({event,element}){
        const liElement = element.closest(".menu-list-item");
        const menuName = liElement.querySelector(".menu-name");
        menuName.classList.toggle("sold-out");//품절버튼 클릭하면 표시 껐다/켰다 

        const savemenu = JSON.parse(localStorage.getItem("savemenu"));
        //1. 품절 시킬 것 찾기
        const soldOutList = savemenu.espresso.map((menu)=>{
            //2. 품절 시킬 거 표시해주기
            if(menuName.classList.contains('sold-out')&& parseInt(liElement.id) === menu.id){
                return {...menu,soldout: true};    
            }else{
                return {...menu,soldout: false};
            }
        });
        funcsetItem({key:'espresso',val:soldOutList});
    }
    
    function defaultRender(){//처음 렌더때 그려지는 함수
        const savemenu = JSON.parse(localStorage.getItem("savemenu")); //스토리지 가져오기
        savemenu.espresso.forEach((menu)=>{ //반복해서 화면에 뿌려주기
            ul.insertAdjacentElement("afterbegin",createElement(menuItemTmpl(menu)));
        });
    }
    //if (savemenu === null) {savemenu가 없으면
        defaultData();//기본으로 갖고있는 데이터 뿌려주기
    // }
    defaultRender();
    form.addEventListener("submit", submitHandler);
    submitButton.addEventListener("click", submitHandler);
    delegate("click", ".menu-edit-button", editHandler, ul);
    delegate("click", ".menu-remove-button", removeHandler, ul);
    delegate("click", ".menu-sold-out-button", soldOutHandler, ul);
}

document.addEventListener("DOMContentLoaded", function () {
    init();
});

function defaultData() {
    localStorage.setItem('savemenu', JSON.stringify({
        espresso: [{
            id: 11,
            name: 'Luya'
        }, {
            id: 22,
            name: 'Cookie'
        }]
    }));

    loging();
}

function loging() {
    const savemenu = JSON.parse(localStorage.getItem("savemenu"));

    console.log(savemenu);
}

function funcsetItem({ key, val }) {
    localStorage.setItem("savemenu", JSON.stringify({ [key]: val }));
}