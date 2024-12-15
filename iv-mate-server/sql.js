module.exports = {
  // auth 회원
  email_check: `SELECT * FROM user WHERE email = ?`,
  nick_check: `SELECT * FROM user WHERE nickname = ?`,
  register: `INSERT INTO user (email, nickname, password) VALUES (?, ?, ?)`,
  login: `SELECT password FROM user WHERE email = ?`,
  user_no_get: `SELECT user_no, nickname FROM user WHERE email = ?`,
  get_userinfo: `SELECT email, nickname FROM user WHERE user_no = ?`,

  // AI
  get_jobinfo: `INSERT INTO SESSION (user_no, session_job, session_status) VALUES (?, ?, '진행중')`,
  save_interview: `INSERT INTO INTERVIEW (user_no, session_no, interview_question, interview_answer, interview_question_no) VALUES (?, ?, ?, ?, ?)`,
  get_interview: `SELECT interview_question, interview_answer, interview_question_no FROM INTERVIEW WHERE session_no = ? ORDER BY interview_question_no ASC`,
  save_airesult: `INSERT INTO AIRESULT (user_no, session_no, ai_result_content) VALUES (?, ?, ?)`,
  update_session: `UPDATE SESSION SET session_status = '끝남' WHERE session_no = ?`, 
  get_airesult: `SELECT ai_result_no, ai_result_content FROM AIRESULT WHERE user_no = ? AND session_no = ? ORDER BY ai_result_no ASC`, 
  get_sessiondate: `SELECT session_date FROM SESSION WHERE user_no = ? ORDER BY session_date DESC`,
  get_dateinterview: `SELECT interview_question, interview_answer, interview_question_no FROM INTERVIEW WHERE user_no = ? AND session_date = ? ORDER BY interview_question_no ASC`
};
