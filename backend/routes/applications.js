import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ APPLY JOB
router.post("/", async (req, res) => {
  try {
    const { job_id, user_id } = req.body;

    if (!job_id || !user_id) {
      return res.status(400).json({ message: "Missing job_id or user_id" });
    }

    await db.query(
      "INSERT INTO applications (job_id, user_id, status) VALUES (?, ?, ?)",
      [job_id, user_id, "Applied"]
    );

    res.json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("APPLY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET ALL APPLICATIONS (admin)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        applications.id,
        applications.status,
        applications.created_at,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.type,
        jobs.salary,
        users.id   AS user_id,
        users.name AS user_name,
        users.email AS user_email,
        users.phone AS user_phone,
        profiles.skills,
        profiles.experience,
        profiles.resume_link
      FROM applications
      JOIN jobs    ON applications.job_id  = jobs.id
      JOIN users   ON applications.user_id = users.id
      LEFT JOIN profiles ON applications.user_id = profiles.user_id
      ORDER BY applications.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("FETCH ALL APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE APPLICATION STATUS (admin)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const VALID_STATUSES = ["Applied", "Under Review", "Interview", "Selected", "Rejected"];
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const [result] = await db.query(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET MY APPLICATIONS (student) — must come after PUT /:id
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const [rows] = await db.query(`
      SELECT
        applications.id,
        applications.status,
        applications.created_at,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.type,
        jobs.salary
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.user_id = ?
      ORDER BY applications.created_at DESC
    `, [user_id]);

    res.json(rows);
  } catch (err) {
    console.error("FETCH APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
