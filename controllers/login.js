const User = require('../models/user')

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
  // session = request.session
  if (request.session.userid) {
    response.redirect('/')
  } else response.render('login.ejs')
}
