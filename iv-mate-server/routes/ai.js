var express = require("express");
const router = express.Router();
var db = require("../src/db.js");
var sql = require("../sql.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = router;

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