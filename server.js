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

///////////////
// Task Data
// function Task() {
//   return {
//     taskName: '',
//     userId: 0,
//     day: null,
//     month: null,
//     year: null,
//     startHour: null,
//     startMinutes: null,
//     endMinutes: null,
//     endHour: null,
//     deleted: false,
//   }
// }
const taskAr = []

// Routes
app.route('/login').get(authController.getLogin).post(authController.postLogin)
app
  .route('/')
  .get(auth, (req, res) => res.render('calendar.ejs', { tasks: taskAr }))

app.route('/tasks').post(auth, postTaskHandler)
app
  .route('/signup')
  .get(authController.getSignUp)
  .post(authController.postSignUp)
app.route('/logout').get((request, response) => {
  request.session.destroy()
  response.redirect('/')
})

//////////////////
// TASKS POST

const Task = require('./models/task')

async function postTaskHandler(request, response) {
  console.log('tasks post:', request.body)
  const { taskName, timeStart, duration, taskDate } = request.body
  if (taskDate && taskName && timeStart && duration > 0) {
    const [year, month, day] = taskDate.split('-')
    const [hour, minutes] = timeStart.split(':')
    const newTask = new Task({
      day: day,
      month: month,
      year: year,
      startHour: Number(hour).toString().padStart(2, '0'),
      startMinutes: minutes,
      endHour: (Number(hour) + Number(duration)).toString().padStart(2, '0'),
      endMinutes: minutes,
      taskName: taskName,
      userId: request.session.userid,
    })

    try {
      newTask.save()
      response.status(200).redirect('/')
    } catch (err) {
      response.status(500)
      console.log('error crating task in db')
    }
  } else {
    response.status(400).redirect('/')
  }
}

// Open server port
app.listen(8000, () => {
  console.log('server running... port 8000')
})
