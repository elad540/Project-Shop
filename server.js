const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
const path = require("path")
const userModule = require("./modules/userModule.js")
const productsModule = require("./modules/productsModule.js")

app.use(express.static("public"))
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signin.html"))
})

app.post("/api/signup", async (req, res) => {
    try {
        const { email, username, password } = req.body
        await userModule.addUser(email, username, password)
        res.send({ success: true })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ success: false, message: error.message })
    }
})

app.post("/api/signin", async (req, res) => {
    try {
        const { username } = req.body
        const user = await userModule.getUserByUsername(username)
        return res.send({ success: true, user })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ success: false, message: error.message })
    }
})

app.post("/api/products", async (req, res) => {
    try {
        const newOrder = await ordersModule.placeOrder(userId, productId, quantity)
        return res.send({ success: true, products: newOrder })
    } catch (error) {
        return res.status(400).send({ success: false, message: error.message })
    }
})
app.post("/api/buy", async (req, res) => {
    try {
        // const newOrder = await ordersModule.placeOrder(userId, productId, quantity)
        return res.send({ success: true, products: newOrder })
    } catch (error) {
        return res.status(400).send({ success: false, message: error.message })
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
