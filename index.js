const baseURL = "http://localhost:3000/todos"

const apis = function() { // APIs to do HTTP requests.
    // GET http request
    const getTodos = () => {
        const todosPromise = fetch(baseURL);
        return todosPromise.then((response) => response.json()); // <-- resolve by returning data.json()
    }

    const createTodo = (newTodo) => {
        const todoPromise = fetch(baseURL, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo), // body data type must match "Content-Type" header
        });
        return todoPromise.then((response) => response.json()); // <-- resolve by returning data.json()
    }

    const deleteTodo = (id) => {
        const todoPromise = fetch(`${baseURL}/${id}`,{
            method: "DELETE", // <-- for DELETE, give the full http url that ends with id
        });
        return todoPromise.then((response) => response.json()); // <-- resolve by returning data.json()
    }

    const updateTodo = (id, newTodo) => {
        const todoPromise = fetch(`${baseURL}/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo), // body data type must match "Content-Type" header
        });
        return todoPromise.then((response) => response.json()); // <-- resolve by returning data.json()
    }

    return {
        getTodos,
        createTodo,
        deleteTodo,
        updateTodo,
    };
}();

const view = function() { // manage the view, get DOM element, add/create DOM element etc.
    const addBtn = document.querySelector(".add__btn");
    const inputValue = document.querySelector(".input__string");
    const todoList = document.querySelector(".todo__list");
    //const deleteBtn = document.querySelector(".todo__delete-button");

    const getInputValue = () => {
        return inputValue.value;
    };
    const clearInputValue = () => {
        inputValue.value = "";
    };

    const createBulletItem = (content, id) => {
        const liElem = document.createElement("li");
        liElem.setAttribute("id", id);

        const delButton = document.createElement("button");
        delButton.classList.add("todo__delete-button");
        delButton.appendChild(document.createTextNode("delete"));
        liElem.appendChild(delButton);
        
        const editButton = document.createElement("button");
        editButton.classList.add("todo__edit-button");
        editButton.appendChild(document.createTextNode("edit"));
        liElem.appendChild(editButton);

        const spanElem = document.createElement("span");
        spanElem.appendChild(document.createTextNode(` : ${content}`));
        liElem.appendChild(spanElem);

        //openEditBox(liElem);

        return liElem;
    }

    const isDeleteButton = (className) => {
        return className === "todo__delete-button";
    }
    const isEditButton = (className) => {
        return className === "todo__edit-button";
    }

    const openEditBox = (itemElem) => {
        /**
        <span>
            <input class = 'edit__input' type = 'string'/>
            <button class = 'edit__save' type = 'submit'>save</button>
            <button class = 'edit__close' type = 'submit'>close</button>
        </span>
         */
        const spanElem = document.createElement("form");
        spanElem.style.marginLeft = "10px";

        const inputElem = document.createElement("input");
        inputElem.classList.add("edit__input");
        spanElem.appendChild(inputElem);

        const saveBtnElem = document.createElement("button");
        saveBtnElem.appendChild(document.createTextNode(`save`));
        saveBtnElem.classList.add("edit__save-button");
        spanElem.appendChild(saveBtnElem);

        const closeBtnElem = document.createElement("button");
        closeBtnElem.appendChild(document.createTextNode(`close`));
        closeBtnElem.classList.add("edit__close-button");
        spanElem.appendChild(closeBtnElem);

        itemElem.appendChild(spanElem);
        return {
            inputElem,
            saveBtnElem,
            closeBtnElem,
        }
    }
    const closeEditBox = (itemElem)=> {
        itemElem.parentNode.removeChild(itemElem);
    }
    const getEditButtons = () => {
        return {
            inputElem: document.querySelector(".edit__input"),
            saveBtnElem: document.querySelector(".edit__save-button"),
            closeBtnElem: document.querySelector(".edit__close-button"),
            
        };
    }
    const isCloseEditButton = (className) => {
        return className === "edit__close-button";
    }
    const isSaveEditButton = (className) => {
        return className === "edit__save-button";
    }

    const renderTodos = (todos) => {
        todoList.innerHTML = "";
        todos.forEach((e, i) => {
            todoList.appendChild(createBulletItem(e.content, e.id))
        })
    }

    return {
        addBtn,
        todoList,
        getInputValue,
        renderTodos,
        clearInputValue,
        isDeleteButton,
        isEditButton,
        openEditBox,
        closeEditBox,
        getEditButtons,
        isCloseEditButton,
        isSaveEditButton,
    };
}(); // <-- IIFE, now you can use view immediately. rather than have to call it.

const model = function() { // manage the data, in the form of data structure.
    class Todos {
        #todos; // []
        #onChange;

        constructor() {
            this.#todos = []
        }

        get todos() {
            return this.#todos;
        }

        set todos(newTodos) {
            this.#todos = newTodos;
            this.#onChange();
        }

        subscribe(callbackFn) {
            this.#onChange = callbackFn;
        }
    }
    const {getTodos, createTodo, deleteTodo, updateTodo} = apis;

    return {
        Todos, 
        getTodos, 
        createTodo, 
        deleteTodo,
        updateTodo
    };
}();

const controller = function(model, view) { // connects model and view, allow user to interact.
    const todoState = new model.Todos();
    let openedEditBox = [];

    const initTodo = () => {
        model.getTodos().then((data) => {
            todoState.todos = data;
            //view.renderTodos(todoState.todos);
            openedEditBox.length = 0;
        })
    }
    
    // click add button
    const addButtonHandler = () => {
        view.addBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const todoObject = {
                content: view.getInputValue(),
            }
            //console.log(todoObject);
            model.createTodo(todoObject).then((data) => {
                todoState.todos = [...todoState.todos, data];
                view.clearInputValue();
            })
            openedEditBox.length = 0;
        })
    }
    // click delete button
    // track button using event capturing since 
    // the scrap html does not have delete button, 
    // it was later populated
    const deleteButtonHandler = () => {
        view.todoList.addEventListener("click",  (event) => {
            if (view.isDeleteButton(event.target.classList[0])) {
                model.deleteTodo(event.target.parentNode.id).then((data) => {
                    //console.log(data.id);
                    todoState.todos = todoState.todos.filter((e, i) => e.id !== data.id);
                })
                openedEditBox.length = 0;
            }
        })
    }

    // click edit button
    // using similar method for delete, implement edit handler.
    const editButtonHandler = () => {
        view.todoList.addEventListener("click",  (event) => {
            if (view.isEditButton(event.target.classList[0])) {
                // here we need to "Spawn" a box for input and submit.
                if (!openedEditBox.includes(event.target.parentNode.id)) {
                    openedEditBox.push(event.target.parentNode.id);
                    view.openEditBox(event.target.parentNode);
                }
            }
        })
    }
    const closeEditHandler = () => {
        view.todoList.addEventListener("click",  (event) => {
            event.preventDefault();
            if (view.isCloseEditButton(event.target.classList[0])) {
                const currId = event.target.parentNode.parentNode.id;
                view.closeEditBox(event.target.parentNode);
                const temp = openedEditBox.filter((e) => e !== currId);
                openedEditBox.length = temp.length;
                temp.forEach((e, i) => {
                    openedEditBox[i] = e;
                })
            }
        })
    }
    
    const saveEditHandler = () => {
        view.todoList.addEventListener("click",  (event) => {
            event.preventDefault();
            if (view.isSaveEditButton(event.target.classList[0])) {
                const currId = event.target.parentNode.parentNode.id;

                const todoObject = {
                    content: event.target.parentNode.childNodes[0].value,
                }

                model.updateTodo(currId, todoObject).then((data) => {
                    todoState.todos = todoState.todos.map((e, i) => {
                        if (e.id !== data.id) {
                            return e
                        } else {
                            return data;
                        }
                    });
                })

                openedEditBox.length = 0;
            }
        })
    }


    const bootstrap = function(){
        initTodo(); // <-- now here the todoState object is updated, render it to view

        // need to use subscribe, why?
        // if we do console.log(todoState.todos); we get empty array here. why is that?
        todoState.subscribe(() => {
            view.renderTodos(todoState.todos);
        })

        addButtonHandler();
        deleteButtonHandler();
        editButtonHandler();
        closeEditHandler();
        saveEditHandler();
    };

    return {
        bootstrap,
    }

}(model, view);

controller.bootstrap();