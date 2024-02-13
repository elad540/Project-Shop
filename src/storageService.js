"use strict"

const USER_KEY = "loggedInUser"
const TODO_KEY = "todos"

const storageService = {
  getTodos() {
    const todos = JSON.parse(localStorage.getItem(TODO_KEY))
    return todos || []
  },
  setTodos(todos) {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos))
  },
  addOneTodo(newTodo) {
    const todos = this.getTodos()
    todos.push(newTodo)
    this.setTodos(todos)
  },
  removeOneTodo(todoId) {
    const todos = this.getTodos()
    const updatedTodos = todos.filter((todo) => todo._id !== todoId)
    this.setTodos(updatedTodos)
  },
  getUser() {
    const user = JSON.parse(localStorage.getItem(USER_KEY))
    return user || null
  },
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clearAll() {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TODO_KEY)
  },
  toggleDone(todoId) {
    const todos = this.getTodos()
    const updatedTodos = todos.map((todo) => {
      if (todo._id === todoId) {
        todo.isDone = !todo.isDone
      }
      return todo
    })
    this.setTodos(updatedTodos)
  },
}
