const express = require('express');
const noteModel = require('./model/notes.model');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// POST _ Create
app.post("/api/notes", async (req, res) => {
  const { title, description } = req.body;

  const note = await noteModel.create({ title, description });

  res.status(201).json({
    message: "Note created successfully",
    note
  })
})

// GET - Fetch
app.get("/api/notes", async (req, res) => {
  const notes = await noteModel.find();

  res.status(200).json({
    message: "Fetched all notes successfully",
    notes
  })
})
module.exports = app;

// DELETE
app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;

  await noteModel.findByIdAndDelete(id);

  res.status(200).json({
    message: "Deleted note successfully"
  })
})

// UPDATE - Patch
app.patch("/api/notes/:id", async (req, res) => {
  const id = req.params.id;

  const { description, title } = req.body;

  const updatedNote = await noteModel.findByIdAndUpdate(
    id,
    {title, description},
    {new: true}
  );

  res.status(200).json({
    message: "Updated Successfully",
    note: updatedNote
  })
})
