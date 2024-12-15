var express = require("express");
const router = express.Router();
var db = require("../src/db.js");
var sql = require("../sql.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = router;

router.post("/sendInfoo", (req, res) => {
  const user = req.body;
  console.log(user);

  const rawResponse =
    "1. 본인을 간단히 소개해주세요.\n2. 왜 이 회사에 지원하게 되었나요?\n3. 과거에 어려웠던 경험을 어떻게 극복했는지 설명해 주세요.\n4. 현재까지의 경력을 통해 얻은 교훈 중에서 가장 큰 것은 무엇이었나요?\n5. 마지막 포부를 말씀해주세요.";

  // 데이터를 배열로 정리
  const questions = rawResponse
    .split("\n") // 줄바꿈 기준으로 분리
    .map((question) => question.replace(/^\d+\.\s*/, "").trim()) // 번호 제거
    .filter((question) => question); // 빈 문자열 제거

  // 클라이언트로 배열 응답
  res.json({ questions });

//세션 생성(직무, 자소서 정보 저장)
router.post("/sendInfo", (req, res) => {
  const { user_no, session_job } = req.body;
  
  db.query(sql.get_jobinfo, [user_no, session_job], (err, results) => {
    if (err) {
      console.error("오류: ", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json({ message: "Session 시작", data: results });
  });

});

//인터뷰 내용 저장
router.post("/saveInterview", (req, res) => {
  const { user_no, session_no, interview_question, interview_answer, interview_question_no } = req.body;

  db.query(sql.save_interview, [user_no, session_no, interview_question, interview_answer, interview_question_no], (err, results) => {
    if (err) {
      console.error("오류: ", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json({ message: "Interview 저장됨", data: results });
  });
});

//인터뷰 내용 조회(gpt 전송 위함)
router.get("/getInterview", (req, res) => {
  const { session_no } = req.query; // 세션 번호로 조회

  db.query(sql.get_interview, [session_no], (err, results) => {
    if (err) {
      console.error("오류: :", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results); // 면접 질문과 답변 반환
  });
});

//AI 피드백 저장
router.post("/saveAIResult", (req, res) => {
  const { user_no, session_no, ai_result_content } = req.body;

  db.query(sql.save_airesult, [user_no, session_no, ai_result_content], (err, results) => {
    if (err) {
      console.error("오류:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json({ message: "AI 피드백 저장됨", data: results });
  });
});

//AI 피드백 불러오기
router.get("/getAIResult", (req, res) => {
  const { user_no, session_no } = req.query; // 사용자 번호와 세션 번호로 조회

  db.query(sql.get_airesult, [user_no, session_no], (err, results) => {
    if (err) {
      console.error("오류:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results); // AI 피드백 반환
  });
});

//세션 종료
router.post("/endSession", (req, res) => {
  const { session_no } = req.body;

  db.query(sql.update_session, [session_no], (err, results) => {
    if (err) {
      console.error("오류:", err);
      return res.status(500).json({ error: "Failed to end session" });
    }
    res.json({ message: "Session 종료됨", data: results });
  });
});

//사용자 인터뷰 시간 정보 전송
router.get("/getSessionDate", (req, res) => {
  const { user_no } = req.query;

  db.query(sql.get_sessiondate, [user_no], (err, results) => {
    if (err) {
      console.error("오류:", err);
      return res.status(500).json({ error: "Failed to fetch session dates" });
    }
    res.json(results);
  });
});

//세션 별 사용자 인터뷰 정보 조회
router.get("/getDateInterview", (req, res) => {
  const { user_no, selected_date } = req.query;

  db.query(sql.get_dateinterview, [user_no, selected_date], (err, results) => {
    if (err) {
      console.error("오류:", err);
      return res.status(500).json({ error: "Failed to fetch interview information" });
    }
    res.json(results);
  });
});

module.exports = router;