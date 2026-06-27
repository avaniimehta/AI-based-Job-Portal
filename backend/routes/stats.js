import express from 'express';
import pool from '../config/db.js';


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [[{ totalJobs }]]        = await pool.query('SELECT COUNT(*) as totalJobs FROM jobs');
    const [[{ totalUsers }]]       = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalApps }]]        = await pool.query('SELECT COUNT(*) as totalApps FROM applications');
    const [[{ selected }]]         = await pool.query("SELECT COUNT(*) as selected FROM applications WHERE status='Selected'");
    const [byStatus]               = await pool.query('SELECT status, COUNT(*) as count FROM applications GROUP BY status');
    const [topJobs]                = await pool.query(
      `SELECT j.title, j.company, COUNT(a.id) as applications
       FROM jobs j LEFT JOIN applications a ON j.id = a.job_id
       GROUP BY j.id ORDER BY applications DESC LIMIT 5`
    );
    const [recentApps]             = await pool.query(
      `SELECT a.created_at, u.name as user_name, j.title, j.company, a.status
       FROM applications a JOIN users u ON a.user_id=u.id JOIN jobs j ON a.job_id=j.id
       ORDER BY a.created_at DESC LIMIT 5`
    );
    res.json({ totalJobs, totalUsers, totalApps, selected, byStatus, topJobs, recentApps });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
