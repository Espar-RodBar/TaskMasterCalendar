const express = require('express')
const sessions = require('express-session')
const connectDB = require('./config/database')
const logger = require('morgan')
const cors = require('cors')
const ejs = require('ejs')
const authController = require('./controllers/auth')

require('dotenv').config()

// Connect to mongo
connectDB()

const app = express()

// config sessions session middleware
const oneDay = 1000 * 60 * 60 * 24
app.use(
  sessions({
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true,
  })
)

// Config logger
app.use(logger('tiny'))

// parsing the incoming data
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// adding ejs
app.set('view engine', 'ejs')

var auth = function (request, response, next) {
  if (request.session && request.session.user) {
    return next()
  } else response.redirect('/login')
}

//serving public file
app.use(express.static('public'))

// Routes
app.route('/login').get(authController.getLogin).post(authController.postLogin)
app.route('/').get(auth, getTasksHandler)

app.route('/dates/:year/:month/:day?').get(auth, getDate)
app.route('/tasks/:year/:month/:day?').get(auth, getTasksMonthHandler)
app.route('/tasks').get(auth, getTaskDayHandler).post(auth, postTaskDayHandler)
app
  .route('/signup')
  .get(authController.getSignUp)
  .post(authController.postSignUp)
app.route('/logout').get((request, response) => {
  request.session.destroy()
  response.redirect('/')
})

////////////////////
// DATE GET
async function getDate(request, response) {
  try {
    response.render('calendar.ejs')
  } catch (err) {
    console.log('error getting Date')
    response.status(500)
  }
}
/////////////
// TASKS GET
async function getTasksHandler(request, response) {
  const today = new Date()
  const day = today.getDate()
  // Date counts month from 0 -> 11. So  +1 to convert to  1 -> 12
  const month = today.getMonth() + 1
  const year = today.getFullYear()
  console.log('getTaskHandler:', today, day, month, year)
  response.status(200).redirect(`/dates/${year}/${month}`)
}
async function getTaskDayHandler(request, response) {}

async function getTasksMonthHandler(request, response) {
  const { year, month, day } = request.params
  try {
    const tasksToday = day
      ? await Task.find({ month, year, day })
      : await Task.find({ month, year })
    console.log(tasksToday)
    response.status(200).send({ status: 200, body: JSON.stringify(tasksToday) })
  } catch (err) {
    console.log('error getting tasks')
    response.status(500)
  }
}

//////////////////
// TASKS POST

const Task = require('./models/task')

async function postTaskDayHandler(request, response) {
  const { taskName, timeStart, duration, taskDate } = request.body
  if (taskDate && taskName && timeStart && duration > 0) {
    let [year, month, day] = taskDate.split('-')
    month = (Number(month) + 1).toString() // months from 0-11 to 1-12
    const [hour, minutes] = timeStart.split(':')
    const newTask = new Task({
      day: day,
      month: month,
      year: year,
      startHour: Number(hour).toString().padStart(2, '0'),
      startMinutes: minutes,
      endHour: (Number(hour) + Number(duration)).toString().padStart(2, '0'),
      endMinutes: minutes,
      taskName: taskName.trim(),
      userId: request.session.userid,
    })

    try {
      newTask.save()
      console.log(year, month)
      response.status(200).redirect(`/dates/${year}/${month}`)
    } catch (err) {
      response.status(500)
      console.log('error creating task in db')
    }
  } else {
    response.status(400).redirect('/')
  }
}

// Open server port
app.listen(8000, () => {
  console.log('server running... port 8000')
})
