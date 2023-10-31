const task = require('../models/task')
const Task = require('../models/task')

exports.getTasks = async function (request, response) {
  const today = new Date()
  // Date counts month from 0 -> 11. So  +1 to convert to  1 -> 12
  const month = today.getMonth() + 1
  const year = today.getFullYear()
  response.status(200).redirect(`/dates/${year}/${month}`)
}

exports.getTaskDay = async function (request, response) {
  const { year, month, day } = request.params
  const deleted = false
  try {
    const tasksToday = await Task.find({ month, year, day, deleted })
    response.status(200).send({ status: 200, body: JSON.stringify(tasksToday) })
  } catch (err) {
    console.log('error getting tasks')
    response.status(500)
  }
}

exports.getTasksMonth = async function (request, response) {
  const { year, month } = request.params
  const deleted = false
  try {
    const tasksToday = await Task.find({ month, year, deleted })
    response.status(200).send({ status: 200, body: JSON.stringify(tasksToday) })
  } catch (err) {
    console.log('error getting tasks')
    response.status(500)
  }
}

exports.postTaskDay = async function (request, response) {
  const { taskName, timeStart, duration, taskDate } = request.body
  if (taskDate && taskName && timeStart && duration > 0) {
    let [year, month, day] = taskDate.split('-')
    month = (Number(month) + 1).toString() // months from 0-11 to 1-12
    const [hour, minutes] = timeStart.split(':')
    const newTask = new Task({
      day: day,
      month: month,
      year: year,
      startHour: Number(hour),
      startMinutes: minutes,
      endHour: Number(hour) + Number(duration),
      endMinutes: minutes,
      taskName: taskName.trim(),
      userId: request.session.userid,
      userName: request.session.user,
    })

    try {
      newTask.save()
      response.status(200).redirect(`/dates/${year}/${month}`)
    } catch (err) {
      response.status(500)
      console.log('error creating task in db')
    }
  } else {
    response.status(400).redirect('/')
  }
}

exports.deleteTask = async function (request, response) {
  const id = request.params.idTask
  const user = request.session.userid
  // change deleted property to true
  try {
    const taskToDelete = await Task.findOneAndUpdate(
      { _id: id, userId: user },
      { deleted: true }
    )
    console.log('task to delete: ', taskToDelete)
    console.log('deleted task: ', id, user)

    response.status(200).send('ok')
  } catch (err) {
    console.log('not found or error deleting', err)
  }
}
