// server.js

const express = require("express")
const app = express()
const path = require("path")
const userModule = require("./modules/userModule.js")
const productModule = require("./modules/productModule.js")
const ordersModule = require("./modules/ordersModule.js")

app.use(express.static("client"))
app.use(express.json())

// Login and Signup

// Landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "login.html"))
})

// User registration
app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password } = req.body
    await userModule.addUser(email, username, password)
    res.send({ success: true })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ success: false, message: error.message })
  }
})

// User login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await userModule.getUserByUsername(username)
    return res.send({ success: true, user })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ success: false, message: error.message })
  }
})

// Products

// Add product
app.post("/api/product", async (req, res) => {
  try {
    const { name, price, description } = req.body
    await productModule.addProduct(name, price, description)
    res.send({ success: true })
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message })
  }
})

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await productModule.getAllProducts()
    return res.send({ success: true, products })
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message })
  }
})

// Orders

// Place order
app.post("/api/order", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body
    await ordersModule.placeOrder(userId, productId, quantity)
    res.send({ success: true })
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message })
  }
})

// Get orders by user
app.get("/api/orders", async (req, res) => {
  try {
    const { userId } = req.query
    const orders = await ordersModule.getOrdersByUser(userId)
    return res.send({ success: true, orders })
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
