const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../fe")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../fe/login.html"));
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});