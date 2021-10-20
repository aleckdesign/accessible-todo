// Inputs
const inputCreate = document.querySelector("#input-create");
const todoEditTitle = document.querySelector(".todo-edit__title");
const todoEditBody = document.querySelector(".todo-edit__body");

// Buttons
const btnCreate = document.querySelector("#create-todo-btn");
const btnAll = document.querySelector("#select-all");
const btnActive = document.querySelector("#select-active");
const btnCompleted = document.querySelector("#select-completed");
const btnClear = document.querySelector("#clear");

const themeSlider = document.querySelector(".theme__slider");

// Containers
const mainContainer = document.querySelector(".container");
const todoList = document.querySelector("#todo-container");
const createForm = document.querySelector(".todo__create");

// Modals
const todoEditModal = document.querySelector(".todo-edit");

// Variables - Selectors Other
let todoPanels;
let btnTodo;
let btnDelTodo;
const itemsRemaining = document.querySelector(".todo__items");

// Variables - Arrays
let todoArray = [
  { completed: true, id: 1, title: "courses", order: 1 },
  { completed: false, id: 2, title: "cheese", order: 2 },
  { completed: false, id: 3, title: "gravy", order: 3 },
];
let activeArray = [];
let completedArray = [{ completed: true, id: 1, title: "courses" }];
let todosRemaining = [];

// Variables
let todoElActive;
let todoActive;
let todoTitle;
let todoSwap;

let focusedElementBeforeModal;

// Todo Class
class Todo {
  completed = false;
  body = "";
  constructor(title, id) {
    this.title = title;
    this.id = id;
  }
}

const updateRemaining = () => {
  todosRemaining = todoArray.filter((todo) => {
    return todo.completed === false;
  });

  const items = todosRemaining.length;

  itemsRemaining.textContent = `${items} items left`;
};

//////////////////////////////////////////
// 'Unique' User ID

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

//////////////////////////////////////////
// Get todo title from user input

const getTitle = () => {
  if (inputCreate.value.length > 0) {
    return inputCreate.value;
  }
};

//////////////////////////////////////////
// Create a todo

const addTodo = () => {
  const id = uid();
  const title = getTitle();

  if (!title) return;
  // const order = todoArray. + 1;
  // console.log(order);

  const todo = new Todo(title, id);
  todoArray.push(todo);
  todo.order = todoArray.indexOf(todo) + 1;

  createTodo(todo);
  renderTodoList(todoArray);

  // console.log(todoArray);
};

//////////////////////////////////////////
// Add a todo to the list

const createTodo = (todo) => {
  // Create todo Div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo__panel");
  todoDiv.draggable = true;

  // Create List Item
  const todoEl = document.createElement("li");
  todoEl.className = "todo__panel";
  todoEl.id = todo.id;
  todoEl.setAttribute("role", "button");
  todoEl.setAttribute("aria-label", "Open todo");
  todoEl.tabIndex = "0";

  if (todo.completed) {
    todoEl.innerHTML = `
        <input type="checkbox" class="todo__btn todo__btn--complete" aria-label="Mark as complete" checked/>
        <h1 class="todo__title heading-1 complete">${todo.title}</h1>
        <button class="todo__del" aria-label="delete todo">X</button>`;
  }
  if (!todo.completed) {
    todoEl.innerHTML = `
        <input type="checkbox" class="todo__btn" aria-label="Mark as complete"/>
        <h1 class="todo__title heading-1">${todo.title}</h1>
        <button class="todo__del" aria-label="delete todo">X</button>`;
  }

  todoList.appendChild(todoEl);
};

//////////////////////////////////////////
// Enable drag drop functionality

