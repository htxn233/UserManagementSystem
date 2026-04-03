const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// GET all users 
router.get("/", auth, (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    res.json(results);
  });
});

// CREATE
router.post("/", auth, (req, res) => {
  const { username, password } = req.body;

  db.query(
    "INSERT INTO users(username, password) VALUES (?,?)",
    [username, password],
    (err, result) => {
      res.json({ message: "Tạo user thành công" });
    }
  );
});

// UPDATE
router.put("/:id", auth, (req, res) => {
  const { username, password } = req.body;
  const userId = req.params.id;

  // If user provided a new password, update both username and password
  if (password && password.trim() !== "") {
    db.query(
      "UPDATE users SET username=?, password=? WHERE id=?",
      [username, password, userId],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cập nhật Username và Password thành công" });
      }
    );
  } 

  // If user did not provide a new password, only update the username
  else {
    db.query(
      "UPDATE users SET username=? WHERE id=?",
      [username, userId],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cập nhật Username thành công" });
      }
    );
  }
});

// DELETE
router.delete("/:id", auth, (req, res) => {
  const targetId = parseInt(req.params.id); // ID of the user to be deleted (from URL parameter)
  const currentUserId = req.user.id;        // ID of the user performing the action (from Token)

  // If the ID to delete matches the current user's ID -> Block the action
  if (targetId === currentUserId) {
    return res.status(403).json({ message: "Error: Cannot delete your own account!" });
  }

  // If the IDs don't match, proceed with deletion
  db.query("DELETE FROM users WHERE id=?", [targetId], () => {
    res.json({ message: "Delete successful" });
  });
});

module.exports = router;