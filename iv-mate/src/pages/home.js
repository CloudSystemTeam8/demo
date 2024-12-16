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
          <li>
            면접 시뮬레이션을 클릭하여 다음과 같이 직무를 선택하고 자기소개서를
            작성해주세요.
          </li>
          <li>
            AI가 생성한 질문에 답변해주세요. 처음 답변은 5개가 생성되어
            진행됩니다.
          </li>
          <li>5개의 질문이 진행된 뒤 두 개의 버튼을 확인 할 수 있습니다.</li>
          <li>
            꼬리질문 생성하기 버튼은 답변하신 내용을 바탕으로 3개의 질문이
            추가로 생성됩니다.
          </li>
          <li>
            피드백 받기 버튼을 선택하면 답변하신 내용을 바탕으로 AI가 생성한
            피드백을 확인할 수 있습니다.
          </li>
          <li>
            마이페이지에서는 이제까지 했던 시뮬레이션의 기록을 확인할 수 있으며
            생성된 질문, 사용자의 답변, AI의 피드백을 확인할 수 있습니다.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
