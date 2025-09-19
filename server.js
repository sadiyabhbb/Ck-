const express = require("express");
const fs = require("fs-extra");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = path.join(__dirname, "data/urls.json");
const USER_FILE = path.join(__dirname, "data/users.json");
fs.ensureFileSync(DATA_FILE);
fs.ensureFileSync(USER_FILE);

// ---------- Helpers ----------
function loadJSON(file) {
  try {
    return fs.readJSONSync(file);
  } catch {
    return [];
  }
}
function saveJSON(file, data) {
  fs.writeJSONSync(file, data, { spaces: 2 });
}

// ---------- Auth ----------
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username & password required" });

  let users = loadJSON(USER_FILE);
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: "User already exists" });
  }

  users.push({ username, password });
  saveJSON(USER_FILE, users);
  res.json({ success: true, message: "Registered successfully!" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let users = loadJSON(USER_FILE);

  let user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ success: true, message: "Login successful!" });
});

// ---------- Monitor API ----------
async function pingURL(item) {
  try {
    const start = Date.now();
    const res = await axios.get(item.url, { timeout: 10000 });
    const time = Date.now() - start;
    return {
      ...item,
      status: res.status >= 200 && res.status < 400 ? "✅ Online" : "❌ Down",
      responseTime: time,
      lastChecked: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    };
  } catch {
    return {
      ...item,
      status: "❌ Down",
      responseTime: null,
      lastChecked: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    };
  }
}

app.get("/status", async (req, res) => {
  const urls = loadJSON(DATA_FILE);
  const results = await Promise.all(urls.map(pingURL));
  res.json(results);
});

app.post("/add", (req, res) => {
  const { url, name } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  const urls = loadJSON(DATA_FILE);
  urls.push({ url, name: name || url, addedTime: Date.now() });
  saveJSON(DATA_FILE, urls);

  res.json({ success: true });
});

app.post("/remove", (req, res) => {
  const { url } = req.body;
  let urls = loadJSON(DATA_FILE);
  urls = urls.filter(item => item.url !== url);
  saveJSON(DATA_FILE, urls);
  res.json({ success: true });
});

// ---------- Start ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
