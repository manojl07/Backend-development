const express = require('express')

const app = express();
app.use(express.json())


const notes = [];

/* POST - method ./notes (sending) - CREATE */
app.post('/notes', (req, res) => {
  console.log(req.body);
  notes.push(req.body)
  console.log(notes);

  res.send('note created')
})

/* GET - method ./notes (Recieving) - READ */
app.get('/notes', (req, res) => {
  res.json(notes)
})

/* DELETE - method ./notes (deleting through index) - DELETE */
app.delete('/notes/:index', (req, res) => {
  delete notes[req.params.index]

  res.send('Note DELETED successfully')
})

/* PATCH - method ./notes (Partial update) - Update */
app.patch('/notes/:index', (req, res) => {
  notes[req.params.index].description = req.body.description;
  res.send('Note Updated')

})
module.exports = app;