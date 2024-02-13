"use strict"

async function login(event) {
  try {
    event.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    if (username === "" || password === "") return

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!data.success) {
      alert(data.message)
      return
    }

    const loggedInUser = data.user
    storageService.setUser(loggedInUser)
    window.location.href = "/home.html"
  } catch (error) {
    console.log(error)
    alert(error.message)
  }
}

async function signup(event) {
  try {
    event.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const email = document.getElementById("email").value

    if (username === "" || password === "" || email === "") {
      alert("Something went wrong!😓")
      return
    }

    const credentials = {
      username,
      password,
      email,
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()
    console.log(data)

    window.location.href = "login.html"
  } catch (error) {
    console.log(error)
  }
}

function logout() {
  storageService.clearAll()
  window.location.href = "/login.html"
}

async function init() {
  const user = storageService.getUser()

  if (!user) {
    window.location.href = "login.html"
    return
  }

  const todos = storageService.getTodos()
  if (todos.length > 0) {
    renderTodos(todos)
  } else {
    const response = await fetch(`/api/todo?userId=${user._id}`)
    const data = await response.json()
    if (!data.success) return alert(data.message)

    const loadedTodos = data.todos
    if (loadedTodos || loadedTodos.length > 0) {
      storageService.setTodos(loadedTodos)
      renderTodos(loadedTodos)
    }
  }
}

async function createTodo() {
  try {
    const todoTxt = document.getElementById("todo-input").value
    if (todoTxt === "") return
    const loggedInUser = storageService.getUser()

    const newTodo = {
      txt: todoTxt,
      isDone: false,
      creatorId: loggedInUser._id,
    }

    const response = await fetch("/api/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    })

    const data = await response.json()

    if (!data.success) {
      alert(data.message)
      return
    }

    storageService.addOneTodo(data.todo)
    const updatedTodos = storageService.getTodos()
    renderTodos(updatedTodos)
  } catch (error) {
    console.log(error)
  } finally {
    document.getElementById("todo-input").value = ""
  }
}

function renderTodos(todos) {
  //   console.log("todos in renderTodos: ", todos)
  const strHTMLSs = todos.map((todo) => {
    let className = todo.isDone ? "done" : ""

    return `
        <div class="todo-item">
            <p onclick="toggleTodo('${todo._id}')" class="${className}">${todo.txt}</p>
            <button onclick="removeTodo('${todo._id}')">Delete</button>
        </div>
    `
  })

  document.querySelector(".todo-list").innerHTML = strHTMLSs.join("")
}

async function toggleTodo(todoId) {
  try {
    const response = await fetch(`/api/todo/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })

    const data = await response.json()
    if (!data.success) {
      alert(error.message)
      return
    }

    storageService.toggleDone(todoId)
    const updatedTodos = storageService.getTodos()
    renderTodos(updatedTodos)
  } catch (error) {
    console.log(error)
  }
}

async function removeTodo(todoId) {
  try {
    const response = await fetch(`/api/todo/${todoId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    const data = await response.json()
    if (!data.success) {
      alert(error.message)
      return
    }
    storageService.removeOneTodo(todoId)
    const updatedTodos = storageService.getTodos()
    renderTodos(updatedTodos)
  } catch (error) {
    console.log(error)
  }
}
