"use strict"

const { getCollection, toObjectId } = require("./dbModule.js")

const entity = "usersCollection"

async function addUser(email, username, password) {
  try {
    const collection = await getCollection(entity)
    const existUser = await collection.findOne({ username })

    if (existUser) {
      throw new Error("User already exist😢")
    }

    await collection.insertOne({ username, password, email })
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getUserByUsername(username) {
  try {
    const collection = await getCollection(entity)
    const user = await collection.findOne({ username })
    if (!user) throw new Error("User not found😢")
    const { password, ...restUserDetails } = user
    return restUserDetails
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = { addUser, getUserByUsername }

