const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Database setup
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Single endpoint: Add note
app.post("/api/addNote", (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Note content cannot be empty." });
  }

  db.run("INSERT INTO notes (content) VALUES (?)", [content], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, content });
  });
});

// Get all notes
app.get("/api/getNotes", (req, res) => {
  db.all("SELECT * FROM notes ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
