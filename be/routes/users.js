const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// GET all users (THÊM `auth` VÀO ĐÂY)
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

  // Nếu người dùng có gửi mật khẩu mới lên thì Cập nhật cả 2
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
  // Nếu không có mật khẩu mới, chỉ cập nhật Username
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
  const targetId = parseInt(req.params.id); // ID của tài khoản bị yêu cầu xóa
  const currentUserId = req.user.id;        // ID của người đang thao tác (lấy từ Token)

  // Nếu ID muốn xóa trùng với ID người đang đăng nhập -> Chặn lại
  if (targetId === currentUserId) {
    return res.status(403).json({ message: "Lỗi: Không thể tự xóa tài khoản của chính mình!" });
  }

  // Nếu không trùng thì tiến hành xóa bình thường
  db.query("DELETE FROM users WHERE id=?", [targetId], () => {
    res.json({ message: "Delete thành công" });
  });
});

module.exports = router;