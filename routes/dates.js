const express = require('express')
const { auth } = require('../controllers/auth')
const datesController = require('../controllers/dates')
const datesRouter = express.Router()

datesRouter.get('/dates/:year/:month/:day?', auth, datesController.getDate)

module.exports = datesRouter
