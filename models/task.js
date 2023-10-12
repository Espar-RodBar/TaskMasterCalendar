const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
  title: { type: String, required: true },
  user: { type: number, required: false },
  startDate: { type: date, required: true },
  endDate: { type: date, required: true },
  deleted: { type: Boolean, default: false },
})

module.exports = mongoose.model('Task', taskSchema)
