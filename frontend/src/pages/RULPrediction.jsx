import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHourglassHalf,
  FaTools,
  FaClock,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import "./RULPrediction.css";

function RULPrediction({ onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [tools, setTools] = useState([]);
  const [selectedToolId, setSelectedToolId] = useState("");
  const [rulData, setRulData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError(
        "Unable to load tools. Please make sure the backend is running."
      );
    }
  };

  useEffect(() => {
    if (selectedToolId) {
      fetchRUL(selectedToolId);
    }
  }, [selectedToolId]);

  const fetchRUL = async (toolId) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/predict/rul/${toolId}`
      );

      setRulData(response.data);
    } catch (err) {
      console.error(err);
      setRulData(null);
      setError("Unable to calculate RUL.");
    } finally {
      setLoading(false);
    }
  };

  const getConditionClass = (condition) => {
    if (condition === "Healthy") {
      return "healthy";
    }

    if (condition === "Warning") {
      return "warning";
    }

    if (condition === "Critical") {
      return "critical";
    }

    return "healthy";
  };

  const getConditionIcon = (condition) => {
    if (condition === "Healthy") {
      return <FaCheckCircle />;
    }

    if (condition === "Warning") {
      return <FaExclamationTriangle />;
    }

    return <FaTimesCircle />;
  };

  return (
    <div className="rul-prediction-page">

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="rul"
        onNavigate={onNavigate}
      />

      {/* Main Content */}
      <main
        className={
          sidebarOpen
            ? "rul-prediction-main"
            : "rul-prediction-main expanded"
        }
      >

        {/* Header */}
        <div className="rul-header">

          <div>
            <h1>RUL Prediction</h1>

            <p>
              Predict the remaining useful life of the selected tool.
            </p>
          </div>

          <div className="rul-header-icon">
            <FaHourglassHalf />
          </div>

        </div>

        {/* Tool Selection */}
        <div className="rul-selection-card">

          <div className="rul-selection-title">
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
            className="rul-predict-button"
            onClick={() => {
              if (selectedToolId) {
                fetchRUL(selectedToolId);
              }
            }}
            disabled={!selectedToolId || loading}
          >
            <FaHourglassHalf />

            {loading
              ? "Calculating..."
              : "Calculate RUL"}
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="rul-error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rul-loading">
            Calculating Remaining Useful Life...
          </div>
        )}

        {/* RUL Result */}
        {rulData && !loading && (
          <>

            {/* Main RUL Card */}
            <div className="rul-main-card">

              <div className="rul-main-icon">
                <FaHourglassHalf />
              </div>

              <div className="rul-main-info">

                <span>
                  Remaining Useful Life
                </span>

                <h2>
                  {
                    rulData.rul_prediction
                      ?.remaining_useful_life ?? 0
                  } hrs
                </h2>

                <p>
                  {rulData.tool_id} - {rulData.tool_name}
                </p>

              </div>

              <div
                className={`rul-condition ${getConditionClass(
                  rulData.rul_prediction?.condition
                )}`}
              >

                {getConditionIcon(
                  rulData.rul_prediction?.condition
                )}

                <div>
                  <span>Tool Condition</span>

                  <strong>
                    {
                      rulData.rul_prediction
                        ?.condition || "Healthy"
                    }
                  </strong>
                </div>

              </div>

            </div>


            {/* Life Analysis */}
            <div className="life-analysis-card">

              <div className="rul-card-title">

                <FaChartLine />

                <h2>
                  Tool Life Analysis
                </h2>

              </div>

              <div className="life-grid">

                <div className="life-item">

                  <span>
                    Expected Tool Life
                  </span>

                  <strong>
                    {
                      rulData.rul_prediction
                        ?.expected_life ?? 0
                    } hrs
                  </strong>

                </div>


                <div className="life-item">

                  <span>
                    Operating Hours
                  </span>

                  <strong>
                    {
                      rulData.rul_prediction
                        ?.operating_hours ?? 0
                    } hrs
                  </strong>

                </div>


                <div className="life-item">

                  <span>
                    Remaining Life
                  </span>

                  <strong className="remaining-life">
                    {
                      rulData.rul_prediction
                        ?.remaining_useful_life ?? 0
                    } hrs
                  </strong>

                </div>

              </div>

              {/* Life Progress */}
              <div className="life-progress-section">

                <div className="life-progress-header">

                  <span>
                    Tool Life Usage
                  </span>

                  <strong>
                    {
                      rulData.rul_prediction?.expected_life
                        ? Math.min(
                            100,
                            (
                              (
                                rulData.rul_prediction
                                  .operating_hours /
                                rulData.rul_prediction
                                  .expected_life
                              ) * 100
                            )
                          ).toFixed(1)
                        : 0
                    }%
                  </strong>

                </div>

                <div className="life-progress-bar">

                  <div
                    className={`life-progress-fill ${getConditionClass(
                      rulData.rul_prediction?.condition
                    )}`}
                    style={{
                      width: `${
                        rulData.rul_prediction?.expected_life
                          ? Math.min(
                              100,
                              (
                                (
                                  rulData.rul_prediction
                                    .operating_hours /
                                  rulData.rul_prediction
                                    .expected_life
                                ) * 100
                              )
                            )
                          : 0
                      }%`
                    }}
                  />

                </div>

              </div>

            </div>


            {/* RUL Information */}
            <div className="rul-info-grid">

              <div className="rul-info-card">

                <div className="info-icon">
                  <FaClock />
                </div>

                <div>
                  <span>
                    Current Usage
                  </span>

                  <strong>
                    {
                      rulData.rul_prediction
                        ?.operating_hours ?? 0
                    } hrs
                  </strong>
                </div>

              </div>


              <div className="rul-info-card">

                <div className="info-icon">
                  <FaHourglassHalf />
                </div>

                <div>
                  <span>
                    Remaining Life
                  </span>

                  <strong>
                    {
                      rulData.rul_prediction
                        ?.remaining_useful_life ?? 0
                    } hrs
                  </strong>
                </div>

              </div>


              <div className="rul-info-card">

                <div className="info-icon">
                  <FaChartLine />
                </div>

                <div>
                  <span>
                    Expected Life
                  </span>

                  <strong>
                    {
                      rulData.rul_prediction
                        ?.expected_life ?? 0
                    } hrs
                  </strong>
                </div>

              </div>

            </div>


            {/* Recommendation */}
            <div
              className={`rul-recommendation ${getConditionClass(
                rulData.rul_prediction?.condition
              )}`}
            >

              {getConditionIcon(
                rulData.rul_prediction?.condition
              )}

              <div>

                <h3>
                  Maintenance Status
                </h3>

                {rulData.rul_prediction?.condition ===
                  "Healthy" && (
                  <p>
                    The tool has sufficient remaining life.
                    Continue normal monitoring.
                  </p>
                )}

                {rulData.rul_prediction?.condition ===
                  "Warning" && (
                  <p>
                    The tool is approaching its replacement
                    period. Schedule maintenance or inspection.
                  </p>
                )}

                {rulData.rul_prediction?.condition ===
                  "Critical" && (
                  <p>
                    The remaining useful life is low.
                    Immediate inspection or replacement is recommended.
                  </p>
                )}

              </div>

            </div>

          </>
        )}

        {/* No Tools */}
        {!loading && tools.length === 0 && !error && (
          <div className="no-rul-tools">

            <FaTools />

            <h2>
              No Tools Available
            </h2>

            <p>
              Add a tool from Tool Management before calculating RUL.
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

export default RULPrediction;