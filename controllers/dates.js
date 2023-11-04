exports.getDate = async function getDate(request, response) {
  try {
    const user = request.session.user
    response.render('calendar.ejs', { user })
  } catch (err) {
    console.log('error getting Date')
    response.status(500)
  }
}
