const express = require('express');
const noteModel = require('./model/note.model');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

// static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.post('/api/notes', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const note = await noteModel.create({ title, description });

    res.status(201).json({
      message: "Note created successfully",
      note
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await noteModel.find().sort({ createdAt: -1, _id: -1 })

    res.status(200).json({
      message: "Fetched notes successfully",
      notes
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedNote = await noteModel.findByIdAndDelete(id);

    // ✅ CHECK HERE
    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.status(200).json({
      message: "Deleted successfully!"
    });

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

app.patch("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { description, title } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

const updatedNote = await noteModel.findByIdAndUpdate(
  id,
  { title, description, updatedAt: Date.now() },
  { returnDocument: 'after' }
);

    // ✅ CHECK HERE
    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.status(200).json({
      message: "Updated successfully",
      note: updatedNote
    });

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

console.log(__dirname);

// fallback route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



module.exports = app;