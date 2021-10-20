// Selectors
const todoInput = document.querySelector("#input-create");
const btnCreateTodo = document.querySelector("#create-todo-btn");
const todoList = document.querySelector("#todo-container");

const btnAll = document.querySelector("#select-all");
const btnActive = document.querySelector("#select-active");
const btnCompleted = document.querySelector("#select-completed");

// Event Listeners
btnCreateTodo.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);

// Functions
function addTodo(e) {
  e.preventDefault();
  createTodo();
}

function createTodo() {
  // Create todo Div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo__panel");
  todoDiv.draggable = true;

  // Create LI
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo__title");
  newTodo.classList.add("heading-1");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  newTodo.setAttribute("role", "button");
  newTodo.setAttribute("aria-label", "Open todo");
  newTodo.tabIndex = "0";
  todoDiv.appendChild(newTodo);

  // Completed Button
  const btnCompleted = document.createElement("input");
  btnCompleted.type = "checkbox";
  btnCompleted.classList.add("todo__btn");
  todoDiv.appendChild(btnCompleted);

  // Delete Button
  const btnDelete = document.createElement("button");
  btnDelete.innerText = "X";
  btnDelete.classList.add("todo__del");
  todoDiv.appendChild(btnDelete);

  // Append to list
  todoList.appendChild(todoDiv);

  // Clear input
  todoInput.value = "";
}

function deleteCheck(e) {
  const item = e.target;

  // Delete todo
  if (item.classList.contains("todo__del")) {
    const todo = item.parentElement;
    todo.remove();
  }

  // Mark Complete
  if (item.classList.contains("todo__btn")) {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
}

function sortTodo() {}
