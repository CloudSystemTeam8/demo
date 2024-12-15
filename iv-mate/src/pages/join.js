import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/join.css";
import SubLogo from "../assets/sub-logo.svg";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Join = () => {
  const navigate = useNavigate();

  // 입력 상태
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  // 에러 메시지 상태
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // 상태 관리
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (!nickname.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/nick_check/${nickname}`
      );
      console.log(response);
      if (response.data.message === "success") {
        setNicknameError("");
        setIsDuplicateChecked(true);
      } else if (response.data.message === "already_exist_nickname") {
        setNicknameError("중복된 닉네임입니다.");
        setIsDuplicateChecked(false);
      }
    } catch (error) {
      setNicknameError("닉네임 확인 중 오류가 발생했습니다.");
      setIsDuplicateChecked(false);
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 검증
    let isValid = true;

    if (!email.trim()) {
      setEmailError("이메일을 입력해주세요.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!nickname.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      isValid = false;
    } else if (!isDuplicateChecked) {
      setNicknameError("닉네임 중복 확인을 해주세요.");
      isValid = false;
    } else {
      setNicknameError("");
    }

    if (!password || !rePassword) {
      setPasswordError("비밀번호를 입력해주세요.");
      isValid = false;
    } else if (password !== rePassword) {
      setRePasswordError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      setPasswordError("");
      setRePasswordError("");
    }

    if (!isValid) return;

    try {
      // 이메일 중복 확인
      const emailResponse = await axios.get(
        `${API_BASE_URL}/auth/email_check/${email}`
      );

      if (emailResponse.data.message === "already_exist_email") {
        setEmailError("이미 사용 중인 이메일입니다.");
        return;
      }

      // 회원가입 요청
      const postData = {
        email,
        nickname,
        password,
      };

      const registerResponse = await axios.post(
        `${API_BASE_URL}/auth/register`,
        postData
      );

      if (registerResponse.status === 200) {
        alert("회원가입 성공!");
        navigate("/");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      setRegisterError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <div className="logo">
        <img src={SubLogo} alt="면접MATE" />
        <h3>면접MATE</h3>
      </div>
      <div className="signup-form">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          {/* 이메일 */}
          <p>이메일</p>
          <input
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error">{emailError}</p>}

          {/* 닉네임 */}
          <p>닉네임</p>
          <div className="nickname">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              type="button"
              onClick={handleNicknameCheck}
              className={`duplicate-check-button ${
                isDuplicateChecked ? "checked" : ""
              }`}
            >
              {isDuplicateChecked ? "확인완료" : "중복확인"}
            </button>
          </div>
          {nicknameError && <p className="error">{nicknameError}</p>}

          {/* 비밀번호 */}
          <p>비밀번호</p>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="error">{passwordError}</p>}

          {/* 비밀번호 재확인 */}
          <p>비밀번호 재확인</p>
          <input
            type="password"
            placeholder="비밀번호 재확인"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
          {rePasswordError && <p className="error">{rePasswordError}</p>}

          {/* 회원가입 버튼 */}
          <button type="submit" className="signup-button">
            서비스 이용하기
          </button>
        </form>
        {registerError && <p className="error">{registerError}</p>}
      </div>
    </div>
  );
};

export default Join;
