import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // insert new user
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    res.json({ message: "Registration successful" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN ATTEMPT:", email, password);

    // 🔹 Check USERS table (Job Seeker)
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length > 0) {
      const user = users[0];

      if (password !== user.password) {
        return res.status(400).json({ message: "Invalid password" });
      }

      return res.json({
        message: "User login successful",
        type: "user",
        user
      });
    }

    // 🔹 Check ADMINS table
    const [admins] = await db.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (admins.length > 0) {
      const admin = admins[0];

      if (password !== admin.password) {
        return res.status(400).json({ message: "Invalid password" });
      }

      return res.json({
        message: "Admin login successful",
        type: "admin",
        user: admin
      });
    }

    // ❌ No user found
    return res.status(400).json({ message: "User not found" });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET USERS (optional) =================
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    console.error("FETCH USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;