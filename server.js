const express = require("express");
const fs = require("fs-extra");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = path.join(__dirname, "data/users.json");
fs.ensureFileSync(DATA_FILE);

// Load users
function loadUsers() {
  try {
    return fs.readJSONSync(DATA_FILE);
  } catch {
    return [];
  }
}

// Save users
function saveUsers(users) {
  fs.writeJSONSync(DATA_FILE, users, { spaces: 2 });
}

// REGISTER
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: "All fields required" });
  }

  const users = loadUsers();
  const exists = users.find(u => u.username === username || u.email === email);
  if (exists) {
    return res.status(400).json({ success: false, error: "User already exists" });
  }

  users.push({ username, email, password });
  saveUsers(users);

  return res.json({ success: true });
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "All fields required" });
  }

  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(400).json({ success: false, error: "Invalid credentials" });
  }

  return res.json({ success: true, username: user.username });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
