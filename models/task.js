const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
  title: { type: String, required: true },
  user: { type: number, required: false },
  day: { type: number, required: true },
  month: { type: number, required: true },
  year: { type: number, required: true },
  startHour: { type: number, required: true },
  endHour: { type: number, required: true },
  deleted: { type: Boolean, default: false },
})

module.exports = mongoose.model('Task', taskSchema)
