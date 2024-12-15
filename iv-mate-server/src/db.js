const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "interviewmate",
  password: "sook1906!",
  database: "interviewmate",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err.message);
    return;
  }
  console.log("MySQL 연결 성공");
});

module.exports = db;
