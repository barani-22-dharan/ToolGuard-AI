import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaChartLine,
  FaTools,
  FaThermometerHalf,
  FaWaveSquare,
  FaCogs,
  FaTachometerAlt,
  FaClock,
  FaRobot
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import "./WearPrediction.css";

function WearPrediction({ onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [tools, setTools] = useState([]);
  const [selectedToolId, setSelectedToolId] = useState("");
  const [prediction, setPrediction] = useState(null);

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
      predictWear(selectedToolId);
    }
  }, [selectedToolId]);

  const predictWear = async (toolId) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://toolguard-ai.onrender.com/api/predict/wear/${toolId}`
      );

      setPrediction(response.data);
    } catch (err) {
      console.error(err);
      setPrediction(null);
      setError("Unable to generate tool wear prediction.");
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
    <div className="wear-prediction-page">

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="wear"
        onNavigate={onNavigate}
      />

      {/* Main */}
      <main
        className={
          sidebarOpen
            ? "wear-prediction-main"
            : "wear-prediction-main expanded"
        }
      >

        {/* Header */}
        <div className="wear-header">
          <div>
            <h1>AI Tool Wear Prediction</h1>
            <p>
              Predict tool wear condition using machine and sensor data.
            </p>
          </div>

          <div className="wear-header-icon">
            <FaRobot />
          </div>
        </div>

        {/* Tool Selection */}
        <div className="wear-selection-card">

          <div className="wear-selection-title">
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

          <button
            className="predict-button"
            onClick={() => {
              if (selectedToolId) {
                predictWear(selectedToolId);
              }
            }}
            disabled={!selectedToolId || loading}
          >
            <FaChartLine />
            {loading ? "Predicting..." : "Predict Wear"}
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="wear-error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="wear-loading">
            AI is analyzing the selected tool...
          </div>
        )}

        {/* Prediction Result */}
        {prediction && !loading && (
          <>

            {/* Main Prediction Card */}
            <div className="prediction-result-card">

              <div className="prediction-icon">
                <FaRobot />
              </div>

              <div className="prediction-info">
                <span>AI Predicted Tool Wear</span>

                <h2>
                  {prediction.prediction?.predicted_wear ?? 0}%
                </h2>

                <p>
                  {prediction.tool_id} - {prediction.tool_name}
                </p>
              </div>

              <div className="prediction-status">

                <span>Current Condition</span>

                <strong
                  className={getStatusClass(
                    prediction.prediction?.status
                  )}
                >
                  {prediction.prediction?.status || "Normal"}
                </strong>

              </div>

            </div>

            {/* Wear Progress */}
            <div className="wear-analysis-card">

              <div className="card-title">
                <FaChartLine />
                <h2>Wear Analysis</h2>
              </div>

              <div className="wear-percentage">

                <div className="percentage-header">
                  <span>Predicted Wear</span>

                  <strong>
                    {prediction.prediction?.predicted_wear ?? 0}%
                  </strong>
                </div>

                <div className="wear-progress-bar">
                  <div
                    className={`wear-progress-fill ${getStatusClass(
                      prediction.prediction?.status
                    )}`}
                    style={{
                      width: `${Math.min(
                        prediction.prediction?.predicted_wear || 0,
                        100
                      )}%`
                    }}
                  />
                </div>

                <div className="wear-scale">
                  <span>0% Normal</span>
                  <span>40%</span>
                  <span>75%</span>
                  <span>100% Critical</span>
                </div>

              </div>

            </div>

            {/* Sensor Data */}
            <div className="sensor-analysis-card">

              <div className="card-title">
                <FaCogs />
                <h2>Input Sensor Data</h2>
              </div>

              <div className="prediction-sensor-grid">

                <div className="prediction-sensor">
                  <FaClock />
                  <div>
                    <span>Operating Hours</span>
                    <strong>
                      {prediction.sensor_data?.operating_hours ?? 0} hrs
                    </strong>
                  </div>
                </div>

                <div className="prediction-sensor">
                  <FaThermometerHalf />
                  <div>
                    <span>Temperature</span>
                    <strong>
                      {prediction.sensor_data?.temperature ?? 0} °C
                    </strong>
                  </div>
                </div>

                <div className="prediction-sensor">
                  <FaWaveSquare />
                  <div>
                    <span>Vibration</span>
                    <strong>
                      {prediction.sensor_data?.vibration ?? 0}
                    </strong>
                  </div>
                </div>

                <div className="prediction-sensor">
                  <FaCogs />
                  <div>
                    <span>Cutting Force</span>
                    <strong>
                      {prediction.sensor_data?.cutting_force ?? 0} N
                    </strong>
                  </div>
                </div>

                <div className="prediction-sensor">
                  <FaTachometerAlt />
                  <div>
                    <span>Spindle Speed</span>
                    <strong>
                      {prediction.sensor_data?.spindle_speed ?? 0} RPM
                    </strong>
                  </div>
                </div>

                <div className="prediction-sensor">
                  <FaChartLine />
                  <div>
                    <span>Feed Rate</span>
                    <strong>
                      {prediction.sensor_data?.feed_rate ?? 0}
                    </strong>
                  </div>
                </div>

              </div>

            </div>

            {/* RUL */}
            <div className="prediction-rul-card">

              <div className="rul-info">
                <FaClock />

                <div>
                  <span>Remaining Useful Life</span>
                  <strong>
                    {prediction.prediction?.rul ?? 0} hrs
                  </strong>
                </div>
              </div>

              <div className="rul-description">
                The predicted remaining useful life is calculated based
                on the tool's expected life and current operating hours.
              </div>

            </div>

          </>
        )}

        {/* No Tools */}
        {!loading && tools.length === 0 && !error && (
          <div className="no-wear-tools">

            <FaTools />

            <h2>No Tools Available</h2>

            <p>
              Add a tool from Tool Management before generating a prediction.
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

export default WearPrediction;
