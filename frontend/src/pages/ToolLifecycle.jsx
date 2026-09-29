import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaProjectDiagram,
  FaTools,
  FaCheckCircle,
  FaCircle,
  FaArrowRight,
  FaSyncAlt
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import "./ToolLifecycle.css";

function ToolLifecycle({ onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [tools, setTools] = useState([]);
  const [selectedToolId, setSelectedToolId] = useState("");
  const [lifecycleData, setLifecycleData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
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
      fetchLifecycle(selectedToolId);
    }
  }, [selectedToolId]);

  const fetchLifecycle = async (toolId) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://toolguard-ai.onrender.com/api/lifecycle/${toolId}`
      );

      setLifecycleData(response.data);
    } catch (err) {
      console.error(err);
      setLifecycleData(null);
      setError("Unable to load tool lifecycle.");
    } finally {
      setLoading(false);
    }
  };

  const updateLifecycle = async (stage) => {
    if (!selectedToolId) {
      return;
    }

    setUpdating(true);
    setError("");

    try {
      await axios.put(
        `https://toolguard-ai.onrender.com/api/lifecycle/${selectedToolId}`,
        {
          lifecycle_stage: stage
        }
      );

      await fetchLifecycle(selectedToolId);
    } catch (err) {
      console.error(err);
      setError("Unable to update lifecycle stage.");
    } finally {
      setUpdating(false);
    }
  };

  const getStageClass = (index, currentIndex) => {
    if (index < currentIndex) {
      return "completed";
    }

    if (index === currentIndex) {
      return "current";
    }

    return "upcoming";
  };

  return (
    <div className="tool-lifecycle-page">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="lifecycle"
        onNavigate={onNavigate}
      />

      <main
        className={
          sidebarOpen
            ? "tool-lifecycle-main"
            : "tool-lifecycle-main expanded"
        }
      >

        {/* Header */}
        <div className="lifecycle-header">

          <div>
            <h1>Tool Lifecycle</h1>

            <p>
              Manage the complete Product Lifecycle Management
              (PLM) journey of your tools.
            </p>
          </div>

          <div className="lifecycle-header-icon">
            <FaProjectDiagram />
          </div>

        </div>

        {/* Tool Selection */}
        <div className="lifecycle-selection-card">

          <div className="lifecycle-selection-title">
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
            className="lifecycle-refresh-button"
            onClick={() => {
              if (selectedToolId) {
                fetchLifecycle(selectedToolId);
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
          <div className="lifecycle-error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="lifecycle-loading">
            Loading tool lifecycle...
          </div>
        )}

        {/* Lifecycle Content */}
        {lifecycleData && !loading && (
          <>

            {/* Tool Summary */}
            <div className="lifecycle-tool-card">

              <div className="lifecycle-tool-icon">
                <FaTools />
              </div>

              <div className="lifecycle-tool-info">
                <span>Selected Tool</span>

                <h2>
                  {lifecycleData.tool_name}
                </h2>

                <p>
                  Tool ID: {lifecycleData.tool_id}
                </p>
              </div>

              <div className="lifecycle-stage-summary">

                <span>
                  Current Lifecycle Stage
                </span>

                <strong>
                  {lifecycleData.current_stage}
                </strong>

                <small>
                  Stage {lifecycleData.stage_number} of{" "}
                  {lifecycleData.total_stages}
                </small>

              </div>

            </div>

            {/* Lifecycle Progress */}
            <div className="lifecycle-card">

              <div className="lifecycle-card-title">

                <div>
                  <FaProjectDiagram />
                  <h2>
                    PLM Lifecycle Journey
                  </h2>
                </div>

                <span>
                  {lifecycleData.stage_number}/
                  {lifecycleData.total_stages}
                </span>

              </div>

              <div className="lifecycle-progress">

                {lifecycleData.lifecycle_stages.map(
                  (stage, index) => {

                    const currentIndex =
                      lifecycleData.stage_number - 1;

                    return (
                      <React.Fragment key={stage}>

                        <div
                          className={`lifecycle-stage ${getStageClass(
                            index,
                            currentIndex
                          )}`}
                        >

                          <div className="stage-circle">

                            {index < currentIndex ? (
                              <FaCheckCircle />
                            ) : (
                              <FaCircle />
                            )}

                          </div>

                          <div className="stage-content">

                            <span>
                              Stage {index + 1}
                            </span>

                            <strong>
                              {stage}
                            </strong>

                          </div>

                        </div>

                        {index <
                          lifecycleData.lifecycle_stages.length -
                            1 && (
                          <div
                            className={
                              index < currentIndex
                                ? "stage-connector completed"
                                : "stage-connector"
                            }
                          >
                            <FaArrowRight />
                          </div>
                        )}

                      </React.Fragment>
                    );
                  }
                )}

              </div>

            </div>

            {/* Update Lifecycle Stage */}
            <div className="lifecycle-update-card">

              <div className="lifecycle-card-title">

                <div>
                  <FaSyncAlt />
                  <h2>
                    Update Lifecycle Stage
                  </h2>
                </div>

              </div>

              <p className="lifecycle-update-description">
                Select the current lifecycle stage of the
                tool. This information is maintained as part
                of the PLM lifecycle history.
              </p>

              <div className="lifecycle-stage-buttons">

                {lifecycleData.lifecycle_stages.map(
                  (stage, index) => {

                    const currentIndex =
                      lifecycleData.stage_number - 1;

                    return (
                      <button
                        key={stage}
                        className={
                          index === currentIndex
                            ? "stage-button selected"
                            : "stage-button"
                        }
                        onClick={() =>
                          updateLifecycle(stage)
                        }
                        disabled={updating}
                      >
                        {index < currentIndex && (
                          <FaCheckCircle />
                        )}

                        {index === currentIndex && (
                          <FaCircle />
                        )}

                        {index > currentIndex && (
                          <FaCircle />
                        )}

                        <span>
                          {stage}
                        </span>
                      </button>
                    );
                  }
                )}

              </div>

              {updating && (
                <div className="lifecycle-updating">
                  Updating lifecycle stage...
                </div>
              )}

            </div>

            {/* PLM Information */}
            <div className="plm-info-grid">

              <div className="plm-info-card">

                <span>Lifecycle Stage</span>

                <strong>
                  {lifecycleData.current_stage}
                </strong>

              </div>

              <div className="plm-info-card">

                <span>Current Stage</span>

                <strong>
                  {lifecycleData.stage_number}
                </strong>

              </div>

              <div className="plm-info-card">

                <span>Total PLM Stages</span>

                <strong>
                  {lifecycleData.total_stages}
                </strong>

              </div>

            </div>

          </>
        )}

        {/* No Tools */}
        {!loading &&
          tools.length === 0 &&
          !error && (
            <div className="no-lifecycle-tools">

              <FaTools />

              <h2>
                No Tools Available
              </h2>

              <p>
                Add a tool from Tool Management before
                managing its PLM lifecycle.
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

export default ToolLifecycle;
