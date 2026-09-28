import React from "react";

import {
  FaTachometerAlt,
  FaTools,
  FaMicrochip,
  FaChartLine,
  FaHourglassHalf,
  FaProjectDiagram,
  FaBell,
  FaSignOutAlt
} from "react-icons/fa";

import "./Sidebar.css";


function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  currentPage,
  onNavigate
}) {


  const menuItems = [

    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />
    },

    {
      id: "tools",
      label: "Tool Management",
      icon: <FaTools />
    },

    {
      id: "machine",
      label: "Machine & Sensors",
      icon: <FaMicrochip />
    },

    {
      id: "wear",
      label: "AI Wear Prediction",
      icon: <FaChartLine />
    },

    {
      id: "rul",
      label: "RUL Prediction",
      icon: <FaHourglassHalf />
    },

    {
      id: "lifecycle",
      label: "Tool Lifecycle",
      icon: <FaProjectDiagram />
    },

    {
      id: "maintenance",
      label: "Maintenance & Alerts",
      icon: <FaBell />
    }

  ];


  const handleLogout = () => {

    localStorage.removeItem("toolguardUser");

    window.location.reload();

  };


  return (

    <aside
      className={
        sidebarOpen
          ? "tool-sidebar"
          : "tool-sidebar collapsed"
      }
    >


      {/* =========================
          LOGO
      ========================= */}

      <div className="sidebar-logo">

        <div className="sidebar-logo-icon">
          <FaTools />
        </div>


        {sidebarOpen && (

          <div className="sidebar-logo-text">

            <h2>ToolGuard</h2>

            <span>AI • PLM</span>

          </div>

        )}

      </div>


      {/* =========================
          MENU
      ========================= */}

      <nav className="sidebar-menu">

        {menuItems.map((item) => (

          <button
            key={item.id}
            className={
              currentPage === item.id
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() =>
              onNavigate(item.id)
            }
            title={
              !sidebarOpen
                ? item.label
                : ""
            }
          >

            <span className="sidebar-item-icon">

              {item.icon}

            </span>


            {sidebarOpen && (

              <span className="sidebar-item-label">

                {item.label}

              </span>

            )}

          </button>

        ))}

      </nav>


      {/* =========================
          BOTTOM
      ========================= */}

      <div className="sidebar-bottom">

        <button
          className="sidebar-logout"
          onClick={handleLogout}
          title={
            !sidebarOpen
              ? "Logout"
              : ""
          }
        >

          <span className="sidebar-item-icon">

            <FaSignOutAlt />

          </span>


          {sidebarOpen && (

            <span className="sidebar-item-label">

              Logout

            </span>

          )}

        </button>

      </div>


    </aside>

  );

}


export default Sidebar;