const User = require('../models/user')
const validator = require('validator')

exports.postLogin = async (request, response) => {
  const { username, password } = request.body

  const query = User.where({ userName: username, password: password })

  try {
    const userFound = await query.findOne()

    if (userFound) {
      request.session.user = userFound.userName
      request.session.userid = userFound.id
      console.log(request.session)
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
  console.log('get login', request.session)
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
      console.log('existing user')
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
