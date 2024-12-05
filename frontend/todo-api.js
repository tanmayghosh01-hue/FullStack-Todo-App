// Fetch tasks from backend
function fetchTodos() {
  const token = localStorage.getItem('token');
  if (!token) {
      window.location.href = "login.html"; // Redirect if not logged in
      return;
  }

  fetch('http://localhost:3001/todos', {
      method: 'GET',
      headers: {
          'token': token,
      },
  })
  .then(response => response.json())
  .then(data => {
      const todoList = document.getElementById("todo-list");
      data.message.forEach(todo => {
          const li = document.createElement("li");
          li.innerHTML = `<div><div>${todo.title}</div> <div><button id="delete-todo">Delete</button></div> </div>`;
          todoList.appendChild(li);
      });
  })
  .catch(error => console.error("Error fetching todos:", error));
}

// Add a new todo item
const todoForm = document.getElementById("todo-form");
if (todoForm) {
  todoForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const todoInput = document.getElementById("todo-input").value;
      const token = localStorage.getItem("token");

      fetch('http://localhost:3001/todo', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'token': token
          },
          body: JSON.stringify({
              title: todoInput,
              done: false
          })
      })
      .then(response => response.json())
      .then(data => {
          window.location.reload();
      })
      .catch(error => console.error("Error adding todo:", error));
  });
}

const deleteButton = document.getElementById("delete-todo");

document.addEventListener('DOMContentLoaded', fetchTodos);
