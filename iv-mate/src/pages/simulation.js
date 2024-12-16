import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/simulation.css";

const Simulation = () => {
  const navigate = useNavigate();
  const [jobPosition, setJobPosition] = useState(""); // 직무 선택
  const [jobDetails, setJobDetails] = useState(""); // 상세 직무 선택
  const [subJobs, setSubJobs] = useState([]); // 직무 상세 목록
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); //에러 메시지 상태
  const [isLoading, setIsLoading] = useState(false); //질문 생성 표시
  const maxLength = 1500;

  const jobOptions = [
    {
      groupName: "개발, 데이터",
      subList: [
        { subName: "백엔드개발자" },
        { subName: "프론트엔드개발자" },
        { subName: "웹개발자" },
        { subName: "앱개발자" },
        { subName: "시스템엔지니어" },
        { subName: "네트워크엔지니어" },
        { subName: "DBA" },
        { subName: "데이터엔지니어" },
        { subName: "보안엔지니어" },
        { subName: "소프트웨어개발자" },
      ],
    },
    {
      groupName: "회계, 사무직",
      subList: [
        { subName: "인사관리자" },
        { subName: "회계담당자" },
        { subName: "재무담당자" },
        { subName: "총무관리자" },
        { subName: "기획관리자" },
        { subName: "법무담당자" },
        { subName: "경영컨설턴트" },
        { subName: "감사원" },
        { subName: "공급망 관리자" },
        { subName: "조달관리자" },
      ],
    },
    {
      groupName: "디자인",
      subList: [
        { subName: "UI/UX 디자이너" },
        { subName: "웹디자이너" },
        { subName: "그래픽디자이너" },
        { subName: "제품디자이너" },
        { subName: "브랜딩디자이너" },
        { subName: "영상디자이너" },
        { subName: "모션그래픽디자이너" },
        { subName: "편집디자이너" },
        { subName: "캐릭터디자이너" },
        { subName: "일러스트레이터" },
      ],
    },
    {
      groupName: "마케팅",
      subList: [
        { subName: "디지털마케터" },
        { subName: "콘텐츠마케터" },
        { subName: "퍼포먼스마케터" },
        { subName: "소셜미디어매니저" },
        { subName: "브랜드매니저" },
        { subName: "광고기획자" },
        { subName: "시장조사원" },
        { subName: "세일즈매니저" },
        { subName: "이벤트기획자" },
        { subName: "PR전문가" },
      ],
    },
  ];

  // 직무 선택
  const handleJobPositionChange = (e) => {
    const selectedJob = e.target.value;
    setJobPosition(selectedJob);

    // 선택한 직무의 상세 목록 설정
    const job = jobOptions.find((job) => job.groupName === selectedJob);
    setSubJobs(job ? job.subList : []); // 직무 상세 설정
    setJobDetails(""); // 직무 상세 초기화
  };

  const handleNextClick = async () => {
    try {
      // 모든 입력값이 있는지 확인
      if (!jobPosition || !jobDetails || !selfIntroduction) {
        setErrorMessage("모든 필드를 작성해주세요.");
        return;
      }
      setIsLoading(true);

      // AI 정보 전송
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/ai/sendInfo`,
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
      setIsLoading(false);

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
            <label htmlFor="job-position">직무 선택하기</label>
            <select
              id="job-position"
              value={jobPosition}
              onChange={handleJobPositionChange}
            >
              <option value="">직무 선택</option>
              {jobOptions.map((job, index) => (
                <option key={index} value={job.groupName}>
                  {job.groupName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="job-details">직무 상세 선택하기</label>
            <select
              id="job-details"
              value={jobDetails}
              onChange={(e) => setJobDetails(e.target.value)}
              disabled={!subJobs.length}
            >
              <option value="">직무 상세 선택</option>
              {subJobs.map((sub, index) => (
                <option key={index} value={sub.subName}>
                  {sub.subName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="self-introduction">자기소개서 입력</label>
            <textarea
              id="self-introduction"
              placeholder="여기에 자기소개서 작성해주세요. 최대 작성가능한 글자 수는 1500자입니다."
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

          {isLoading ? (
            <button className="next-button" onClick={handleNextClick} disabled>
              질문 생성중...
            </button>
          ) : (
            <button
              className="next-button"
              onClick={handleNextClick}
              disabled={!jobPosition || !jobDetails || !selfIntroduction}
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulation;
