const express = require('express')
const { auth } = require('../controllers/auth')
const tasksController = require('../controllers/tasks')
const tasksRouter = express.Router()

tasksRouter.get('/', auth, tasksController.getTasks)
tasksRouter.get('/tasks/:year/:month', auth, tasksController.getTasksMonth)
tasksRouter.get('/tasks/:year/:month/:day', auth, tasksController.getTaskDay)
tasksRouter.post('/tasks/', auth, tasksController.postTaskDay)
tasksRouter.put('/tasks/:idTask', auth, tasksController.deleteTask)

module.exports = tasksRouter
