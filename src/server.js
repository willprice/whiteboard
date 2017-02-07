const express = require('express')
const app = express()

app.get('/', (request, result) =>
  result.send("Hello World!")
)

app.listen(3000, () =>
  console.log("Listening on port http://localhost:3000")
)
