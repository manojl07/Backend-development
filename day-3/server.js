const express = require('express');

const app = express();

const notes = [];

app.use(express.json())

app.post('/notes', (req, res) => {
  notes.push(req.body)
  res.send('Note Created Successfully')
})

app.get('/notes', (req, res) => {
  res.json(notes)
})

app.listen(3000, () =>{
  console.log('Server started on port: http://localhost:3000');
})