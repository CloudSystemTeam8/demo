import express from "express";
import cors from "cors";
import db from "./db.js";
import { callChatGPT } from "./chatgpt.js";
import dotenv from 'dotenv';
dotenv.config();
// const server = require("http").createServer(app);

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
// app.use("/api/", recordsRoutes);
// const authRouter = require("./routes/auth");
// app.use("/auth", authRouter);
// 기본 라우트
app.get("/", (req, res) => {
  res.send("Node.js 백엔드가 실행 중입니다!");
  res.render('askgpt', {pass: true})
});

//ask 라우트 추가: 면접 질문 생성 요청을 받음
app.post("/ask", async (req, res) => {
  const prompt = "면접 질문 5개 생성해줘"; // 이 부분을 사용자가 원하는 질문으로 동적으로 바꿀 수도 있음
  const response = await callChatGPT(prompt);

  if (response) {
    res.json({ response: response });
  } else {
    res.status(500).json({ error: 'ChatGPT API 호출 실패' });
  }
});


// 서버 실행
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
