var express = require("express");
const router = express.Router();
var db = require("../src/db.js");
var sql = require("../sql.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 이메일 체크
router.get("/email_check/:email", (req, res) => {
  const email = req.params.email;

  db.query(sql.email_check, [email], function (error, results, fields) {
    if (error) {
      return res.status(500).json({
        message: "DB_error",
      });
    }
    if (results.length > 0) {
      return res.status(200).json({
        message: "already_exist_email",
      });
    } else {
      return res.status(200).json({
        message: "success",
      });
    }
  });
});

// 닉네임 체크
router.get("/nick_check/:nickname", (req, res) => {
  const nickname = req.params.nickname;

  db.query(sql.nick_check, [nickname], function (error, results, fields) {
    if (error) {
      console.error("DB Error:", error.message);
      return res.status(500).json({
        message: "DB_error",
      });
    }
    if (results.length > 0) {
      console.log("닉네임 중복");
      return res.status(200).json({
        message: "already_exist_nickname",
      });
    } else {
      console.log("닉네임 사용가능");
      return res.status(200).json({
        message: "success",
      });
    }
  });
});

// 회원가입
router.post("/register", (req, res) => {
  const user = req.body;
  console.log(user);
  const encryptedPW = bcrypt.hash(user.password, 10); // 비밀번호 암호화

  db.query(sql.email_check, [user.email], function (error, results, fields) {
    if (error) {
      return res.status(500).json({
        message: "DB_error",
      });
    }

    // 중복 이메일이 아닌 경우
    if (results.length <= 0) {
      db.query(
        sql.register,
        [user.email, user.nickname, encryptedPW],
        function (error, data) {
          if (error) {
            return res.status(500).json({
              message: "DB_error",
            });
          }
          // 회원가입 성공
          return res.status(200).json({
            message: "success",
          });
        }
      );
    }
  });
});

// 로그인
router.post("/login", (req, res) => {
  const user = req.body;

  db.query(sql.email_check, [user.email], function (error, results, fields) {
    if (error) {
      return response.status(500).json({
        message: "DB_error",
      });
    }
    // 가입된 이메일이 맞는 경우
    if (results.length != 0) {
      db.query(sql.login, [user.email], function (error, results, fields) {
        // 암호화 된 비밀번호 확인
        const same = bcrypt.compare(user.password, results[0].password);
        if (!same) {
          // 비밀번호 불일치
          return res.status(200).json({
            message: "incorrect_pw",
          });
        }
        // 비밀번호 일치
        db.query(
          sql.user_no_get,
          [user.email],
          function (error, results, fields) {
            //토큰 생성: 로그인 정보가 일치 -> 비밀 키 생성
            const token = jwt.sign({ no: results[0].user_no }, "secret_key");

            return res.status(200).json({
              message: console.log(jwt.decode(token)),
              //jwt.decode(token).no하면 no만 불러오기 가능
              //토큰 리턴
              token: token,
              nickname: results[0].nickname,
            });
          }
        );
      });
    }
    // 등록되지 않은 이메일인 경우
    else {
      return res.status(200).json({
        message: "undefined_email",
      });
    }
  });
});

// 사용자 정보 가져오기
router.get("/userInfo", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET); // 토큰 검증
  const userNo = decoded.no;

  db.query(sql.get_userinfo, [userNo], function (error, results) {
    if (error) {
      console.error("DB Error:", error.message);
      return res.status(500).json({
        message: "DB_error",
      });
    }
    if (results[0].length === 0) {
      console.log("사용자 없음");
      return res.status(404).json({
        message: "user_not_found",
      });
    }

    return res.status(200).json({
      email: results[0].email,
      nickname: results[0].nickname,
    });
  });
});

module.exports = router;
