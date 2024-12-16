import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/simulation.css";

const Simulation = () => {
  const navigate = useNavigate();
  const [jobPosition, setJobPosition] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가
  const maxLength = 1500;

  const handleNextClick = async () => {
    try {
      // 모든 입력값이 있는지 확인
      if (!jobPosition || !jobDetails || !selfIntroduction) {
        setErrorMessage("모든 필드를 작성해주세요.");
        return;
      }

      // AI 정보 전송
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/ai/sendInfoo`,
        {
          jobPosition,
          jobDetails,
          selfIntroduction,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      console.log("AI 응답:", response.data.questions);
      console.log("세션번호", response.data.session_no);

      // 시뮬레이션 페이지로 이동
      navigate("/app/test", {
        state: {
          questions: response.data.questions,
          session_no: response.data.session_no,
        },
      });
    } catch (error) {
      console.error("AI 정보 전송 실패:", error);
      setErrorMessage("정보를 전송하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="simulation-container">
      <div className="simulation-view">
        <div className="simulation-header">
          <h2 className="simulation-title">자기소개서 및 정보 입력하기</h2>
          <p className="simulation-time">{new Date().toLocaleString()}</p>
        </div>

        <div className="simulation-form">
          <div className="form-group">
            <label htmlFor="job-position">직무 입력하기</label>
            <select
              id="job-position"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
            >
              <option value="">직무 선택</option>
              <option value="Developer">개발자</option>
              <option value="Designer">디자이너</option>
              <option value="Marketer">마케터</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="job-details">직무 상세 선택하기</label>
            <select
              id="job-details"
              value={jobDetails}
              onChange={(e) => setJobDetails(e.target.value)}
            >
              <option value="">직무 상세 선택</option>
              <option value="Frontend">프론트엔드</option>
              <option value="Backend">백엔드</option>
              <option value="Fullstack">풀스택</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="self-introduction">자기소개서 입력</label>
            <textarea
              id="self-introduction"
              placeholder="자기소개서 작성 유의사항 및 예시를 참고하여 작성하세요."
              value={selfIntroduction}
              onChange={(e) => {
                if (e.target.value.length <= maxLength) {
                  setSelfIntroduction(e.target.value);
                }
              }}
            />
            <p className="char-count">
              {selfIntroduction.length} / {maxLength}자
            </p>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button
            className="next-button"
            onClick={handleNextClick}
            disabled={!jobPosition || !jobDetails || !selfIntroduction}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
