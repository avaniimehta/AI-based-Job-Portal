import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ================= GET ALL JOBS =================
router.get("/", async (req, res) => {
  try {
    const [jobs] = await db.query("SELECT * FROM jobs");
    res.json(jobs);
  } catch (err) {
    console.error("GET JOBS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET SINGLE JOB =================
router.get("/", async (req, res) => {
  try {
    const [jobs] = await db.query("SELECT * FROM jobs");
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= CREATE JOB =================
router.post("/", async (req, res) => {
  try {
    const { title, company, location, salary, description } = req.body;

    await db.query(
      "INSERT INTO jobs (title, company, location, salary, description) VALUES (?, ?, ?, ?, ?)",
      [title, company, location, salary, description]
    );

    res.json({ message: "Job created successfully" });
  } catch (err) {
    console.error("CREATE JOB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE JOB =================
router.put("/:id", async (req, res) => {
  try {
    const { title, company, location, salary, description } = req.body;

    await db.query(
      "UPDATE jobs SET title=?, company=?, location=?, salary=?, description=? WHERE id=?",
      [title, company, location, salary, description, req.params.id]
    );

    res.json({ message: "Job updated successfully" });
  } catch (err) {
    console.error("UPDATE JOB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DELETE JOB =================
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM jobs WHERE id = ?", [req.params.id]);

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("DELETE JOB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;