const path = require('path')
const express = require('express')
const app = express()

app.use(express.static(path.join(__dirname, '..', 'build')))
app.use(express.static('public'))

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
