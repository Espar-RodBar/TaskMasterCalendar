exports.getDate = async function getDate(request, response) {
  try {
    response.render('calendar.ejs')
  } catch (err) {
    console.log('error getting Date')
    response.status(500)
  }
}
