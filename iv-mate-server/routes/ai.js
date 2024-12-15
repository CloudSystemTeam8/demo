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
});
