import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ================= GET PROFILE =================
router.get("/profile", async (req, res) => {
  try {
    // Accept user_id from query param (sent by frontend) or fall back to 1
    const user_id = req.query.user_id || 1;

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone,
              p.resume_link, p.photo_link, p.skills, p.experience, p.education, p.bio
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= UPDATE PROFILE =================
router.put("/profile", async (req, res) => {
  try {
    const {
      user_id,
      name,
      phone,
      resume_link,
      photo_link,
      skills,
      experience,
      education,
      bio,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    await pool.query(
      "UPDATE users SET name=?, phone=? WHERE id=?",
      [name, phone, user_id]
    );

    await pool.query(
      `INSERT INTO profiles (user_id, resume_link, photo_link, skills, experience, education, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         resume_link=?, photo_link=?, skills=?, experience=?, education=?, bio=?`,
      [
        user_id, resume_link, photo_link, skills, experience, education, bio,
        resume_link, photo_link, skills, experience, education, bio,
      ]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= SAVE PROFILE (FRONTEND CALL) =================
router.post("/profile", async (req, res) => {
  try {
    const { user_id, skills, experience, education, bio } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const [existing] = await pool.query(
      "SELECT * FROM profiles WHERE user_id = ?",
      [user_id]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE profiles 
         SET skills=?, experience=?, education=?, bio=? 
         WHERE user_id=?`,
        [skills, experience, education, bio, user_id]
      );
    } else {
      await pool.query(
        `INSERT INTO profiles (user_id, skills, experience, education, bio) 
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, skills, experience, education, bio]
      );
    }

    res.json({ message: "Profile saved successfully" });
  } catch (err) {
    console.error("SAVE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= ADMIN: GET ALL USERS =================
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.created_at,
              p.skills, p.experience, p.education, p.resume_link
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       ORDER BY u.name`
    );

    res.json(rows);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
