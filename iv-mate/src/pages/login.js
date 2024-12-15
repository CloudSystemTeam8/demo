import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import SubLogo from "../assets/sub-logo.svg";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // 중복 확인 로직 (추후 백엔드 연동 필요)
    navigate("app/home");
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
        <form>
          <p>이메일</p>
          <input type="email" placeholder="이메일" required />
          <p>비밀번호</p>
          <input type="password" placeholder="비밀번호" required />
          <button
            type="submit"
            className="login-button"
            onClick={handleLoginClick}
          >
            로그인
          </button>
        </form>
        <div className="divider">
          <hr />
          <span>참여하기</span>
          <hr />
        </div>
        <button className="join-button" onClick={handleJoinClick}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
