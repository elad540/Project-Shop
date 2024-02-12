"use strict"

const { getCollection } = require("./dbModule.js")

const entity = "productsCollection"

async function addProduct(name, price, description) {
  try {
    const collection = await getCollection(entity)
    await collection.insertOne({ name, price, description })
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getAllProducts() {
  try {
    const collection = await getCollection(entity)
    const products = await collection.find({}).toArray()
    return products
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = { addProduct, getAllProducts }
