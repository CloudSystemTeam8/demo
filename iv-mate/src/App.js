import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Join from "./pages/join";
import Sidebar from "./components/sidebar";
import Home from "./pages/home";
import Simulation from "./pages/simulation";
import Mypage from "./pages/mypage";
import Test from "./pages/test";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 로그인 및 회원가입 */}
        <Route path="/" element={<Login />} />
        <Route path="/join" element={<Join />} />

        {/* 메인 레이아웃 */}
        <Route
          path="/app/*"
          element={
            <div className="app">
              <Sidebar />
              <div className="main-content">
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="simulation" element={<Simulation />} />
                  <Route path="mypage" element={<Mypage />} />
                  <Route path="test" element={<Test />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
