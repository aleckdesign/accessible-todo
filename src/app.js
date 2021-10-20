// Inputs
const inputCreate = document.querySelector("#input-create");
const todoEditTitle = document.querySelector(".todo-edit__title");
const todoEditBody = document.querySelector(".todo-edit__body");
const themeSlider = document.querySelector(".theme__slider");

// Buttons
const btnCreate = document.querySelector("#create-todo-btn");
const btnAll = document.querySelector("#select-all");
const btnActive = document.querySelector("#select-active");
const btnCompleted = document.querySelector("#select-completed");
const btnClear = document.querySelector("#clear");
const btnA11y = document.querySelector("#a11y-check");

// Containers
const mainContainer = document.querySelector(".container");
const todoList = document.querySelector("#todo-container");
const createForm = document.querySelector(".todo__create");
const sortTodoList = document.querySelector(".select");

// Modals
const todoEditModal = document.querySelector(".todo-edit");

// Variables - Selectors Other
const overlay = document.querySelector("#overlay");
let todoPanels;
let btnTodo;
let btnDelTodo;
const itemsRemaining = document.querySelector(".todo__items");

// Variables - Arrays
let demoItems = [
  { completed: true, id: 1, title: "Wake up", order: 1 },
  { completed: false, id: 2, title: "Eat breakfast", order: 2 },
  { completed: false, id: 3, title: "Get coding!", order: 3 },
];
let todoArray = [];
let activeArray = [];
let completedArray = [];
let todosRemaining = [];

// Variables
let todoElActive;
let todoElTitle;

let todoActive;
let todoSwap;

let focusedElementBeforeModal;

//////////////////////////////////////////
// Todo Class

class Todo {
  completed = false;
  body = "";
  constructor(title, id) {
    this.title = title;
    this.id = id;
  }
}

//////////////////////////////////////////
// Update items left counter

const updateRemaining = () => {
  todosRemaining = todoArray.filter((todo) => {
    return todo.completed === false;
  });

  const items = todosRemaining.length;
  itemsRemaining.textContent = `${items} items left`;
};

//////////////////////////////////////////
// Add a new todo

const addTodo = () => {
  // Get title from input
  const getTitle = () => {
    if (inputCreate.value.length > 0) {
      return inputCreate.value;
    }
  };

  const title = getTitle();

  if (!title) return; // return if empty input

  // Generate UID
  const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const id = uid();

  inputCreate.value = "";
  inputCreate.focus();

  const todo = new Todo(title, id);
  todoArray.push(todo);
  // todo.order = todoArray.indexOf(todo) + 1;

  createTodo(todo);
};

//////////////////////////////////////////
// Create the todo element structure

const createTodo = (todo) => {
  // Re-add todo order (for re-order function)
  todo.order = todoArray.indexOf(todo) + 1;

  // Create todo Div
  const todoDiv = document.createElement("div");
  todoDiv.id = todo.id;
  todoDiv.classList.add("todo__panel");
  todoDiv.draggable = true;

  let complete = "";
  let check = "";

  // Check completed status
  if (todo.completed) {
    complete = "complete";
    check = "checked";
  }

  // Write the todo inner HTML dynamically
  // prettier-ignore
  todoDiv.innerHTML = `
        <button class="todo__edit" aria-label="Todo name: ${todo.title}, Completed status: ${todo.completed ? "completed" : "not completed"}, Press enter to edit todo:"></button>
        <li role="option" class="todo__title heading-1 ${complete}">${todo.title}</li>
        <input type="checkbox" class="todo__btn-check todo__btn--complete" aria-label="Mark as complete" ${check}/>
        <input type="number" class="todo__order" min="1" max="${
          todoArray.length
        }" aria-label="Assign todo order" title="Use Up/Down keys"/>
        <button class="todo__del" aria-label="delete todo">X</button>`;

  // Append todo to the list
  todoList.appendChild(todoDiv);

  // Update remaning counter
  updateRemaining();

  // Add Drag/Drop and Edit todo functionality
  todoFunctionality(todoDiv, todo);
};

//////////////////////////////////////////
// Todo event listener setup

