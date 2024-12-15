import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/sidebar.css";
import Home from "../assets/home-gray.svg";
import HomeSelect from "../assets/home-select.svg";
import Simulation from "../assets/notebook-gray.svg";
import SimulationSelect from "../assets/notebook-select.svg";
import Mypage from "../assets/user-gray.svg";
import MypageSelect from "../assets/user-select.svg";
import SubLogo from "../assets/sub-logo.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 메뉴 항목
  const menuItems = [
    {
      name: "홈페이지",
      path: "/app/home",
      activeIcon: HomeSelect,
      inactiveIcon: Home,
    },
    {
      name: "면접 시뮬레이션",
      path: "/app/simulation",
      activeIcon: SimulationSelect,
      inactiveIcon: Simulation,
    },
    {
      name: "마이페이지",
      path: "/app/mypage",
      activeIcon: MypageSelect,
      inactiveIcon: Mypage,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // 로그인 페이지로 이동
    navigate("/");
  };
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={SubLogo} alt="면접MATE" />
        <h2>면접MATE</h2>
      </div>

      <div className="sidebar-info">
        <div className="sidebar-nick">
          <h3>눈송이 님, 취뽀까지 화이팅!</h3>
        </div>
        <p>로그인 정보</p>
        <p>noonsong@sookmyung.ac.kr</p>
        <button className="logout-button" onClick={handleLogout}>
          LOGOUT
        </button>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <img
              src={
                location.pathname === item.path
                  ? item.activeIcon
                  : item.inactiveIcon
              }
              alt={item.name}
              className="menu-icon"
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