const enableDragDrop = () => {
  todoPanels = document.querySelectorAll(".todo__panel");
  todoPanels.forEach((todoEl) => {
    // console.log(todoEl);

    // Drag
    todoEl.addEventListener("dragstart", dragStart);
    todoEl.addEventListener("drag", drag);
    todoEl.addEventListener("dragend", dragEnd);
    // Drop
    todoEl.addEventListener("dragenter", dragEnter);
    todoEl.addEventListener("dragover", dragOver);
    todoEl.addEventListener("dragleave", dragLeave);
    todoEl.addEventListener("drop", drop);
  });
};

//////////////////////////////////////////
// Edit the todo title & body

const editTodo = () => {
  todoPanels = document.querySelectorAll(".todo__panel");
  todoPanels.forEach((todoEl) => {
    todoEl.addEventListener("dblclick", openModalEdit);
    todoEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        openModalEdit(e);
      }
    });
  });
};

//////////////////////////////////////////
// Open edit todo modal dialog

const openModalEdit = (e) => {
  // Save Current focus
  focusedElementBeforeModal = document.activeElement;

  const trapTabKey = (e) => {
    console.log("here");
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

  todoEditModal.classList.remove("hidden");

  setTimeout(() => {
    firstTabStop.focus();
  }, 100);

  todoElActive = e.target.closest("li");
  todoTitle = todoElActive.querySelector(".todo__title");
  console.log(todoTitle);
  todoActive = todoArray.find((todo) => {
    return todo.id == todoElActive.id;
  });

  console.log(todoActive.title);
  console.log(todoActive);
  todoEditTitle.value = todoActive.title;
  if (todoActive.body) todoEditBody.value = todoActive.body;

  todoEditTitle.addEventListener("input", () => {
    if (todoEditTitle.value.length > 0) {
      todoActive.title = todoEditTitle.value;
      todoTitle.textContent = todoActive.title;
    }
    console.log(todoActive);
  });
  todoEditBody.addEventListener("input", () => {
    todoActive.body = todoEditBody.value;
    console.log(todoActive);
  });

  // todoEditTitle.focus();

  // console.log(todo);
};

//////////////////////////////////////////
// Close the edit modal dialog

const closeEditModal = (e) => {
  const target = e.target.className;
  const editClass = ["todo-edit", "todo-edit__title", "todo-edit__body"];

  if (e.key === "Escape") {
    todoEditModal.classList.add("hidden");
    console.log(focusedElementBeforeModal);
    focusedElementBeforeModal.focus();
    todoEditBody.value = "";
  }

  if (!editClass.includes(target)) {
    todoEditModal.classList.add("hidden");
    todoEditBody.value = "";
  }
};

//////////////////////////////////////////
// Render the todo list based on sort criteria

const renderTodoList = (sort) => {
  todoList.innerHTML = "";

  sort.forEach((todo) => createTodo(todo));
  markComplete();
  updateRemaining();
  enableDragDrop();
  editTodo();
  delTodo();
};

//////////////////////////////////////////////////
/////////////////////////////////////
// Sort todo arrays

const sortActive = (sort) => {
  console.log(todoArray);

  if (sort === "all") {
    renderTodoList(todoArray);
    // console.log(todoArray);
  }

  if (sort === "active") {
    activeArray = todoArray.filter((todo) => {
      return todo.completed === false;
    });
    renderTodoList(activeArray);
    // console.log(activeArray);
  }

  if (sort === "completed") {
    completedArray = todoArray.filter((todo) => {
      return todo.completed === true;
    });
    renderTodoList(completedArray);
    // console.log(completedArray);
  }
};

//////////////////////////////////////////////////
/////////////////////////////////////
// Mark a todo as completed

const markComplete = () => {
  btnTodo = document.querySelectorAll(".todo__btn");

  btnTodo.forEach((btn) => {
    btn.addEventListener("click", () => {
      // console.log("bob");
      let targetTodo = btn.closest("li");
      let todoTitle = btn.nextElementSibling;
      console.log(targetTodo);
      console.log(todoTitle);

      targetTodo.classList.toggle("complete");
      todoTitle.classList.toggle("complete");
      btn.classList.toggle("todo__btn--complete");

      const todoId = targetTodo.id;
      const i = todoArray.findIndex((todo) => {
        return todo.id == todoId;
      });

      todoArray[i].completed = !todoArray[i].completed;

      sortActive("completed");
      sortActive("all");
    });

    btn.addEventListener("keydown", (e) => {
      // e.preventDefault();
      // focusedElementBeforeModal = document.activeElement;
      activeButtonElement = document.activeElement;
      // console.log(focusedElementBeforeModal);
      if (e.keyCode === 32) {
        // e.preventDefault();
        // activeButtonElement.checked = !activeButtonElement.checked;
        activeButtonElement.toggleAttribute("checked");
        console.log(activeButtonElement);
        activeButtonElement.focus();
        console.log(activeButtonElement == document.activeElement);
      }
    });
  });
};

//////////////////////////////////////////
// Delete a todo

const delTodo = () => {
  btnDelTodo = document.querySelectorAll(".todo__del");

  btnDelTodo.forEach((btn) => {
    btn.addEventListener("click", () => {
      let targetTodo = btn.closest("li");

      const todoId = targetTodo.id;
      const todoIndex = todoArray.findIndex((todo) => {
        return todo.id == todoId;
      });

      todoArray.splice(todoIndex, 1);
      console.log(todoArray);
      renderTodoList(todoArray);
    });
  });
};

//////////////////////////////////////////////////
/////////////////////////////////////
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
/////////////////////////////////////
// Drag & Drop functionality

const dragStart = (e) => {
  todoElActive = e.target;
  todoActive = todoArray.find((todo) => {
    return todo.id == todoElActive.id;
  });

  // console.log(todoActive.order);

  // console.log("here", todoElActive);
};
const drag = () => {
  // console.log("draggg");
};
const dragEnd = (e) => {
  // console.log("dragend");
  const todoEl = e.target;
};

const dragEnter = (e) => {
  e.preventDefault();
  // console.log("enter");
};
const dragOver = (e) => {
  e.preventDefault();
  const todoOver = e.target.closest("li");
  const titleOver = e.target.closest("h1");
  todoOver.classList.add("todo__over");

  if (titleOver) {
    titleOver.classList.add("heading-1--over");
  }
  // console.log("over");
};
const dragLeave = (e) => {
  const todoOver = e.target.closest("li");
  todoOver.classList.remove("todo__over");

  const titleOver = e.target.closest("h1");
  if (titleOver) {
    titleOver.classList.remove("heading-1--over");
  }
};

const drop = (e) => {
  e.preventDefault();
  // console.log("drop");
  const todoElSwap = e.target.closest("li");
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

//////////////////////////////////////////////////
/////////////////////////////////////
// Initialise app

const init = () => {
  inputCreate.value = "";
  todoList.innerHTML = "";
  todoArray.forEach((todo) => createTodo(todo));
  markComplete();
  updateRemaining();
  enableDragDrop();
  editTodo();
  delTodo();

  // console.log(todoPanels);
};
init();

//////////////////////////////////////////////////////
////////////////////////////////////////
// Event Listeners

btnCreate.addEventListener("click", addTodo);

btnAll.addEventListener("click", (e) => {
  // console.log(e.target.checked);
  sortActive("all");
  btnAll.classList.add("select__label--active");
});

btnActive.addEventListener("click", () => {
  sortActive("active");
});

btnCompleted.addEventListener("click", () => {
  sortActive("completed");
});

btnClear.addEventListener("click", () => {
  removeAllTodos();
  // console.log(completedArray);
});

createForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

themeSlider.addEventListener("click", () => {
  mainContainer.classList.toggle("container--light-theme");
  mainContainer.classList.toggle("container--dark-theme");
});

// todoEditModal.addEventListener("keydown", (e) => {
//   console.log(e.key);
//   if (e.key === "Escape") {
//     todoEditModal.classList.add("hidden");
//   }
// });

window.document.addEventListener("click", closeEditModal);
