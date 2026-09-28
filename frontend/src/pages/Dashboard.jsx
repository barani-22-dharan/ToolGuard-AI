import React, { useEffect, useState } from "react";

import {
  FaTools,
  FaTachometerAlt,
  FaMicrochip,
  FaBrain,
  FaClock,
  FaProjectDiagram,
  FaExclamationTriangle,
  FaUserCircle
} from "react-icons/fa";

import axios from "axios";

import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

function Dashboard({ onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/tools/"
      );

      setTools(response.data);
    } catch (error) {
      console.error("Unable to load dashboard tools:", error);
    }
  };

  const totalTools = tools.length;

  const normalTools = tools.filter(
    (tool) => tool.status === "Normal"
  ).length;

  const warningTools = tools.filter(
    (tool) => tool.status === "Warning"
  ).length;

  const criticalTools = tools.filter(
    (tool) => tool.status === "Critical"
  ).length;

  const latestTool =
    tools.length > 0 ? tools[0] : null;

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="dashboard"
        onNavigate={onNavigate}
      />

      {/* ================= MAIN AREA ================= */}

      <div
        className={
          sidebarOpen
            ? "dashboard-main"
            : "dashboard-main expanded"
        }
      >

        {/* ================= TOP NAVBAR ================= */}

        <header className="dashboard-navbar">

          <button
            className="sidebar-toggle"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            {sidebarOpen ? "☰" : "☰"}
          </button>

          <div className="navbar-title">

            <h2>
              Tool Monitoring Dashboard
            </h2>

            <p>
              AI-Based Tool Wear Monitoring & PLM
            </p>

          </div>

          <div className="dashboard-user">

            <FaUserCircle />

            <div>

              <strong>
                Admin
              </strong>

              <span>
                Monitoring
              </span>

            </div>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <main className="dashboard-content">

          {/* ================= HEADING ================= */}

          <div className="dashboard-heading">

            <div>

              <p className="dashboard-label">
                OVERVIEW
              </p>

              <h2>
                Tool Monitoring Dashboard
              </h2>

              <p>
                Monitor tool condition, AI predictions,
                machine data and maintenance status.
              </p>

            </div>

          </div>

          {/* ================= DASHBOARD CARDS ================= */}

          <div className="dashboard-cards">

            {/* Total Tools */}

            <div className="dashboard-card">

              <div className="card-icon blue">
                <FaTools />
              </div>

              <div>

                <span>
                  Total Tools
                </span>

                <h3>
                  {totalTools}
                </h3>

                <small>
                  Registered tools
                </small>

              </div>

            </div>

            {/* Normal */}

            <div className="dashboard-card">

              <div className="card-icon green">
                <FaTachometerAlt />
              </div>

              <div>

                <span>
                  Normal
                </span>

                <h3>
                  {normalTools}
                </h3>

                <small>
                  Tools operating normally
                </small>

              </div>

            </div>

            {/* Warning */}

            <div className="dashboard-card">

              <div className="card-icon orange">
                <FaExclamationTriangle />
              </div>

              <div>

                <span>
                  Warning
                </span>

                <h3>
                  {warningTools}
                </h3>

                <small>
                  Requires attention
                </small>

              </div>

            </div>

            {/* Critical */}

            <div className="dashboard-card">

              <div className="card-icon red">
                <FaExclamationTriangle />
              </div>

              <div>

                <span>
                  Critical
                </span>

                <h3>
                  {criticalTools}
                </h3>

                <small>
                  Immediate action required
                </small>

              </div>

            </div>

          </div>

          {/* ================= DASHBOARD PANELS ================= */}

          <div className="dashboard-grid">

            {/* AI Wear Prediction */}

            <div className="dashboard-panel">

              <div className="panel-header">

                <div className="panel-icon">
                  <FaBrain />
                </div>

                <div>

                  <h3>
                    AI Wear Prediction
                  </h3>

                  <p>
                    Current tool wear analysis
                  </p>

                </div>

              </div>

              {latestTool ? (
                <div className="dashboard-tool-preview">

                  <div>
                    <span>
                      Tool
                    </span>

                    <strong>
                      {latestTool.tool_name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Wear
                    </span>

                    <strong>
                      {latestTool.current_wear}%
                    </strong>
                  </div>

                  <div>
                    <span>
                      Status
                    </span>

                    <strong>
                      {latestTool.status}
                    </strong>
                  </div>

                  <button
                    onClick={() =>
                      onNavigate("wear")
                    }
                  >
                    View Prediction
                  </button>

                </div>
              ) : (
                <div className="empty-dashboard">

                  <FaBrain />

                  <h4>
                    No prediction data
                  </h4>

                  <p>
                    Add a tool to start AI-based
                    wear prediction.
                  </p>

                </div>
              )}

            </div>

            {/* RUL */}

            <div className="dashboard-panel">

              <div className="panel-header">

                <div className="panel-icon">
                  <FaClock />
                </div>

                <div>

                  <h3>
                    Remaining Useful Life
                  </h3>

                  <p>
                    Tool life prediction
                  </p>

                </div>

              </div>

              {latestTool ? (
                <div className="dashboard-tool-preview">

                  <div>
                    <span>
                      Tool
                    </span>

                    <strong>
                      {latestTool.tool_name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      RUL
                    </span>

                    <strong>
                      {latestTool.rul} hrs
                    </strong>
                  </div>

                  <div>
                    <span>
                      Operating
                    </span>

                    <strong>
                      {latestTool.operating_hours} hrs
                    </strong>
                  </div>

                  <button
                    onClick={() =>
                      onNavigate("rul")
                    }
                  >
                    View RUL
                  </button>

                </div>
              ) : (
                <div className="empty-dashboard">

                  <FaClock />

                  <h4>
                    No RUL data
                  </h4>

                  <p>
                    Tool RUL will appear after
                    monitoring data is available.
                  </p>

                </div>
              )}

            </div>

            {/* Machine Monitoring */}

            <div className="dashboard-panel">

              <div className="panel-header">

                <div className="panel-icon">
                  <FaMicrochip />
                </div>

                <div>

                  <h3>
                    Machine Monitoring
                  </h3>

                  <p>
                    Sensor and machine status
                  </p>

                </div>

              </div>

              {latestTool ? (
                <div className="sensor-preview">

                  <div>

                    <span>
                      Temperature
                    </span>

                    <strong>
                      {latestTool.temperature} °C
                    </strong>

                  </div>

                  <div>

                    <span>
                      Vibration
                    </span>

                    <strong>
                      {latestTool.vibration}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Cutting Force
                    </span>

                    <strong>
                      {latestTool.cutting_force}
                    </strong>

                  </div>

                  <button
                    onClick={() =>
                      onNavigate("machine")
                    }
                  >
                    View Sensors
                  </button>

                </div>
              ) : (
                <div className="empty-dashboard">

                  <FaMicrochip />

                  <h4>
                    No machine data
                  </h4>

                  <p>
                    Sensor data will appear after
                    adding a tool.
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* ================= PLM PANEL ================= */}

          <div className="plm-dashboard-panel">

            <div className="plm-dashboard-icon">
              <FaProjectDiagram />
            </div>

            <div>

              <h3>
                PLM Tool Lifecycle Management
              </h3>

              <p>
                Track every tool from creation and
                installation through AI monitoring,
                maintenance, reuse, replacement
                and retirement.
              </p>

            </div>

            <button
              className="plm-status"
              onClick={() =>
                onNavigate("lifecycle")
              }
            >
              View Lifecycle
            </button>

          </div>

          {/* ================= MAINTENANCE PANEL ================= */}

          <div className="plm-dashboard-panel maintenance-dashboard-panel">

            <div className="plm-dashboard-icon maintenance-icon">
              <FaExclamationTriangle />
            </div>

            <div>

              <h3>
                Maintenance & Alerts
              </h3>

              <p>
                Monitor tool health, maintenance
                requirements and critical alerts.
              </p>

            </div>

            <button
              className="plm-status"
              onClick={() =>
                onNavigate("maintenance")
              }
            >
              View Alerts
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;