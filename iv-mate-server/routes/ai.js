var express = require("express");
const router = express.Router();
var db = require("../src/db.js");
var sql = require("../sql.js");
const jwt = require("jsonwebtoken");

module.exports = router;

router.post("/sendInfoo", (req, res) => {
  // 사용자 토큰 검증
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user_no = decoded.no;

  let session_no;
  const user = req.body;
  if (!user) {
    return res.status(400).json({ message: "직무 정보가 필요합니다." });
  }

  console.log("사용자 번호:", user_no, "직무:", user.jobDetails);

  // DB 세션 생성
  db.query(
    `INSERT INTO SESSION (user_no, session_job, session_status) VALUES (?, ?, '진행중')`,
    [user_no, user.jobDetails],
    (err, results) => {
      if (err) {
        console.error("DB 오류:", err);
        return res.status(500).json({ error: "DB 저장 실패" });
      }

      // `LAST_INSERT_ID()`로 삽입된 session_no 가져오기
      db.query("SELECT LAST_INSERT_ID() AS session_no", (err, rows) => {
        if (err) {
          console.error("ID 조회 실패:", err);
          return res.status(500).json({ error: "Session ID 조회 실패" });
        }

        session_no = rows[0]?.session_no;
        if (!session_no) {
          return res
            .status(500)
            .json({ error: "Session ID를 찾을 수 없습니다." });
        }

        console.log("생성된 세션 번호:", session_no);

        // GPT 질문 생성
        const rawResponse =
          "1. 본인을 간단히 소개해주세요.\n2. 왜 이 회사에 지원하게 되었나요?\n3. 과거에 어려웠던 경험을 어떻게 극복했는지 설명해 주세요.\n4. 현재까지의 경력을 통해 얻은 교훈 중에서 가장 큰 것은 무엇이었나요?\n5. 마지막 포부를 말씀해주세요.";

        // 질문 배열로 변환
        const questions = rawResponse
          .split("\n")
          .map((question) => question.replace(/^\d+\.\s*/, "").trim())
          .filter((question) => question);

        // 최종 응답
        return res.json({
          message: "Session 시작 및 질문 생성 완료",
          session_no,
          questions,
        });
      });
    }
  );
});

// 꼬리질문 생성
router.post("/generate-followup", (req, res) => {
  const init_ques = req.body;
  console.log(init_ques);

  //  gpt 요청 코드

  const rawResponse =
    "1. 꼬리질문1 본인을 간단히 소개해주세요.\n2. 꼬리질문2 왜 이 회사에 지원하게 되었나요?\n3. 꼬리질문3 과거에 어려웠던 경험을 어떻게 극복했는지 설명해 주세요.";

  // 데이터를 배열로 정리
  const questions = rawResponse
    .split("\n") // 줄바꿈 기준으로 분리
    .map((question) => question.replace(/^\d+\.\s*/, "").trim()) // 번호 제거
    .filter((question) => question); // 빈 문자열 제거

  // 클라이언트로 배열 응답
  res.json({ questions });
});

router.post("/generate-feedback", async (req, res) => {
  try {
    // 1. 사용자 토큰 검증
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_no = decoded.no;

    // 2. 요청 데이터 확인
    const { session_no, interviewSet } = req.body;
    if (!session_no || !interviewSet) {
      return res
        .status(400)
        .json({ message: "세션 번호와 인터뷰 데이터가 필요합니다." });
    }

    console.log("사용자 번호:", user_no);
    console.log("세션 번호:", session_no);
    console.log("최종 인터뷰 데이터:", interviewSet);

    // 3. 세션 종료 처리
    await new Promise((resolve, reject) => {
      db.query(sql.update_session, [session_no], (err, results) => {
        if (err) {
          console.error("세션 종료 오류:", err);
          return reject(new Error("Failed to end session"));
        }
        resolve(results);
      });
    });

    // 4. GPT 요청 처리 (테스트용으로 하드코딩된 데이터 사용)
    const ai_result_content = "GPT에서 생성된 피드백 데이터";

    // 5. 결과 저장
    const result_no = await new Promise((resolve, reject) => {
      db.query(
        sql.save_airesult,
        [user_no, session_no, ai_result_content],
        (err, results) => {
          if (err) {
            console.error("결과 저장 오류:", err);
            return reject(new Error("Database query failed"));
          }
          resolve(results.insertId); // 방금 삽입된 결과 ID 반환
        }
      );
    });

    // 6. 최종 응답
    return res.json({
      message: "Session 종료 및 피드백 생성 완료",
      result_no,
    });
  } catch (error) {
    console.error("오류 발생:", error);
    return res.status(500).json({ error: error.message });
  }
});

// //세션 생성(직무, 자소서 정보 저장)
// router.post("/sendInfo", (req, res) => {
//   const { user_no, session_job } = req.body;

//   db.query(sql.get_jobinfo, [user_no, session_job], (err, results) => {
//     if (err) {
//       console.error("오류: ", err);
//       return res.status(500).json({ error: "Database query failed" });
//     }
//     res.json({ message: "Session 시작", data: results });
//   });
// });

//인터뷰 내용 저장
router.post("/saveInterview", (req, res) => {
  // 사용자 토큰 검증
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user_no = decoded.no;

  const {
    interview_question_no,
    session_no,
    interview_question,
    interview_answer,
  } = req.body;
  console.log(req.body);

  db.query(
    sql.save_interview,
    [
      user_no,
      session_no,
      interview_question,
      interview_answer,
      interview_question_no,
    ],
    (err, results) => {
      if (err) {
        console.error("오류: ", err);
        return res.status(500).json({ error: "Database query failed" });
      }
      res.json({ message: "Interview 저장됨", data: results });
    }
  );
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

// //AI 피드백 저장
// router.post("/saveAIResult", (req, res) => {
//   const { user_no, session_no, ai_result_content } = req.body;

//   db.query(
//     sql.save_airesult,
//     [user_no, session_no, ai_result_content],
//     (err, results) => {
//       if (err) {
//         console.error("오류:", err);
//         return res.status(500).json({ error: "Database query failed" });
//       }
//       res.json({ message: "AI 피드백 저장됨", data: results });
//     }
//   );
// });

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

// //세션 종료
// router.post("/endSession", (req, res) => {
//   const { session_no } = req.body;

//   db.query(sql.update_session, [session_no], (err, results) => {
//     if (err) {
//       console.error("오류:", err);
//       return res.status(500).json({ error: "Failed to end session" });
//     }
//     res.json({ message: "Session 종료됨", data: results });
//   });
// });

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
      return res
        .status(500)
        .json({ error: "Failed to fetch interview information" });
    }
    res.json(results);
  });
});

module.exports = router;
