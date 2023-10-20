const express = require('express')
const sessions = require('express-session')
const connectDB = require('./config/database')
const logger = require('morgan')
const cors = require('cors')
const ejs = require('ejs')
const login = require('./controllers/login')
const signup = require('./controllers/signup')

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

///////////////
// Task Data
function Task() {
  return {
    title: '',
    user: 0,
    day: null,
    month: null,
    year: null,
    startHour: null,
    startMinutes: null,
    endMinutes: null,
    endHour: null,
    deleted: false,
  }
}
const taskAr = []

// Routes
app.route('/login').get(login.getLogin).post(login.postLogin)
app
  .route('/')
  .get(auth, (req, res) => res.render('calendar.ejs', { tasks: taskAr }))
// .get(auth, (req, res) => res.sendFile(__dirname + '/public/calendar.html'))

app.route('/tasks').post(auth, postTaskHandler)
app.route('/signup').get(signup.getSignUp).post(signup.postSignUp)
app.route('/logout').get((request, response) => {
  request.session.destroy()
  response.redirect('/')
})

//////////////////
// TASKS POST
function addTaskBD(task, date, start, duration, userId) {
  const newTask = Task()
  const [year, month, day] = date.split('-')
  const [hour, minutes] = start.split(':')
  newTask.day = day
  newTask.month = month
  newTask.year = year
  newTask.startHour = Number(hour)
  newTask.startMinutes = Number(minutes)
  newTask.endHour = Number(hour) + Number(duration)
  newTask.endMinutes = Number(minutes)
  newTask.title = task
  newTask.user = userId

  taskAr.push(newTask)
}

addTaskBD('sala polivalent', '2023-10-19', '15:30', 2, 'id111')
addTaskBD('sala televisio', '2023-10-19', '15:30', 1, 'id111')
addTaskBD('sala ordinadors', '2023-10-19', '15:30', 3, 'id111')
console.log(taskAr)

function postTaskHandler(request, response) {
  const { task, timeStart, duration, taskDate } = request.body
  if (taskDate && task && timeStart && duration > 0) {
    const newTask = Task()
    const [year, month, day] = taskDate.split('-')
    const [hour, minutes] = timeStart.split(':')
    newTask.day = day
    newTask.month = month
    newTask.year = year
    newTask.startHour = hour
    newTask.startMinutes = minutes
    newTask.endHour = hour + duration
    newTask.endMinutes = minutes
    newTask.title = task
    newTask.user = request.session.userid

    taskAr.push(newTask)
    console.log(taskAr)
    response.status(200).redirect('/')
  } else {
    response.status(400).redirect('/')
  }
}

// Open server port
app.listen(8000, () => {
  console.log('server running... port 8000')
})
