const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
  taskName: { type: String, required: true },
  userName: { type: String, required: false },
  userId: { type: String, required: false },
  day: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  startHour: { type: Number, required: true },
  startMinutes: { type: Number, required: true },
  endMinutes: { type: Number, required: true },
  endHour: { type: Number, required: true },
  deleted: { type: Boolean, default: false },
})

module.exports = mongoose.model('Task', taskSchema)
