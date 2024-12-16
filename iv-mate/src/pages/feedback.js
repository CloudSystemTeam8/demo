import React, { useEffect, useState } from "react";
import "../css/feedback.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Feedback = () => {
  const location = useLocation(); // 세션번호 받기
  const session_no = location.state?.session_no; // 전달받은 세션 번호
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(""); // 피드백 상태
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

  useEffect(() => {
    const getAiFeedback = async () => {
      if (!session_no) {
        setErrorMessage("세션 번호가 없습니다.");
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/ai/getAIResult`,
          {
            params: { session_no },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        setFeedback(response.data.ai_result_content); // 피드백 설정
      } catch (error) {
        console.error("AI 정보 불러오기 실패:", error);
        setErrorMessage("정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    getAiFeedback();
  }, [session_no]);

  const handleHomeClick = () => {
    navigate("/app/home");
  };

  return (
    <div className="feedback-container">
      <div className="feedback-view">
        <div className="feedback-header">
          <h2 className="feedback-title">면접 MATE의 피드백</h2>
        </div>
        <div className="feedback-form">
          {errorMessage ? (
            <p className="error">{errorMessage}</p>
          ) : (
            <div className="feedback-content">
              <p>{feedback}</p>
              <button className="back-button" onClick={handleHomeClick}>
                홈으로 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
