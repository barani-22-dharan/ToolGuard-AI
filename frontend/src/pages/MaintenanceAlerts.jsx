import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBell,
  FaTools,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClock,
  FaSyncAlt
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import "./MaintenanceAlerts.css";

function MaintenanceAlerts({ onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [tools, setTools] = useState([]);
  const [selectedToolId, setSelectedToolId] = useState("");
  const [maintenanceData, setMaintenanceData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await axios.get(
        "https://toolguard-ai.onrender.com/api/tools/"
      );

      setTools(response.data);

      if (response.data.length > 0) {
        setSelectedToolId(response.data[0].tool_id);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load tools. Please make sure the backend is running."
      );
    }
  };

  useEffect(() => {
    if (selectedToolId) {
      fetchMaintenance(selectedToolId);
    }
  }, [selectedToolId]);

  const fetchMaintenance = async (toolId) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://toolguard-ai.onrender.com/api/maintenance/${toolId}`
      );

      setMaintenanceData(response.data);
    } catch (err) {
      console.error(err);

      setMaintenanceData(null);
      setError(
        "Unable to load maintenance information."
      );
    } finally {
      setLoading(false);
    }
  };

  const getAlertClass = (level) => {
    if (level === "Critical") {
      return "critical";
    }

    if (level === "Warning") {
      return "warning";
    }

    return "normal";
  };

  const getAlertIcon = (level) => {
    if (level === "Critical") {
      return <FaTimesCircle />;
    }

    if (level === "Warning") {
      return <FaExclamationTriangle />;
    }

    return <FaCheckCircle />;
  };

  return (
    <div className="maintenance-alerts-page">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="maintenance"
        onNavigate={onNavigate}
      />

      <main
        className={
          sidebarOpen
            ? "maintenance-main"
            : "maintenance-main expanded"
        }
      >

        {/* Header */}
        <div className="maintenance-header">

          <div>
            <h1>Maintenance & Alerts</h1>

            <p>
              Monitor tool health and maintenance requirements
              based on AI wear predictions.
            </p>
          </div>

          <div className="maintenance-header-icon">
            <FaBell />
          </div>

        </div>

        {/* Tool Selection */}
        <div className="maintenance-selection-card">

          <div className="maintenance-selection-title">
            <FaTools />
            <span>Select Tool</span>
          </div>

          <select
            value={selectedToolId}
            onChange={(e) =>
              setSelectedToolId(e.target.value)
            }
          >
            <option value="">
              Select a Tool
            </option>

            {tools.map((tool) => (
              <option
                key={tool.tool_id}
                value={tool.tool_id}
              >
                {tool.tool_id} - {tool.tool_name}
              </option>
            ))}
          </select>

          <button
            className="maintenance-refresh-button"
            onClick={() => {
              if (selectedToolId) {
                fetchMaintenance(selectedToolId);
              }
            }}
            disabled={!selectedToolId || loading}
          >
            <FaSyncAlt />
            {loading ? "Loading..." : "Refresh"}
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="maintenance-error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="maintenance-loading">
            Loading maintenance information...
          </div>
        )}

        {maintenanceData && !loading && (
          <>

            {/* Alert Status */}
            <div
              className={`maintenance-alert-card ${getAlertClass(
                maintenanceData.alert?.level
              )}`}
            >

              <div className="maintenance-alert-icon">
                {getAlertIcon(
                  maintenanceData.alert?.level
                )}
              </div>

              <div className="maintenance-alert-content">

                <span>Current Alert Level</span>

                <h2>
                  {maintenanceData.alert?.level ||
                    "Normal"}
                </h2>

                <p>
                  {maintenanceData.alert?.message ||
                    "Tool is operating normally."}
                </p>

              </div>

            </div>

            {/* Tool Information */}
            <div className="maintenance-tool-card">

              <div className="maintenance-tool-icon">
                <FaTools />
              </div>

              <div className="maintenance-tool-info">

                <span>Selected Tool</span>

                <h2>
                  {maintenanceData.tool_name}
                </h2>

                <p>
                  Tool ID: {maintenanceData.tool_id}
                </p>

              </div>

              <div className="maintenance-machine">

                <span>Machine</span>

                <strong>
                  {maintenanceData.machine_id ||
                    "Not Assigned"}
                </strong>

              </div>

            </div>

            {/* Current Condition */}
            <div className="maintenance-section-card">

              <div className="maintenance-card-title">
                <FaBell />
                <h2>
                  Current Tool Condition
                </h2>
              </div>

              <div className="condition-grid">

                <div className="condition-item">

                  <span>
                    Wear Percentage
                  </span>

                  <strong>
                    {
                      maintenanceData.current_condition
                        ?.wear_percentage ?? 0
                    }%
                  </strong>

                  <div className="wear-bar">
                    <div
                      className={`wear-fill ${getAlertClass(
                        maintenanceData.current_condition
                          ?.status
                      )}`}
                      style={{
                        width: `${Math.min(
                          100,
                          maintenanceData.current_condition
                            ?.wear_percentage ?? 0
                        )}%`
                      }}
                    />
                  </div>

                </div>

                <div className="condition-item">

                  <span>
                    Current Status
                  </span>

                  <strong
                    className={`condition-status ${getAlertClass(
                      maintenanceData.current_condition
                        ?.status
                    )}`}
                  >
                    {
                      maintenanceData.current_condition
                        ?.status || "Normal"
                    }
                  </strong>

                </div>

                <div className="condition-item">

                  <span>
                    Remaining Useful Life
                  </span>

                  <strong>
                    {
                      maintenanceData.current_condition
                        ?.rul ?? 0
                    } hrs
                  </strong>

                </div>

              </div>

            </div>

            {/* Maintenance Information */}
            <div className="maintenance-section-card">

              <div className="maintenance-card-title">
                <FaTools />
                <h2>
                  Maintenance Information
                </h2>
              </div>

              <div className="maintenance-grid">

                <div className="maintenance-info-item">

                  <div className="maintenance-info-icon">
                    <FaClock />
                  </div>

                  <div>
                    <span>
                      Last Maintenance
                    </span>

                    <strong>
                      {
                        maintenanceData.maintenance
                          ?.last_maintenance ||
                        "Not Available"
                      }
                    </strong>
                  </div>

                </div>

                <div className="maintenance-info-item">

                  <div className="maintenance-info-icon">
                    <FaTools />
                  </div>

                  <div>
                    <span>
                      Maintenance Status
                    </span>

                    <strong>
                      {
                        maintenanceData.maintenance
                          ?.maintenance_status ||
                        "Not Available"
                      }
                    </strong>
                  </div>

                </div>

              </div>

            </div>

            {/* Recommendation */}
            <div
              className={`maintenance-recommendation ${getAlertClass(
                maintenanceData.alert?.level
              )}`}
            >

              <div className="recommendation-icon">
                {getAlertIcon(
                  maintenanceData.alert?.level
                )}
              </div>

              <div>

                <h3>
                  Maintenance Recommendation
                </h3>

                <p>
                  {
                    maintenanceData.maintenance
                      ?.recommendation ||
                    "Continue monitoring the tool."
                  }
                </p>

              </div>

            </div>

            {/* Quick Actions */}
            <div className="maintenance-actions">

              <button
                onClick={() =>
                  onNavigate("wear")
                }
              >
                <FaBell />
                View AI Wear Prediction
              </button>

              <button
                onClick={() =>
                  onNavigate("rul")
                }
              >
                <FaClock />
                View RUL Prediction
              </button>

              <button
                onClick={() =>
                  onNavigate("tools")
                }
              >
                <FaTools />
                Tool Management
              </button>

            </div>

          </>
        )}

        {/* No Tools */}
        {!loading &&
          tools.length === 0 &&
          !error && (
            <div className="no-maintenance-tools">

              <FaTools />

              <h2>
                No Tools Available
              </h2>

              <p>
                Add a tool from Tool Management before
                checking maintenance status.
              </p>

              <button
                onClick={() =>
                  onNavigate("tools")
                }
              >
                Go to Tool Management
              </button>

            </div>
          )}

      </main>

    </div>
  );
}

export default MaintenanceAlerts;