const todoFunctionality = (todoDiv, todo) => {
  const todoEdit = todoDiv.childNodes[1];
  const todoCheck = todoDiv.childNodes[5];
  const todoOrder = todoDiv.childNodes[7];
  const todoDelete = todoDiv.childNodes[9];
  const controlsArr = [todoCheck, todoOrder, todoDelete];

  // Drag
  todoDiv.addEventListener("dragstart", dragStart);
  todoDiv.addEventListener("drag", drag);
  todoDiv.addEventListener("dragend", dragEnd);
  // Drop
  todoDiv.addEventListener("dragenter", dragEnter);
  todoDiv.addEventListener("dragover", dragOver);
  todoDiv.addEventListener("dragleave", dragLeave);
  todoDiv.addEventListener("drop", drop);

  // Open / Edit
  todoEdit.addEventListener("click", openModalEdit);
  todoEdit.addEventListener("keydown", (e) => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      // e.preventDefault();
      todoOrder.focus();
    }
  });

  // Focused States
  todoEdit.addEventListener("focus", () => {
    todoDiv.classList.add("todo__active");
  });
  todoEdit.addEventListener("blur", () => {
    todoDiv.classList.remove("todo__active");
  });

  // Update the todo div active state
  controlsArr.forEach((control) => {
    control.addEventListener("focus", () => {
      todoDiv.classList.add("todo__active--controls");
    });
    control.addEventListener("blur", () => {
      todoDiv.classList.remove("todo__active--controls");
    });
  });

  // Todo re-order
  todoOrder.value = todo.order;
  todoOrder.addEventListener("input", reorderTodoList);
  todoOrder.addEventListener("change", reorderTodoList);
  // todoOrder.addEventListener("keydown", reorderTodoList);
};

//////////////////////////////////////////
// Update the Aria-Label for title change & completed status

const updateAria = (todo, todoEl) => {
  const ariaLable = `Todo name: ${todo.title}, Completed status: ${
    todo.completed ? "completed" : "not completed"
  }, Press enter to edit todo:`;

  const todoEdit = todoEl.childNodes[1];
  todoEdit.setAttribute("aria-label", `${ariaLable}`);
};

//////////////////////////////////////////
// Open edit todo modal dialog

