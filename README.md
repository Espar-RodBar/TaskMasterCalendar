# TaskMasterCalendar

With Todo-List-Calendar a group of people (friends, job partners, ..) can add task, selecting day and time.

**Link to project:** http://

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, MongoDb, Mongoose, NodeJS and Express

This app is created mainly in Javascript, using node for the backend and javascript for the client side. MongoDB is used to store the users and the data saved for the calendar.

The calendar is created in the client side, while the data is managed by the server, using mongodb and moongose for the models of user and tasks.

## Optimizations

- Refact task controller: some duplication code.
- Add an email and the use of difficult password, with a server side validator for the input data.
- Add a reset password function.
- Add a user panel, with all the task, and some configuration options.
- The app only shows the task from the signed user. A nice feature to add can be to make some task private or public,
  so other can see them.

## Lessons Learned:

With this project i use the express-sessions to keep control of the user signed in the app.
Struggle a little with bcrypt hashing the password.
Rethinking the schemas of tasks, first i used dates in the fields, but later switch it to just numbers. Easier to just play with numerical fields values, and no issues with different dates representation from the frontend and the backend.

From the views, i used partials to DRY the templates avoiding duplicate code.
