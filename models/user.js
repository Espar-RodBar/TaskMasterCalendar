const mongoose = require('mongoose')
const { Schema } = mongoose

const user = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

module.user
