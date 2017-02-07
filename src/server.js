const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.get('/', (request, result) =>
  result.send('Hello World!')
)

app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
)
