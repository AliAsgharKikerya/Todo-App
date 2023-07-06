

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDupQ_DB8C99v1eTF-x99UaXCW274YJ880",
    authDomain: "fir-hosting-dbc1c.firebaseapp.com",
    databaseURL: "https://fir-hosting-dbc1c-default-rtdb.firebaseio.com",
    projectId: "fir-hosting-dbc1c",
    storageBucket: "fir-hosting-dbc1c.appspot.com",
    messagingSenderId: "120347394450",
    appId: "1:120347394450:web:3f78a26703a1926ac0414b",
    measurementId: "G-Z91EQRLSQD"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase()

function createTodo(todoText, id) {
    //create parent node
    let todo = document.createElement('div')
    todo.id = id
    todo.className = "todoItem"
    //create text div
    let todoDiv = document.createElement('div')
    todoDiv.className = "todoText"
    todoDiv.innerHTML = todoText;
    //add text div
    todo.appendChild(todoDiv)
    //create options div
    let todoOptions = document.createElement('div')
    todoOptions.className = "todoOptions";
    //create edit button
    let editButton = document.createElement('button')
    editButton.innerHTML = 'Edit'
    editButton.onclick = () => {
        //on click of edit button save innerHTML of todoDiv
        let temp = todoDiv.innerHTML
        todoDiv.innerHTML = ""
        //create input tag to add in the todoDiv
        let input = document.createElement('input')
        //set value of input to the innerHTML of the todoDiv
        input.value = temp
        //finally add input into the todoDiv
        todoDiv.appendChild(input)
        //create cancel button
        let cancelButton = document.createElement('button')
        cancelButton.innerHTML = "Cancel"
        //on click remove the input we made from the todoDiv and add the temp innerHTML back into the todoDiv
        cancelButton.onclick = () => {
            //Replace cancel button back with edit button
            input.remove()
            todoDiv.innerHTML = temp
            cancelButton.replaceWith(editButton)
            confirmButton.replaceWith(deleteButton)
        }
        //also replace edit button with cancel button
        editButton.replaceWith(cancelButton)

        //create confirm button
        let confirmButton = document.createElement('button')
        confirmButton.innerHTML = "Confirm"
        confirmButton.onclick = () => {
            //on click take value of the input in todoDiv and remove the input from todoDiv.
            let newValue = todoDiv.getElementsByTagName('input')[0].value

            var refrence = ref(database, `/TODOS/${id}`)
            var obj = {
                value: newValue
            }
            update(refrence, obj)
        }
        //replace delete button with confirm button
        deleteButton.replaceWith(confirmButton)
    }
    //create delete button
    let deleteButton = document.createElement('button')
    deleteButton.innerHTML = "Delete"
    //on click remove the todo from the dom
    deleteButton.onclick = () => {
        // todo.remove()
        let refrence = ref(database, `/TODOS/${id}`)
        remove(refrence,);
    }
    //add both buttons
    todoOptions.appendChild(editButton)
    todoOptions.appendChild(deleteButton)
    //add options div to parent
    todo.appendChild(todoOptions)
    // console.log(todo)
    return todo

}

window.addTodo = function () {
    let input = document.getElementById('input')
    let refrence = ref(database, "TODOS");
    let id = push(refrence).key;
    var obj = {
        value: input.value,
        key: id,
    }
    refrence = ref(database, `/TODOS/${id}/`);
    set(refrence, obj);
    input.value = ""
}

function render(list) {
    document.getElementById('todos').innerHTML = ""
    for (let index = 0; index < list.length; index++) {
        const todo = list[index];
        document.getElementById('todos').appendChild(createTodo(todo.value, todo.key))
    }
}

let refrence = ref(database, "/TODOS");
onValue(refrence, function (data) {
    let dataObj = data.val();
    let list = Object.values(dataObj || {});
    render(list);
})