"use strict"

const { getCollection } = require("./dbModule.js")

const entity = "ordersCollection"

async function placeOrder(userId, productId, quantity) {
  try {
    const collection = await getCollection(entity)
    await collection.insertOne({ userId, productId, quantity, status: "pending" })
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getOrdersByUser(userId) {
  try {
    const collection = await getCollection(entity)
    const orders = await collection.find({ userId }).toArray()
    return orders
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = { placeOrder, getOrdersByUser }
