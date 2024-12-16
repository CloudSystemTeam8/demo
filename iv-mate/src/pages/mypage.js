import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/mypage.css";

const MyPage = () => {
  const [histories, setHistories] = useState([]); // 시뮬레이션 기록 리스트
  const [selectedHistory, setSelectedHistory] = useState(null); // 선택된 기록
  const [selectedSessionNo, setSelectedSessionNo] = useState(""); // 선택된 기록의 세션 번호
  const [totalFeedback, setTotalFeedback] = useState(""); // 종합 피드백
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 더미 데이터를 로드하는 useEffect
  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/ai/session_history`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        setHistories(response.data);
      } catch (err) {
        console.error("기록 불러오기 실패:", err);
        setError("시뮬레이션 기록을 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // 선택된 기록 처리
  const handleSelectHistory = async (event) => {
    const session_no = event.target.value;
    setSelectedSessionNo(session_no);
    if (!session_no) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/ai/getInterview`,
        {
          params: { session_no },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log(response.data);
      setSelectedHistory(
        response.data.finalHistory && response.data.finalHistory.length
          ? response.data.finalHistory
          : []
      );
      setTotalFeedback(
        response.data.totalFeedback || "종합 피드백이 없습니다."
      );

      setIsLoading(false);
    } catch (error) {
      console.error("기록 불러오기 실패:", error);
      setError("선택한 날짜의 기록을 불러올 수 없습니다.");
    }
  };

  // 시간 변환 함수
  function timeFormat(isoStirng) {
    const date = new Date(isoStirng);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  // 불러오는 과정 상태 표시
  if (isLoading) {
    return (
      <div className="history-container">
        <p className="history-load">불러오는 중... 잠시만 기다려주세요.</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="date-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <h2>마이페이지</h2>
      <div className="date-container">
        {/* 기록이 없는 경우 */}
        {histories.length === 0 && <p>시뮬레이션 기록이 없습니다.</p>}

        {/* 기록이 있는 경우 */}
        {histories.length > 0 && (
          <div className="history-selector">
            <label htmlFor="history-select">면접 기록</label>
            <select
              id="history-select"
              onChange={handleSelectHistory}
              value={selectedSessionNo}
            >
              <option value="">기록을 선택하세요</option>
              {histories.map((record, index) => (
                <option key={index} value={record.session_no}>
                  {timeFormat(record.session_date)} 직무 :{record.session_job}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* 선택된 기록 표시 */}
      {selectedHistory && (
        <div className="history-container">
          <h3>면접 기록 확인</h3>
          <div className="history-details">
            {selectedHistory.map((history, index) => (
              <div key={index} className="question-answer">
                <div className="question">
                  <strong>
                    Q{index + 1}. {history.interview_question}
                  </strong>
                </div>
                <div className="answer">
                  <p>A. {history.interview_answer}</p>
                </div>
                <div className="ai-feedback">
                  <strong>AI 피드백</strong>
                  <p>{history.feedback || "피드백이 없습니다."}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="ai-totalFeedback">
            <h3>종합 피드백</h3>
            <p>{totalFeedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
