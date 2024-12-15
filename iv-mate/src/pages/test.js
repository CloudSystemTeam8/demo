import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../css/test.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Test = () => {
  const location = useLocation(); // 질문 데이터 받기
  const questions = location.state?.questions || []; // 전달된 질문 데이터
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false); // 꼬리질문 여부
  const [feedback, setFeedback] = useState(false); // 피드백 준비 여부

  // 현재 질문 가져오기
  const currentQuestion = questions[currentQuestionIndex];

  // 다음 질문으로 이동
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1); // 다음 질문으로 이동
      console.log(currentQuestionIndex);
    } else if (!isFollowUp) {
      setIsFollowUp(true); // 꼬리질문 준비
    } else {
      setFeedback(true); // 피드백 준비
    }
  };

  // 답변 전송 및 저장
  const handleSendAnswer = async () => {
    try {
      await axios.post(`${API_BASE_URL}/save-answer`, {
        index: currentQuestionIndex,
        question: questions[currentQuestionIndex],
        answer: answers[currentQuestionIndex] || "",
      });
    } catch (error) {
      console.error("답변 저장 실패", error);
    }

    // 다음 질문으로 이동
    handleNextQuestion();
  };

  // 꼬리질문 요청
  const handleFollowUp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/generate-followup`);
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        ...response.data.questions,
      ]);
      setCurrentQuestionIndex(questions.length); // 새 질문 시작
    } catch (error) {
      console.error("꼬리질문 생성 실패", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 피드백 요청
  const handleFeedback = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-feedback`, {
        questions,
        answers,
      });
      console.log("GPT 피드백:", response.data.feedback);
      alert("피드백이 생성되었습니다!");
    } catch (error) {
      console.error("피드백 생성 실패", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>로딩 중... 잠시만 기다려주세요.</p>; // 로딩 메시지
  }

  return (
    <div className="test-container">
      <h2>면접 시뮬레이션</h2>
      {currentQuestionIndex < questions.length && (
        <div className="question-box">
          <h3>{currentQuestion}</h3>
          <div className="answer-box">
            <textarea
              placeholder="답변을 작성해주세요"
              value={answers[currentQuestionIndex] || ""}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [currentQuestionIndex]: e.target.value,
                })
              }
            />
            <div className="send_button">
              <button
                onClick={handleSendAnswer}
                disabled={!answers[currentQuestionIndex]}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}

      {isFollowUp && !feedback && (
        <div className="followup-container">
          <button onClick={handleFollowUp}>꼬리질문 받기</button>
          <button onClick={handleFeedback}>면접 피드백 받기</button>
        </div>
      )}

      {feedback && (
        <div className="followup-container">
          <button onClick={handleFeedback}>면접 피드백 받기</button>
        </div>
      )}
    </div>
  );
};

export default Test;
