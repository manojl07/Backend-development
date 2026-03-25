const express = require('express')

const app = express();

app.use(express.json())

const notes = [];

/* POST - method ./notes (sending) - CREATE */
app.post('/notes', (req, res) => {
  notes.push(req.body)

  res.status(201).json({
    message: "Note Created Successfully"
  })
})

/* GET - method ./notes (Recieving) - READ */
app.get('/notes', (req, res) => {
  res.status(200).json({
    notes: notes
  })
})

/* DELETE - method ./notes (deleting through index) - DELETE */
app.delete('/notes/:index', (req, res) => {
  delete notes[req.params.index]

  res.status(204).json({
    message: 'Note deleted successfully'
  })
})

/* PATCH - method ./notes (Partial update) - Update */
app.patch('/notes/:index', (req, res) => {
  notes[req.params.index].description = req.body.description

  res.status(200).json({
    message:  'note updated successfully'
  })
})



module.exports = app;