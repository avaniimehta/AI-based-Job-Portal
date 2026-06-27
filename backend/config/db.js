import mysql from "mysql2";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "jobportal"
});

// ✅ TEST CONNECTION
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB CONNECTION FAILED:", err);
  } else {
    console.log("✅ Connected to jobportal database");
    connection.release();
  }
});

export default db.promise();