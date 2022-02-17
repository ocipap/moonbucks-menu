function countTmpl(count){
    return `<span class="mr-2 mt-4 menu-count">총 ${count}개</span>`
}

function menuItemTmpl(name){
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
    </li>`
}

function delegate(eventName,child,hamsu,parent){
    parent.addEventListener(eventName,function(event){
        let target = event.target;
        const children = parent.querySelectorAll(child);
        const eventChild = Array.from(children).filter((element)=>{
            return element.contains(target);
        });
        
        eventChild.forEach((element)=>{
            hamsu({event,element});
        });
    });
}

function init(){
    const form = document.querySelector("#espresso-menu-form");
    const ul = document.querySelector("#espresso-menu-list");
    const submitButton = document.querySelector("#espresso-menu-submit-button");
    const input = document.querySelector("#espresso-menu-name");
    let count = 0;

    function createElement(string){
        const div = document.createElement("div");
        div.innerHTML = string;
        return div.firstChild;        
    }

    function counter(){
        const counter= document.querySelectorAll(".menu-list-item").length;
        
        const menuCount = document.querySelector(".menu-count");
        menuCount.innerHTML = countTmpl(counter);
    }

    function submitHandler(event){
        event.preventDefault();

        const menudata = JSON.parse(localStorage.getItem("menudata"));
        console.log(menudata);
        const inputValue = input.value.trim();
        
        if(inputValue.length === 0){
            return;
        }
        
        const newMenu = {
            id: Date.now(),
            name: inputValue
        };

        const copymenuData = [...menudata.espresso,newMenu];
        setItem({key:'espresso',val:copymenuData});

        ul.insertAdjacentElement("afterbegin",createElement(menuItemTmpl(inputValue)));
        counter();
        input.value = "";
    }

    function editHandler({event, element}){
        const liElement = element.closest(".menu-list-item");
        const menuName = liElement.querySelector(".menu-name");

        let editVal = prompt("무엇으로 바꾸시겠습니까?","");
        if(editVal.length === 0){
            return;
        }
        menuName.innerText = editVal;
    }

    function removeHandler({event,element}){
        const liElement = element.closest(".menu-list-item");
        
        const removeMenu = confirm("삭제하시겠습니까?");
        if(removeMenu){liElement.remove();}
        counter();
    }

    function soldOutHandler({event,element}){
        const liElement = element.closest(".menu-list-item");
        const menuName = liElement.querySelector(".menu-name");

        menuName.classList.toggle("sold-out");


    }

    form.addEventListener("submit",submitHandler);
    submitButton.addEventListener("click",submitHandler);
    delegate("click",".menu-edit-button",editHandler,ul);
    delegate("click",".menu-remove-button",removeHandler,ul);
    delegate("click",".menu-sold-out-button",soldOutHandler,ul);
}

document.addEventListener("DOMContentLoaded", function(){
    init();
});



function setItem({key,val}){
    localStorage.setItem("menudata",JSON.stringify({[key]:val}));
}