const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const USERS_FILE = path.join(__dirname, "data/users.json");
fs.ensureFileSync(USERS_FILE);

// Load users
function loadUsers() {
    try {
        return fs.readJSONSync(USERS_FILE);
    } catch {
        return [];
    }
}

// Save users
function saveUsers(users) {
    fs.writeJSONSync(USERS_FILE, users, { spaces: 2 });
}

// Register
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "All fields required" });

    const users = loadUsers();
    const exists = users.find(u => u.email === email);
    if (exists) return res.status(400).json({ error: "Email already registered" });

    users.push({ username, email, password });
    saveUsers(users);
    res.json({ success: true, username });
});

// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    res.json({ success: true, username: user.username });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
