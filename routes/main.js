const authController = require('../controllers/auth')
const express = require('express')
const mainRouter = express.Router()

mainRouter.get('/login', authController.getLogin)
mainRouter.post('/login', authController.postLogin)
mainRouter.get('/signup', authController.getSignUp)
mainRouter.post('/signup', authController.postSignUp)
mainRouter.get('/logout', authController.logout)
mainRouter.get('/', authController.index)
module.exports = mainRouter
