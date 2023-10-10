const express = require('express')
require('dotenv').config()

const app = express()

app.get('/', (request, response) => {})

app.listen(8000, () => {
  console.log('server running')
})
