router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Check USERS table
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
        admin
      });
    }

    return res.status(400).json({ message: "User not found" });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});