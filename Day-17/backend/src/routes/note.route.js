const express = require('express')

const router = express.Router();

const note = require('../controller/note.controller');

const { verifyAccessToken } = require('../middleware/auth.middleware')

// ================ NOTES =================
router.post("/", verifyAccessToken, note.createNote)
router.get('/', verifyAccessToken, note.getNotes)
router.patch('/:id', verifyAccessToken, note.updateNote)
router.delete('/:id', verifyAccessToken, note.deletedNote)

module.exports = router;