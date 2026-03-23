const express = require('express') // express import karna

const app = express(); // server instance create krna

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/about', (req, res) => {
  res.send('This is about page')
})

app.listen(3000, () => {
  console.log('Server started on post: 3000');
}) // server ko start krna