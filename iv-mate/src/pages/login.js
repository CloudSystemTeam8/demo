import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios import 추가
import "../css/login.css";
import SubLogo from "../assets/sub-logo.svg";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [pwdError, setPwdError] = useState("");
  const navigate = useNavigate();

  const handleLoginClick = async (e) => {
    e.preventDefault(); // 오타 수정: `preventDefualt` → `preventDefault`

    // 입력값 검증
    if (!email.trim()) {
      setLoginError("이메일을 입력해주세요.");
      return;
    } else {
      setLoginError("");
    }

    if (!password.trim()) {
      setPwdError("비밀번호를 입력해주세요.");
      return;
    } else {
      setPwdError("");
    }

    try {
      // API 요청
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: email.trim(),
        password: password.trim(),
      });

      // 서버 응답 처리
      if (response.data.message === "incorrect_pw") {
        setPwdError("비밀번호가 틀렸습니다.");
      } else if (response.data.message === "undefined_email") {
        setLoginError("이메일이 존재하지 않습니다. 회원가입을 해주세요.");
      } else {
        localStorage.setItem("userToken", response.data.token); // 토큰 저장
        //localStorage.setItem("userNickname", response.data.nickname); //닉네임 저장
        navigate("/app/home");
      }
    } catch (error) {
      setLoginError("서버 오류. 로그인 불가");
    }
  };

  const handleJoinClick = () => {
    navigate("/join");
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src={SubLogo} alt="면접MATE" />
        <h3>면접MATE</h3>
      </div>
      <div className="login-form">
        <h2>로그인</h2>
        <form onSubmit={handleLoginClick}>
          {/* 이메일 입력 */}
          <p>이메일</p>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {loginError && <p className="error">{loginError}</p>}

          {/* 비밀번호 입력 */}
          <p>비밀번호</p>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {pwdError && <p className="error">{pwdError}</p>}

          {/* 로그인 버튼 */}
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="divider">
          <hr />
          <span>참여하기</span>
          <hr />
        </div>

        {/* 회원가입 버튼 */}
        <button className="join-button" onClick={handleJoinClick}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
