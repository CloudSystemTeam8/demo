import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/join.css";
import SubLogo from "../assets/sub-logo.svg";

const Join = () => {
  const navigate = useNavigate();
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false); // 중복 확인 상태 관리

  // 중복 확인 버튼 클릭
  const handleDuplicateCheck = () => {
    // 중복 확인 로직 (추후 백엔드 연동 필요)
    setIsDuplicateChecked(true);
  };

  // 회원가입하기
  const handleSubmit = () => {
    // 중복 확인 로직 (추후 백엔드 연동 필요)
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="logo">
        <img src={SubLogo} alt="면접MATE" />
        <h3>면접MATE</h3>
      </div>
      <div className="signup-form">
        <h2>회원가입</h2>
        <form>
          <p>이메일</p>
          <input type="email" placeholder="이메일" required />
          <p>닉네임</p>
          <div className="nickname">
            <input type="text" placeholder="닉네임" required />
            <button
              type="button"
              onClick={handleDuplicateCheck}
              className={`duplicate-check-button ${
                isDuplicateChecked ? "checked" : ""
              }`}
            >
              {isDuplicateChecked ? "확인완료" : "중복확인"}
            </button>
          </div>
          <p>비밀번호</p>
          <input type="password" placeholder="비밀번호" required />
          <p>비밀번호 재확인</p>
          <input type="password" placeholder="비밀번호 재확인" required />
          <button
            type="submit"
            className="signup-button"
            onClick={handleSubmit}
          >
            서비스 이용하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Join;
