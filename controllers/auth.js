const User = require('../models/user')
const validator = require('validator')

exports.auth = function (request, response, next) {
  if (request.session && request.session.user) {
    return next()
  } else response.redirect('/login')
}

exports.postLogin = async (request, response) => {
  const { username, password } = request.body

  const query = User.where({ userName: username, password: password })

  try {
    const userFound = await query.findOne()

    if (userFound) {
      request.session.user = userFound.userName
      request.session.userid = userFound.id
      response.redirect('/')
    } else {
      console.log('Invalid username or password')
      response.redirect('/login')
    }
  } catch (err) {
    console.log('error on post login: ', err)
    response.send('error')
  }
}

exports.getLogin = (request, response) => {
  if (request.session.userid) {
    response.redirect('/')
  } else response.render('login.ejs')
}

exports.getSignUp = (request, response) => {
  response.render('signup.ejs')
}

exports.postSignUp = async (request, response) => {
  const { name, username, password } = request.body
  // check if the fields are not empty and the password is correct
  if (username && name && password[0] && password[0] === password[1]) {
    // check if the user exist
    const userFound = await User.findOne({ userName: username }).exec()

    if (userFound) {
      return response.redirect('/signup')
    }
    const dbUser = new User({
      name: name,
      userName: username,
      password: password[0],
    })
    try {
      await dbUser.save()
      response.redirect('/login')
    } catch (err) {
      console.log('Error saving user')
      response.redirect('/signup')
    }
  } else {
    console.log('bad input values')
    response.redirect('/signup')
  }
}

exports.logout = (request, response) => {
  request.session.destroy()
  response.redirect('/')
}

exports.index = async function (request, response) {
  const today = new Date()
  // Date counts month from 0 -> 11. So  +1 to convert to  1 -> 12
  const month = today.getMonth() + 1
  const year = today.getFullYear()
  const url = `/dates/${year}/${month}`
  const user = request.session.user
  response.status(200).render('index.ejs', { user, calendarUrl: url })
}
