const express = require('express');
const noteModel = require('./model/note.model');

const app = express();
app.use(express.json());

app.post('/notes', async (req, res) => {
  const { title, description } = req.body;

  const note = await noteModel.create({ title, description })
  res.status(201).json({
    message: "Note created successfully",
    note
  })
})

app.get("/notes", async (req, res) => {
  const notes = await noteModel.find();

  res.status(200).json({
    message: "Fetched notes successfully",
    notes
  })
})

app.delete("/notes/:id", async (req, res) => {
  const id = req.params.id;

  await noteModel.findByIdAndDelete(id);

  res.status(200).json({
    message: "deleted successfully!"
  })
})

app.patch("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;

  await noteModel.findByIdAndUpdate(id, { description });

  res.status(200).json({
    message: "Updated successfully",
  })
})






module.exports = app;