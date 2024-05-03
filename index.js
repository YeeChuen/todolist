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

    return {
        getTodos,
        createTodo,
    };
}();

const view = function() { // manage the view, get DOM element, add/create DOM element etc.
    const addBtn = document.querySelector(".add__btn");
    const inputValue = document.querySelector(".input__string")
    const todoList = document.querySelector(".todo__list")

    const getInputValue = () => {
        return inputValue.value;
    }

    const createBulletItem = (todo) => {
        const liElem = document.createElement("li");

        const delButton = document.createElement("button");
        delButton.classList.add("todo__delete-button");
        delButton.appendChild(document.createTextNode("delete"));
        liElem.appendChild(delButton);
        
        const editButton = document.createElement("button");
        editButton.classList.add("todo__edit-button");
        editButton.appendChild(document.createTextNode("edit"));
        liElem.appendChild(editButton);

        const spanElem = document.createElement("span");
        spanElem.appendChild(document.createTextNode(` : ${todo}`));
        liElem.appendChild(spanElem);

        return liElem;
    }

    const renderTodos = (todos) => {
        todoList.innerHTML = "";
        todos.forEach((e, i) => {
            todoList.appendChild(createBulletItem(e.content))
        })
    }

    return {
        addBtn,
        getInputValue,
        renderTodos,
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
    const {getTodos, createTodo} = apis;

    return {Todos, getTodos, createTodo};
}();

const controller = function(model, view) { // connects model and view, allow user to interact.
    const todoState = new model.Todos();

    const initTodo = () => {
        model.getTodos().then((data) => {
            todoState.todos = data;
            //view.renderTodos(todoState.todos);
        })
    }
    
    // click button
    view.addBtn.addEventListener("click", (event) => {
        event.preventDefault();
        const todoObject = {
            content: view.getInputValue(),
        }

        console.log(todoObject);
        model.createTodo(todoObject).then((data) => {
            todoState.todos = [...todoState.todos, data];
        })
    })

    const bootstrap = function(){
        initTodo(); // <-- now here the todoState object is updated, render it to view

        // need to use subscribe, why?
        // if we do console.log(todoState.todos); we get empty array here. why is that?
        todoState.subscribe(() => {
            view.renderTodos(todoState.todos);
        })

    };

    return {
        bootstrap,
    }

}(model, view);

controller.bootstrap();