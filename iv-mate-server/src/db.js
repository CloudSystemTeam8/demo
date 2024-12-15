import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "interviewmate",
  password: "sook1906!",
  database: "interviewmate",
});
db.connect();

export default db;
