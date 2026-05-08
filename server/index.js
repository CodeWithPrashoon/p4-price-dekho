require("dotenv").config(); // 🔥 This must be line 1!
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// ─── 1. CONNECT TO DATABASE (Using Environment Variable) ───
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// ─── 2. USER SCHEMA ───
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

// Using Secret Key from .env
const JWT_SECRET = process.env.JWT_SECRET;

// ─── 3. AUTHENTICATION ROUTES ───
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
    res.json({ token, user: { name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ error: "Registration failed." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password!" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

// ─── 4. SEARCH & ALERTS ───
app.get("/search", async (req, res) => {
  const query = req.query.q || "best deals";
  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "amazon", k: query, amazon_domain: "amazon.in",
        api_key: process.env.SERPAPI_KEY // 🔥 Secret API Key
      }
    });

    const items = response.data.shopping_results || response.data.organic_results || [];
    const products = items.map((item) => {
      const amazonPrice = item.price?.value || item.extracted_price || 1000;
      return {
        name: item.title,
        image: item.thumbnail,
        prices: [
          { site: "Amazon", price: amazonPrice, link: item.link },
          { site: "Flipkart", price: Math.max(amazonPrice - 500, 1), link: `https://www.flipkart.com/search?q=${item.title}` },
          { site: "Croma", price: Math.max(amazonPrice - 300, 1), link: `https://www.croma.com/searchB?q=${item.title}` }
        ]
      };
    });
    res.json(products);
  } catch (err) { res.json([]); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));