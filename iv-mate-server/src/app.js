const express = require("express");
const cors = require("cors");
const db = require("./db.js");
// const server = require("http").createServer(app);
require("dotenv").config();

const app = express();

// 미들웨어 설정
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true }));

// // 라우트 설정
const authRouter = require("../routes/auth.js");
app.use("/auth", authRouter);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Node.js 백엔드가 실행 중입니다!");
});

// 서버 실행
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
