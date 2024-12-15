var express = require("express");
const router = express.Router();
var db = require("../src/db.js");
var sql = require("../sql.js");
const jwt = require("jsonwebtoken");
const { callChatGPT } = require("../src/chatgpt");

module.exports = router;

router.post("/sendInfoo", async (req, res) => {
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
    sql.get_jobinfo,
    [user_no, user.jobDetails],
    async (err, results) => {
      if (err) {
        console.error("DB 오류:", err);
        return res.status(500).json({ error: "DB 저장 실패" });
      }

      // `LAST_INSERT_ID()`로 삽입된 session_no 가져오기
      db.query(sql.get_sessionNo, async (err, rows) => {
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
        const { jobPosition, jobDetails, selfIntroduction } = req.body;
        const prompt = `
      사용자가 아래와 같은 정보를 입력했습니다:
      1. 직무: ${jobPosition}
      2. 세부 직무: ${jobDetails}
      3. 자기소개: ${selfIntroduction.trim()}

      이 정보를 바탕으로 면접 질문 5개를 만들어 주세요. 당신은 해당 분야의 전문가이며 인사 담당자입니다. 실제로 나올 법한 면접 질문을 제공해야합니다.
       무조건 5개의 질문만 '1.'과 같은 번호를 붙여 출력해야 합니다. '면접을 시작하겠습니다' 같은 다른 부가 내용이 출력되면 안됩니다.`;
        try {
          // GPT API 호출
          const gptResponse = await callChatGPT(prompt);

          // 데이터를 배열로 정리
          const questions = gptResponse
            .split("\n") // 줄바꿈 기준으로 분리
            .map((question) => question.replace(/^\d+\.\s*/, "").trim()) // 번호 제거
            .filter((question) => question); // 빈 문자열 제거

          // 최종 응답
          return res.json({
            message: "Session 시작 및 질문 생성 완료",
            session_no,
            questions,
          });
        } catch (error) {
          console.error("GPT 호출 실패:", error);
          return res
            .status(500)
            .json({ error: "Failed to generate interview questions" });
        }
      });
    }
  );
});

// 꼬리질문 생성
router.post("/generate-followup", async (req, res) => {
  const Interviews = req.body.interviewSet
    .map(
      ([question, answer], index) =>
        `Q${index + 1}: ${question}\nA${index + 1}: ${answer}`
    ) // 각 질문-답 조합을 "Q1: 질문\nA1: 답" 형식으로 변환
    .join("\n");

  const prompt = `
    아래 인터뷰 내용을 기반으로 꼬리 질문 3개를 만들어 주세요:
    ${Interviews}
    꼬리 질문 3개를 번호와 함께 작성해 주세요. 당신은 해당 분야의 전문가이며 인사 담당자입니다. 실제로 나올 법한 면접 질문을 제공해야합니다.
    무조건 3개의 질문만 '1.'과 같은 번호를 붙여 출력해야 합니다. '면접을 시작하겠습니다' 같은 다른 부가 내용이 출력되면 안됩니다.`;

  // GPT API 호출
  const gptResponse = await callChatGPT(prompt);
  console.log("GPT Response:", gptResponse);

  // 데이터를 배열로 정리
  const questions = gptResponse
    .split("\n") // 줄바꿈 기준으로 분리
    .map((question) => question.replace(/^\d+\.\s*/, "").trim()) // 번호 제거
    .filter((question) => question); // 빈 문자열 제거

  // 클라이언트로 배열 응답
  res.json({ questions });
});

router.post("/generate-feedback", async (req, res) => {
  try {
    // 사용자 토큰 검증
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_no = decoded.no;

    // 요청 데이터 확인
    const { interviewSet, session_no } = req.body;
    if (!session_no || !interviewSet) {
      return res
        .status(400)
        .json({ message: "세션 번호와 인터뷰 데이터가 필요합니다." });
    }

    console.log("사용자 번호:", user_no);
    console.log("세션 번호:", session_no);
    console.log("최종 인터뷰 데이터:", interviewSet);

    // 세션 종료 처리
    await new Promise((resolve, reject) => {
      db.query(sql.update_session, [session_no], (err, results) => {
        if (err) {
          console.error("세션 종료 오류:", err);
          return reject(new Error("Failed to end session"));
        }
        resolve(results);
      });
    });

    // GPT 요청 처리
    let interviewText = interviewSet
      .map((entry, index) => {
        return `Q${index + 1}: ${entry.question}\nA${index + 1}: ${
          entry.answer
        }`;
      })
      .join("\n\n");

    const prompt = `
    사용자가 아래와 같은 인터뷰 질문과 답변을 제공했습니다.:
    ${interviewText}
    질문과 답변은 출력하지 않으며, 각각 질문의 대한 피드백만 한 문단으로 도출하세요. 각 질문에 대한 피드백이 무조건 있어야 합니다.
    또한 마지막에는 전체 답변에 대한 피드백을 한문단으로 주며, 
    각 피드백은 사용자가 자신의 답변을 돌아볼 수 있게 비판적 내용으로 구성하고 개선할 부분이 있으면
     구체적으로 언급해주세요.`;

    const ai_result_content = await callChatGPT(prompt);

    console.log("GPT 피드백 결과:", ai_result_content);

    // 결과 저장
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

    // 최종 응답
    return res.json({
      message: "Session 종료 및 피드백 생성 완료",
      result_no,
    });
  } catch (error) {
    console.error("오류 발생:", error);
    return res.status(500).json({ error: error.message });
  }
});

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

//AI 피드백 불러오기
router.get("/getAIResult", (req, res) => {
  // 사용자 토큰 검증
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user_no = decoded.no;
  const session_no = req.query.session_no;

  if (!session_no) {
    return res.status(400).json({ message: "Session 번호가 필요합니다." });
  }

  console.log(user_no, session_no);

  db.query(sql.get_airesult, [user_no, session_no], (err, results) => {
    if (err) {
      console.error("오류:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    console.log(results);
    res.json(results[0]); // AI 피드백 반환
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
      return res
        .status(500)
        .json({ error: "Failed to fetch interview information" });
    }
    res.json(results);
  });
});

module.exports = router;

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
