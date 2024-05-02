const baseURL = "http://localhost:3000/todos"

const apis = function() { // APIs to do HTTP requests.
    return {};
}();

const view = function() { // manage the view, get DOM element, add/create DOM element etc.
    return {};
}(); // <-- IIFE, now you can use view immediately. rather than have to call it.

const model = function() { // manage the data, in the form of data structure.
    return {};
}();

const controller = function(model, view) { // connects model and view, allow user to interact.
    console.log("model object: ", model);
    console.log("view object: ", view);

    const bootstrap = function(){

    };

    return {
        bootstrap,
    }

}(model, view);

controller.bootstrap();