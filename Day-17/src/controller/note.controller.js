const noteModel = require('../model/note.model');
const nodeModel = require('../model/note.model')

// ================= CREATE NOTE =================
exports.createNote = async (req, res, next) => {
  try {
    const { title, description } = rq.body;

    if (!title || !description) return res.status(400).json({
      message: "All fields are required"
    })

    const note = await noteModel.create({
      title, description, user: req.user.id,
    })

    res.status(201).json({
      message: "Note created successfully",
      note
    })
  } catch (error) {
    next(error);
  }
}

// ================= GET NOTES =================
exports.getNotes = async (req, res, next) => {
  try {
    const notes = await noteModel.find({ user: req.user.id })

    res.status(200).json({
      message: "Fetched notes successfully",
      notes
    })
  } catch (error) {
    next(err)
  }
}

// ================= DELETE NOTE =================
exports.deletedNote = async (req, res, next) => {
  try {
    const deletedNote = await noteModel.findByIdAndDelete({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!deletedNote) return res.status(404).json({ message: "Note not found" })

    res.status(200).json({ message: "Note Deleted Successfully" })
  } catch (error) {
    next(error)
  }
}

// ================= UPDATE NOTE =================
exports.updateNote = async (req, res, next) => {
  try {
    const {title, description} = req.body;

    if(!title || !description) return res.status(400).json({message: "All fields required!"})
    
    const updatedNoted = await noteModel.findByIdAndUpdate(
      {_id: req.params.id, user: req.user.id},
      {title, description},
      {returndocument: "after"}
    )

    if(!updatedNote) return res.status(404).json({message: "Note note found"})
    
    res.status(200).json({
      message: "Note Updated Successfully",
      note: updatedNoted,
    })
  } catch (error) {
    next(error)
  }
}