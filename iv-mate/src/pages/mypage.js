import React, { useState, useEffect } from "react";
import "../css/mypage.css";

const MyPage = () => {
  const [records, setRecords] = useState([]); // 시뮬레이션 기록 리스트
  const [selectedRecord, setSelectedRecord] = useState(null); // 선택된 기록
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 더미 데이터
  const dummyRecords = [
    {
      id: "1",
      date: "2024-11-27",
      time: "10:00",
      questions: [
        {
          question: "1분 자기소개해주세요.",
          answer: "안녕하세요. 저는...",
        },
        {
          question: "지원 동기를 말씀해주세요.",
          answer: "제가 이 직무를 선택한 이유는...",
        },
      ],
    },
    {
      id: "2",
      date: "2024-12-01",
      time: "15:30",
      questions: [
        {
          question: "최근에 도전했던 경험을 이야기해주세요.",
          answer: "저는...",
        },
      ],
    },
  ];

  // 더미 데이터를 로드하는 useEffect
  useEffect(() => {
    async function fetchRecords() {
      setIsLoading(true);
      try {
        // 백엔드 연동 시 여기에 실제 API 호출이 들어감
        // const response = await axios.get(`${BASE_URL}/simulation-records`);
        // setRecords(response.data.records);

        // 현재는 더미 데이터를 사용
        setRecords(dummyRecords);
      } catch (err) {
        console.error("기록 불러오기 실패:", err);
        setError("시뮬레이션 기록을 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecords();
  }, []);

  // 선택된 기록 처리
  const handleSelectRecord = (event) => {
    const recordId = event.target.value;
    const record = records.find((r) => r.id === recordId); // 선택된 기록 찾기
    setSelectedRecord(record);
  };

  // 로딩 중 상태 표시
  if (isLoading) {
    return <p>로딩 중... 잠시만 기다려주세요.</p>;
  }

  // 에러 상태 표시
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mypage-container">
      <h2>마이페이지</h2>

      {/* 기록이 없는 경우 */}
      {records.length === 0 && <p>시뮬레이션 기록이 없습니다.</p>}

      {/* 기록이 있는 경우 */}
      {records.length > 0 && (
        <div>
          <div className="record-selector">
            <label htmlFor="record-select">면접 기록</label>
            <select id="record-select" onChange={handleSelectRecord}>
              <option value="">기록을 선택하세요</option>
              {records.map((record) => (
                <option key={record.id} value={record.id}>
                  {record.date} {record.time}
                </option>
              ))}
            </select>
          </div>

          {/* 선택된 기록 표시 */}
          {selectedRecord && (
            <div className="record-details">
              <h3>면접 기록 확인</h3>
              {selectedRecord.questions.map((q, index) => (
                <div key={index} className="question-answer">
                  <div className="question">
                    <strong>Q. {q.question}</strong>
                  </div>
                  <div className="answer">
                    <p>A. {q.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPage;
