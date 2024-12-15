module.exports = {
  // auth 회원
  email_check: `SELECT * FROM user WHERE email = ?`,
  nick_check: `SELECT * FROM user WHERE nickname = ?`,
  register: `INSERT INTO user (email, nickname, password) VALUES (?, ?, ?)`,
  login: `SELECT password FROM user WHERE email = ?`,
  user_no_get: `SELECT user_no, nickname FROM user WHERE email = ?`,
  get_userinfo: `SELECT email, nickname FROM user WHERE user_no = ?`,
};
