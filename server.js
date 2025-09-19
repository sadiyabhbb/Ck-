const express = require("express");
const fs = require("fs-extra");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const URLS_FILE = path.join(__dirname, "data/urls.json");
const USERS_FILE = path.join(__dirname, "data/users.json");

fs.ensureFileSync(URLS_FILE);
fs.ensureFileSync(USERS_FILE);

// Load URLs
function loadURLs() {
  try { return fs.readJSONSync(URLS_FILE); } catch { return []; }
}

// Save URLs
function saveURLs(urls) { fs.writeJSONSync(URLS_FILE, urls, { spaces: 2 }); }

// Load Users
function loadUsers() {
  try { return fs.readJSONSync(USERS_FILE); } catch { return []; }
}

// Save Users
function saveUsers(users) { fs.writeJSONSync(USERS_FILE, users, { spaces: 2 }); }

// Ping URL
async function pingURL(item) {
  try {
    const start = Date.now();
    const res = await axios.get(item.url, { timeout: 10000 });
    const time = Date.now() - start;

    let uptime = 'N/A';
    if(item.addedTime){
      const durationMs = Date.now() - item.addedTime;
      const minutes = Math.floor(durationMs / 60000);
      const hours = Math.floor(minutes/60);
      const days = Math.floor(hours/24);
      uptime = `${days}d ${hours%24}h ${minutes%60}m`;
    }

    return {
      ...item,
      status: res.status >= 200 && res.status < 400 ? "✅ Online" : "❌ Down",
      responseTime: time,
      lastChecked: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
      uptime
    };
  } catch {
    let uptime = 'N/A';
    if(item.addedTime){
      const durationMs = Date.now() - item.addedTime;
      const minutes = Math.floor(durationMs / 60000);
      const hours = Math.floor(minutes/60);
      const days = Math.floor(hours/24);
      uptime = `${days}d ${hours%24}h ${minutes%60}m`;
    }
    return {
      ...item,
      status: "❌ Down",
      responseTime: null,
      lastChecked: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
      uptime
    };
  }
}

// ---- UPTIME MONITOR ROUTES ----
app.get("/status", async (req, res) => {
  const urls = loadURLs();
  const results = await Promise.all(urls.map(pingURL));
  res.json(results);
});

app.post("/add", async (req, res) => {
  const { url, name } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });
  const urls = loadURLs();
  urls.push({ url, name: name || url, addedTime: Date.now(), author: "LIKHON AHMED" });
  saveURLs(urls);
  res.json({ success: true });
});

app.post("/remove", (req, res) => {
  const { url } = req.body;
  let urls = loadURLs();
  urls = urls.filter(item => item.url !== url);
  saveURLs(urls);
  res.json({ success: true });
});

// ---- USER AUTH ROUTES ----
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: "Username & Password required" });
  const users = loadUsers();
  if(users.find(u=>u.username===username)) return res.status(400).json({ error: "Username already exists" });
  users.push({ username, password });
  saveUsers(users);
  res.json({ success:true });
});

app.post("/login", (req,res)=>{
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: "Username & Password required" });
  const users = loadUsers();
  const user = users.find(u=>u.username===username && u.password===password);
  if(!user) return res.status(400).json({ error:"Invalid credentials" });
  res.json({ success:true, username:user.username });
});

// ---- START SERVER ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
