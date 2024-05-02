const baseURL = "http://localhost:3000/todos"

const apis = function() { // APIs to do HTTP requests.
    // GET http request
    const getTodos = () => {
        const todosPromise = fetch(baseURL);
        return todosPromise.then((response) => response.json()); // <-- resolve by returning data.json()
    }

    return {getTodos};
}();

const view = function() { // manage the view, get DOM element, add/create DOM element etc.
    const addBtn = document.querySelector(".add__btn");
    const inputValue = document.querySelector(".input__string")
    const todoContainer = document.querySelector(".todo__container")

    const getInputValue = () => {
        return inputValue.value;
    }

    const renderTodos = (todos) => {
        let tempTodos = ""
        todos.forEach((e, i) => {
            tempTodos += `<div> ${e.content} </div>` // <-- simple DOM manipulation update
        })
        todoContainer.innerHTML = tempTodos;
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
            console.log("inside get todos.")
            console.log(this.#todos);
            return this.#todos;
        }

        set todos(newTodos) {
            this.#todos = newTodos;
            this.#onChange();
        }

        subscribe(callbackFn) {
            this.#onChange = callbackFn;
        }

        printTodo() {
            console.log(this.#todos);
        }
    }
    const {getTodos} = apis;

    return {Todos, getTodos};
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
        console.log(view.getInputValue());
    })

    const bootstrap = function(){
        initTodo(); // <-- now here the todoState object is updated, render it to view

        // need to use subscribe, why?
        // if we do console.log(todoState.todos); we get empty array here. why is that?
        todoState.subscribe(() => {
            view.renderTodos(todoState.todos);
        })
        // trying to update todoState's callbackfn.

    };

    return {
        bootstrap,
    }

}(model, view);

controller.bootstrap();