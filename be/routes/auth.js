const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken"); 

const SECRET = "SECRET_KEY";

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, result) => {
            if (err) return res.json(err);

            if (result.length > 0) {
                const token = jwt.sign({ id: result[0].id, username: result[0].username }, SECRET, { expiresIn: '1h' });

                res.json({
                    success: true,
                    user: result[0],
                    token: token 
                });
            } else {
                res.json({ success: false });
            }
        }
    );
});

module.exports = router;