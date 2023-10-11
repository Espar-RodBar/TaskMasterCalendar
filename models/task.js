const mongoose = require('mongoose')
const { Schema } = mongoose

const task = new Schema({
  title: { type: String, required: true },
  user: { type: number, required: false },
  startDate: { type: date, required: true },
  endDate: { type: date, required: true },
  deleted: { type: Boolean, default: false },
})

module.exports = mongoose.model('Task', schema)
