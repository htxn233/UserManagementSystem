const jwt = require("jsonwebtoken");

const SECRET = "SECRET_KEY";

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401);
    req.user = decoded;
    next();
  });
};