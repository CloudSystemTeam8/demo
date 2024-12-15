import React from "react";
import "../css/home.css";
import { useNavigate } from "react-router-dom";
import HomeLogo from "../assets/main-logo.svg";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSimulation = () => {
    navigate("/app/simulation");
  };
  return (
    <div className="homepage">
      <div className="homepage-header">
        <h3>자기소개서를 활용한 AI 기반 면접 도우미</h3>
        <img src={HomeLogo} alt="면접MATE" />
      </div>
      <button className="start-button" onClick={handleSimulation}>
        면접 시뮬레이션 시작하기
      </button>
      <div className="homepage-content">
        <h2>면접 MATE 사용법</h2>
        <ul>
          <li>각각의 질문에 예시 사진을 참고하여 답변을 작성하세요.</li>
          <li>
            답변을 다 작성하셨으면 '끝내기' 버튼을 눌러 시뮬레이션을 종료하세요.
          </li>
          <li>AI 분석 결과를 통해 개선점을 확인하세요.</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
