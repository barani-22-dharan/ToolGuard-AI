import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMicrochip,
  FaThermometerHalf,
  FaWaveSquare,
  FaTachometerAlt,
  FaWind,
  FaCogs,
  FaClock,
  FaTools
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import "./MachineMonitoring.css";

function MachineMonitoring({ onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [tools, setTools] = useState([]);
  const [selectedToolId, setSelectedToolId] = useState("");

  const [toolData, setToolData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all tools
  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/tools/"
      );

      setTools(response.data);

      if (response.data.length > 0) {
        setSelectedToolId(response.data[0].tool_id);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load tools. Please make sure the backend is running.");
    }
  };

  // Fetch selected tool monitoring data
  useEffect(() => {
    if (selectedToolId) {
      fetchMonitoringData(selectedToolId);
    }
  }, [selectedToolId]);

  const fetchMonitoringData = async (toolId) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/tools/${toolId}/monitoring`
      );

      setToolData(response.data);
    } catch (err) {
      console.error(err);
      setToolData(null);
      setError("Unable to load monitoring data.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Normal") return "normal";
    if (status === "Warning") return "warning";
    if (status === "Critical") return "critical";

    return "normal";
  };

  return (
    <div className="machine-monitoring-page">

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="machine"
        onNavigate={onNavigate}
      />

      {/* Main Content */}
      <main
        className={
          sidebarOpen
            ? "machine-monitoring-main"
            : "machine-monitoring-main expanded"
        }
      >

        {/* Header */}
        <div className="machine-header">
          <div>
            <h1>Machine & Sensor Monitoring</h1>
            <p>
              Monitor real-time machine and sensor data for each tool.
            </p>
          </div>

          <div className="machine-header-icon">
            <FaMicrochip />
          </div>
        </div>

        {/* Tool Selection */}
        <div className="tool-selection-card">

          <div className="selection-title">
            <FaTools />
            <span>Select Tool</span>
          </div>

          <select
            value={selectedToolId}
            onChange={(e) => setSelectedToolId(e.target.value)}
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

        </div>

        {/* Error */}
        {error && (
          <div className="machine-error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="machine-loading">
            Loading monitoring data...
          </div>
        )}

        {/* Tool Data */}
        {toolData && !loading && (

          <>
            {/* Tool Information */}
            <div className="selected-tool-card">

              <div>
                <span>Tool ID</span>
                <strong>{toolData.tool_id}</strong>
              </div>

              <div>
                <span>Tool Name</span>
                <strong>{toolData.tool_name}</strong>
              </div>

              <div>
                <span>Machine</span>
                <strong>
                  {toolData.machine?.machine_id || "Not Assigned"}
                </strong>
              </div>

              <div>
                <span>Operating Hours</span>
                <strong>
                  {toolData.usage?.operating_hours ?? 0} hrs
                </strong>
              </div>

              <div>
                <span>Expected Life</span>
                <strong>
                  {toolData.usage?.expected_life ?? 0} hrs
                </strong>
              </div>

              <div>
                <span>Current Wear</span>
                <strong>
                  {toolData.condition?.current_wear ?? 0}%
                </strong>
              </div>

              <div>
                <span>RUL</span>
                <strong>
                  {toolData.condition?.rul ?? 0} hrs
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong
                  className={getStatusClass(
                    toolData.condition?.status
                  )}
                >
                  {toolData.condition?.status || "Normal"}
                </strong>
              </div>

            </div>

            {/* Sensor Cards */}
            <div className="sensor-grid">

              <div className="sensor-card">
                <div className="sensor-icon">
                  <FaThermometerHalf />
                </div>

                <div>
                  <span>Temperature</span>
                  <h2>
                    {toolData.sensor_data?.temperature ?? 0} °C
                  </h2>
                </div>
              </div>


              <div className="sensor-card">
                <div className="sensor-icon">
                  <FaWaveSquare />
                </div>

                <div>
                  <span>Vibration</span>
                  <h2>
                    {toolData.sensor_data?.vibration ?? 0}
                  </h2>
                </div>
              </div>


              <div className="sensor-card">
                <div className="sensor-icon">
                  <FaCogs />
                </div>

                <div>
                  <span>Cutting Force</span>
                  <h2>
                    {toolData.sensor_data?.cutting_force ?? 0} N
                  </h2>
                </div>
              </div>


              <div className="sensor-card">
                <div className="sensor-icon">
                  <FaTachometerAlt />
                </div>

                <div>
                  <span>Spindle Speed</span>
                  <h2>
                    {toolData.sensor_data?.spindle_speed ?? 0} RPM
                  </h2>
                </div>
              </div>


              <div className="sensor-card">
                <div className="sensor-icon">
                  <FaWind />
                </div>

                <div>
                  <span>Feed Rate</span>
                  <h2>
                    {toolData.sensor_data?.feed_rate ?? 0}
                  </h2>
                </div>
              </div>


              <div className="sensor-card">
                <div className="sensor-icon">
                  <FaCogs />
                </div>

                <div>
                  <span>Depth of Cut</span>
                  <h2>
                    {toolData.sensor_data?.depth_of_cut ?? 0} mm
                  </h2>
                </div>
              </div>

            </div>


            {/* Current Condition */}
            <div className="condition-section">

              <div className="section-title">
                <FaMicrochip />
                <h2>Current Tool Condition</h2>
              </div>

              <div className="condition-content">

                <div className="wear-progress">

                  <div className="wear-progress-header">
                    <span>Current Tool Wear</span>

                    <strong>
                      {toolData.condition?.current_wear ?? 0}%
                    </strong>
                  </div>

                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getStatusClass(
                        toolData.condition?.status
                      )}`}
                      style={{
                        width: `${Math.min(
                          toolData.condition?.current_wear || 0,
                          100
                        )}%`
                      }}
                    />
                  </div>

                </div>


                <div className="condition-status">

                  <span>Tool Condition</span>

                  <strong
                    className={getStatusClass(
                      toolData.condition?.status
                    )}
                  >
                    {toolData.condition?.status || "Normal"}
                  </strong>

                </div>


                <div className="rul-box">

                  <FaClock />

                  <div>
                    <span>Remaining Useful Life</span>

                    <strong>
                      {toolData.condition?.rul ?? 0} hrs
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </>
        )}

        {/* No Tools */}
        {!loading && tools.length === 0 && !error && (
          <div className="no-tools">
            <FaTools />

            <h2>No Tools Available</h2>

            <p>
              Please add a tool from Tool Management first.
            </p>

            <button
              onClick={() => onNavigate("tools")}
            >
              Go to Tool Management
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default MachineMonitoring;