const openModalEdit = (e) => {
  overlay.classList.remove("hidden");
  todoEditModal.classList.remove("hidden");

  // Keyboard accessibility
  // Save Current focus before modal
  focusedElementBeforeModal = document.activeElement;

  const trapTabKey = (e) => {
    if (e.keyCode === 9) {
      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    closeEditModal(e);
  };

  // Listen for and trap the keyboard
  todoEditModal.addEventListener("keydown", trapTabKey);

  // Find all focusable children
  const focusableElementsString = "textarea, textarea";
  let focusableElements = todoEditModal.querySelectorAll(
    focusableElementsString
  );
  focusableElements = Array.prototype.slice.call(focusableElements);

  const firstTabStop = focusableElements[0];
  const lastTabStop = focusableElements[focusableElements.length - 1];

  // Delay title focus to prevent enter key
  setTimeout(() => {
    firstTabStop.focus();
  }, 100);

  const item = e.target;
  const todoEl = item.parentElement;
  const todoId = todoEl.id;

  todoElTitle = todoEl.childNodes[3];
  todoActive = todoArray.find((todo) => {
    return todo.id == todoId;
  });

  // Edit Modal Get Title & Body
  todoEditTitle.value = todoActive.title;
  if (todoActive.body) todoEditBody.value = todoActive.body;

  // Store changes to the todo title
  todoEditTitle.addEventListener("input", () => {
    if (todoEditTitle.value.length > 0) {
      todoActive.title = todoEditTitle.value;
      todoElTitle.textContent = todoActive.title;
      updateAria(todoActive, todoEl);
    }
  });

  // Store changes to the todo body
  todoEditBody.addEventListener("input", () => {
    todoActive.body = todoEditBody.value;
  });
};

//////////////////////////////////////////
// Close the edit modal dialog

const closeEditModal = (e) => {
  if (e.key === "Escape" || e.target.id === "overlay") {
    todoEditModal.classList.add("hidden");
    focusedElementBeforeModal.focus();
    todoEditBody.value = "";
    focusedElementBeforeModal.checked = false;
    overlay.classList.add("hidden");
  }
};

//////////////////////////////////////////////////
// Render the todo list based on sort criteria

const renderTodoList = (sort) => {
  todoList.innerHTML = "";
  sort.forEach((todo) => createTodo(todo));
};

//////////////////////////////////////////////////
// Sort todo arrays - All - Active - Completed

const sortTodos = (e) => {
  const item = e.target;

  if (item.id === "select-all") {
    renderTodoList(todoArray);
  }
  if (item.id === "select-active") {
    activeArray = todoArray.filter((todo) => {
      return todo.completed === false;
    });
    renderTodoList(activeArray);
  }
  if (item.id === "select-completed") {
    completedArray = todoArray.filter((todo) => {
      return todo.completed === true;
    });
    renderTodoList(completedArray);
  }
};

//////////////////////////////////////////////////
// Mark as complete & Delete operations

function deleteCheck(e) {
  const item = e.target;

  const todoEl = item.parentElement;
  const todoId = todoEl.id;
  const todoTitle = todoEl.childNodes[3];
  const todoCheck = todoEl.childNodes[5];

  const todoIndex = todoArray.findIndex((todo) => {
    return todo.id == todoId;
  });
  const todo = todoArray[todoIndex];

  // Delete todo
  if (item.classList.contains("todo__del")) {
    todoArray.splice(todoIndex, 1);
    todoEl.remove();
    updateRemaining();
  }

  // Mark Complete
  if (item.classList.contains("todo__btn-check")) {
    if (todoCheck.checked) {
      todoEl.classList.add("completed");
      todoTitle.classList.add("complete");
      todo.completed = true;
    } else {
      todoEl.classList.remove("completed");
      todoTitle.classList.remove("complete");
      todo.completed = false;
    }
    updateAria(todo, todoEl);
    updateRemaining();
  }
}

//////////////////////////////////////////////////
// Re-Order the todo list

const reorderTodoList = (e) => {
  const target = e.target;
  const todoEl = target.parentElement;
  const todoId = todoEl.id;
  const todoOrder = todoEl.childNodes[7];

  let todoIndex = todoArray.findIndex((todo) => {
    return todo.id == todoId;
  });

  todoActive = todoArray[todoIndex];

  todoActive.order = +todoOrder.value;

  const item = todoArray.splice(todoIndex, 1);
  todoArray.splice(todoActive.order - 1, 0, item[0]);

  renderTodoList(todoArray);

  const activeTodoEl = document.getElementById(`${todoActive.id}`);
  activeTodoEl.childNodes[7].focus();
};

//////////////////////////////////////////////////
// Remove ALL COMPLETED todos

const removeAllTodos = () => {
  for (let i = 0; i < todoArray.length; i++) {
    if (todoArray[i].completed) {
      todoArray.splice(i, 1);
      i--;
    }
  }

  todoArray.forEach((todo) => {
    todo.order = todoArray.indexOf(todo) + 1;
  });

  completedArray = [];
  renderTodoList(todoArray);
};

//////////////////////////////////////////////////
////////////// Drag & Drop functionality

const dragStart = (e) => {
  todoElActive = e.target;
  todoActive = todoArray.find((todo) => {
    return todo.id == todoElActive.id;
  });
};

const drag = () => {};

const dragEnd = (e) => {
  const todoEl = e.target;
};

const dragEnter = (e) => {
  e.preventDefault();
};
const dragOver = (e) => {
  e.preventDefault();
  const todoOver = e.target.closest("div");
  const titleOver = e.target.closest("div");
  todoOver.classList.add("todo__over");

  if (titleOver) {
    titleOver.classList.add("heading-1--over");
  }
};
const dragLeave = (e) => {
  const todoOver = e.target.closest("div");
  todoOver.classList.remove("todo__over");

  const titleOver = e.target.closest("h1");
  if (titleOver) {
    titleOver.classList.remove("heading-1--over");
  }
};

const drop = (e) => {
  e.preventDefault();
  const todoElSwap = e.target.closest("div");
  todoSwap = todoArray.find((todo) => {
    return todo.id == todoElSwap.id;
  });

  const order = todoActive.order;
  todoActive.order = todoSwap.order;
  todoSwap.order = order;

  todoArray.sort((a, b) => {
    return a.order - b.order;
  });

  renderTodoList(todoArray);
};

///////////////////////////
// Change the theme

const themeControl = () => {
  let theme = "dark-theme";

  if (!themeSlider.checked) {
    theme = "dark-theme";
    if (btnA11y.checked) {
      theme = "dark-theme--a11y";
    }
  }

  if (themeSlider.checked) {
    theme = "light-theme";
    if (btnA11y.checked) {
      theme = "light-theme--a11y";
    }
  }

  mainContainer.classList = "";
  mainContainer.classList.add("container", `${theme}`);
};

///////////////////////////
// Initialise app

const init = () => {
  inputCreate.value = "";
  todoList.innerHTML = "";
  btnA11y.checked = false;
  themeSlider.checked = false;
  todoArray = demoItems;
  demoItems.forEach((todo) => createTodo(todo));
};
init();

//////////////////////////////////////////////////////
////////////// EVENT LISTENERS

btnCreate.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
todoList.addEventListener("keypress", deleteCheck);
sortTodoList.addEventListener("click", sortTodos);
btnClear.addEventListener("click", removeAllTodos);

themeSlider.addEventListener("click", themeControl);
btnA11y.addEventListener("click", themeControl);

overlay.addEventListener("click", closeEditModal);

createForm.addEventListener("submit", (e) => {
  e.preventDefault();
});
