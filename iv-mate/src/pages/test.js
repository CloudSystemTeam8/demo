import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/test.css";

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowUp, setIsFollowUp] = useState(false); // 꼬리질문 여부
  const [feedbackReady, setFeedbackReady] = useState(false); // 피드백 준비 여부

  // API URL 설정
  const BASE_URL = "https://your-api-endpoint.com"; // API 엔드포인트를 여기에 입력하세요.

  // 페이지 로딩 시 질문 생성 요청
  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      try {
        const userInfo = { userId: "noonsong@sookmyung.ac.kr" }; // 사용자 정보 예시
        const response = await axios.post(
          `${BASE_URL}/generate-questions`,
          userInfo
        );
        setQuestions(response.data.questions); // GPT로부터 받은 질문 저장
      } catch (error) {
        console.error("질문 생성 실패", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // 다음 질문으로 이동
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1); // 다음 질문으로 이동
    } else if (currentQuestionIndex === questions.length - 1 && !isFollowUp) {
      setFeedbackReady(true); // 피드백 버튼 표시
    } else {
      setFeedbackReady(true); // 꼬리질문 완료 후 피드백 준비
    }
  };

  // 답변 전송 및 저장
  const handleSendAnswer = async () => {
    try {
      await axios.post(`${BASE_URL}/save-answer`, {
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
      const response = await axios.get(`${BASE_URL}/generate-followup`);
      setQuestions(response.data.questions); // 꼬리질문 리스트로 변경
      setCurrentQuestionIndex(0); // 인덱스 초기화
      setIsFollowUp(true); // 꼬리질문 진행 상태 변경
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
      const response = await axios.post(`${BASE_URL}/generate-feedback`, {
        questions,
        answers,
      });
      console.log("GPT 피드백:", response.data.feedback);
      alert("피드백이 생성되었습니다!"); // 임시 메시지
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
          <h3>{questions[currentQuestionIndex]}</h3>
          <textarea
            placeholder="답변을 작성해주세요"
            value={answers[currentQuestionIndex] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [currentQuestionIndex]: e.target.value })
            }
          />
          <button
            onClick={handleSendAnswer}
            disabled={!answers[currentQuestionIndex]}
          >
            전송
          </button>
        </div>
      )}

      {currentQuestionIndex === questions.length &&
        !isFollowUp &&
        !feedbackReady && (
          <div className="followup-container">
            <button onClick={handleFollowUp}>꼬리질문 받기</button>
            <button onClick={handleFeedback}>면접 피드백 받기</button>
          </div>
        )}

      {feedbackReady && (
        <button onClick={handleFeedback}>면접 피드백 받기</button>
      )}
    </div>
  );
};

export default TestPage;
