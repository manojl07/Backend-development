const express =
  require("express");

const router =
  express.Router();

const note =
  require("../controllers/note.controller");

const {
  verifyAccessToken
} = require("../middlewares/auth.middleware");


// ================= NOTES =================

router.post(
  "/",
  verifyAccessToken,
  note.createNote
);

router.get(
  "/",
  verifyAccessToken,
  note.getNotes
);

router.patch(
  "/:id",
  verifyAccessToken,
  note.updateNote
);

router.delete(
  "/:id",
  verifyAccessToken,
  note.deleteNote
);

module.exports =
  router;