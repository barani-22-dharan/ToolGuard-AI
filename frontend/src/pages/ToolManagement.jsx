import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaTools,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaBars,
  FaSignOutAlt
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";

import "./ToolManagement.css";

const API_URL = "https://toolguard-ai.onrender.com/api";

function ToolManagement({ onNavigate }) {

  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingTool, setEditingTool] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tool_id: "",
    tool_name: "",
    tool_type: "",
    manufacturer: "",
    material: "",
    machine_id: "",
    operating_hours: 0,
    expected_life: 100,
    current_wear: 0,
    rul: 100,
    status: "Normal",
    temperature: 25,
    vibration: 0,
    cutting_force: 0,
    spindle_speed: 0,
    feed_rate: 0,
    depth_of_cut: 0,
    last_maintenance: "",
    lifecycle_stage: "Tool Created",
    installation_date: ""
  });


  // =========================
  // FETCH TOOLS
  // =========================

  const fetchTools = async () => {

    try {

      setLoading(true);

      const response = await axios.get(`${API_URL}/tools/`);

      setTools(response.data);

    } catch (error) {

      console.error("Error loading tools:", error);

      alert(
        "Unable to load tools. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchTools();

  }, []);


  // =========================
  // SEARCH
  // =========================

  const filteredTools = tools.filter((tool) => {

    const search = searchTerm.toLowerCase();

    return (
      tool.tool_id?.toLowerCase().includes(search) ||
      tool.tool_name?.toLowerCase().includes(search) ||
      tool.machine_id?.toLowerCase().includes(search)
    );

  });


  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setFormData({
      tool_id: "",
      tool_name: "",
      tool_type: "",
      manufacturer: "",
      material: "",
      machine_id: "",
      operating_hours: 0,
      expected_life: 100,
      current_wear: 0,
      rul: 100,
      status: "Normal",
      temperature: 25,
      vibration: 0,
      cutting_force: 0,
      spindle_speed: 0,
      feed_rate: 0,
      depth_of_cut: 0,
      last_maintenance: "",
      lifecycle_stage: "Tool Created",
      installation_date: ""
    });

  };


  // =========================
  // OPEN ADD MODAL
  // =========================

  const handleAddTool = () => {

    setEditingTool(null);

    resetForm();

    setShowModal(true);

  };


  // =========================
  // OPEN EDIT MODAL
  // =========================

  const handleEdit = (tool) => {

    setEditingTool(tool);

    setFormData({
      tool_id: tool.tool_id || "",
      tool_name: tool.tool_name || "",
      tool_type: tool.tool_type || "",
      manufacturer: tool.manufacturer || "",
      material: tool.material || "",
      machine_id: tool.machine_id || "",

      operating_hours: tool.operating_hours ?? 0,
      expected_life: tool.expected_life ?? 100,
      current_wear: tool.current_wear ?? 0,
      rul: tool.rul ?? 100,

      status: tool.status || "Normal",

      temperature: tool.temperature ?? 25,
      vibration: tool.vibration ?? 0,
      cutting_force: tool.cutting_force ?? 0,
      spindle_speed: tool.spindle_speed ?? 0,
      feed_rate: tool.feed_rate ?? 0,
      depth_of_cut: tool.depth_of_cut ?? 0,

      last_maintenance: tool.last_maintenance || "",
      lifecycle_stage: tool.lifecycle_stage || "Tool Created",
      installation_date: tool.installation_date || ""
    });

    setShowModal(true);

  };


  // =========================
  // SAVE TOOL
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {
        ...formData,

        operating_hours: Number(formData.operating_hours),
        expected_life: Number(formData.expected_life),
        current_wear: Number(formData.current_wear),
        rul: Number(formData.rul),

        temperature: Number(formData.temperature),
        vibration: Number(formData.vibration),
        cutting_force: Number(formData.cutting_force),
        spindle_speed: Number(formData.spindle_speed),
        feed_rate: Number(formData.feed_rate),
        depth_of_cut: Number(formData.depth_of_cut),

        last_maintenance:
          formData.last_maintenance || null,

        installation_date:
          formData.installation_date || null
      };


      if (editingTool) {

        await axios.put(
          `${API_URL}/tools/${editingTool.tool_id}`,
          payload
        );

        alert("Tool updated successfully.");

      } else {

        await axios.post(
          `${API_URL}/tools/`,
          payload
        );

        alert("Tool added successfully.");

      }


      setShowModal(false);

      setEditingTool(null);

      resetForm();

      fetchTools();

    } catch (error) {

      console.error("Save tool error:", error);

      const message =
        error.response?.data?.detail ||
        "Unable to save tool.";

      alert(message);

    }

  };


  // =========================
  // DELETE TOOL
  // =========================

  const handleDelete = async (toolId) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete Tool ${toolId}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await axios.delete(
        `${API_URL}/tools/${toolId}`
      );

      alert("Tool deleted successfully.");

      fetchTools();

    } catch (error) {

      console.error("Delete error:", error);

      alert("Unable to delete the tool.");

    }

  };


  // =========================
  // VIEW TOOL
  // =========================

  const handleView = async (tool) => {

    try {

      const response = await axios.get(
        `${API_URL}/tools/${tool.tool_id}`
      );

      setSelectedTool(response.data);

      setShowViewModal(true);

    } catch (error) {

      console.error("View tool error:", error);

      setSelectedTool(tool);

      setShowViewModal(true);

    }

  };


  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {

    if (status === "Critical") {
      return "status-critical";
    }

    if (status === "Warning") {
      return "status-warning";
    }

    return "status-normal";

  };


  // =========================
  // WEAR CLASS
  // =========================

  const getWearClass = (wear) => {

    if (wear > 75) {
      return "wear-critical";
    }

    if (wear > 40) {
      return "wear-warning";
    }

    return "wear-normal";

  };


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("toolguardUser");

    window.location.reload();

  };


  return (

    <div className="tool-management-layout">


      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="tools"
        onNavigate={onNavigate}
      />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div
        className={
          sidebarOpen
            ? "tool-management-main"
            : "tool-management-main expanded"
        }
      >


        {/* =========================
            TOP NAVBAR
        ========================= */}

        <header className="tool-topbar">

          <div className="tool-topbar-left">

            <button
              className="tool-menu-button"
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
            >

              {sidebarOpen ? (
                <FaTimes />
              ) : (
                <FaBars />
              )}

            </button>


            <div className="tool-page-heading">

              <h1>Tool Management</h1>

              <p>
                Manage and monitor all cutting tools
              </p>

            </div>

          </div>


          <div className="tool-topbar-right">

            <div className="tool-user-info">

              <div className="tool-user-avatar">
                A
              </div>

              <div>

                <strong>Admin</strong>

                <span>Tool Manager</span>

              </div>

            </div>


            <button
              className="tool-logout-button"
              onClick={handleLogout}
              title="Logout"
            >

              <FaSignOutAlt />

            </button>

          </div>

        </header>


        {/* =========================
            PAGE CONTENT
        ========================= */}

        <main className="tool-management-page">


          {/* PAGE HEADER */}

          <div className="tool-page-header">

            <div className="tool-title-section">

              <div className="tool-title-icon">

                <FaTools />

              </div>

              <div>

                <h2>Tool Inventory</h2>

                <p>
                  Add, update and manage machine tools
                </p>

              </div>

            </div>


            <button
              className="add-tool-button"
              onClick={handleAddTool}
            >

              <FaPlus />

              Add New Tool

            </button>

          </div>


          {/* =========================
              STAT CARDS
          ========================= */}

          <div className="tool-stat-grid">


            <div className="tool-stat-card">

              <div className="stat-icon">
                <FaTools />
              </div>

              <div>

                <span>Total Tools</span>

                <strong>
                  {tools.length}
                </strong>

              </div>

            </div>


            <div className="tool-stat-card normal-card">

              <div className="stat-icon">
                ✓
              </div>

              <div>

                <span>Normal</span>

                <strong>
                  {
                    tools.filter(
                      (tool) =>
                        tool.status === "Normal"
                    ).length
                  }
                </strong>

              </div>

            </div>


            <div className="tool-stat-card warning-card">

              <div className="stat-icon">
                !
              </div>

              <div>

                <span>Warning</span>

                <strong>
                  {
                    tools.filter(
                      (tool) =>
                        tool.status === "Warning"
                    ).length
                  }
                </strong>

              </div>

            </div>


            <div className="tool-stat-card critical-card">

              <div className="stat-icon">
                !
              </div>

              <div>

                <span>Critical</span>

                <strong>
                  {
                    tools.filter(
                      (tool) =>
                        tool.status === "Critical"
                    ).length
                  }
                </strong>

              </div>

            </div>

          </div>


          {/* =========================
              SEARCH
          ========================= */}

          <div className="tool-search-section">

            <div className="tool-search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Search by Tool ID, Tool Name or Machine ID..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>


            <span className="tool-count">

              {filteredTools.length} tool
              {filteredTools.length !== 1
                ? "s"
                : ""}

            </span>

          </div>


          {/* =========================
              TABLE
          ========================= */}

          <div className="tool-table-card">

            <div className="tool-table-header">

              <div>

                <h3>Registered Tools</h3>

                <p>
                  Current tool inventory and condition
                </p>

              </div>

            </div>


            {loading ? (

              <div className="tool-loading">

                Loading tools...

              </div>

            ) : filteredTools.length === 0 ? (

              <div className="tool-empty">

                <FaTools />

                <h3>No tools found</h3>

                <p>
                  Add your first tool to start monitoring.
                </p>

                <button
                  onClick={handleAddTool}
                  className="empty-add-button"
                >

                  <FaPlus />

                  Add Tool

                </button>

              </div>

            ) : (

              <div className="tool-table-wrapper">

                <table className="tool-table">

                  <thead>

                    <tr>

                      <th>Tool ID</th>

                      <th>Tool Name</th>

                      <th>Machine</th>

                      <th>Operating Hours</th>

                      <th>Wear</th>

                      <th>RUL</th>

                      <th>Status</th>

                      <th>Actions</th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredTools.map((tool) => (

                      <tr key={tool.tool_id}>


                        {/* TOOL ID */}

                        <td>

                          <div className="tool-id-cell">

                            <div className="mini-tool-icon">
                              <FaTools />
                            </div>

                            <strong>
                              {tool.tool_id}
                            </strong>

                          </div>

                        </td>


                        {/* TOOL NAME */}

                        <td>

                          <div className="tool-name-cell">

                            <strong>
                              {tool.tool_name}
                            </strong>

                            <span>
                              {tool.tool_type || "Cutting Tool"}
                            </span>

                          </div>

                        </td>


                        {/* MACHINE */}

                        <td>

                          <span className="machine-badge">

                            {tool.machine_id || "Not Assigned"}

                          </span>

                        </td>


                        {/* OPERATING HOURS */}

                        <td>

                          <strong>
                            {tool.operating_hours ?? 0}
                          </strong>

                          <span className="hours-label">
                            hrs
                          </span>

                        </td>


                        {/* WEAR */}

                        <td>

                          <div className="wear-cell">

                            <div className="wear-top">

                              <span>
                                {Number(
                                  tool.current_wear || 0
                                ).toFixed(1)}
                                %
                              </span>

                            </div>


                            <div className="wear-bar">

                              <div
                                className={`wear-fill ${getWearClass(
                                  tool.current_wear
                                )}`}
                                style={{
                                  width: `${Math.min(
                                    Number(
                                      tool.current_wear || 0
                                    ),
                                    100
                                  )}%`
                                }}
                              />

                            </div>

                          </div>

                        </td>


                        {/* RUL */}

                        <td>

                          <strong>
                            {Number(
                              tool.rul || 0
                            ).toFixed(1)}
                          </strong>

                          <span className="hours-label">
                            hrs
                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`status-badge ${getStatusClass(
                              tool.status
                            )}`}
                          >

                            <span className="status-dot" />

                            {tool.status}

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="tool-actions">

                            <button
                              className="view-action"
                              title="View Tool"
                              onClick={() =>
                                handleView(tool)
                              }
                            >

                              <FaEye />

                            </button>


                            <button
                              className="edit-action"
                              title="Edit Tool"
                              onClick={() =>
                                handleEdit(tool)
                              }
                            >

                              <FaEdit />

                            </button>


                            <button
                              className="delete-action"
                              title="Delete Tool"
                              onClick={() =>
                                handleDelete(
                                  tool.tool_id
                                )
                              }
                            >

                              <FaTrash />

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </main>

      </div>


      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (

        <div className="tool-modal-overlay">

          <div className="tool-modal">


            {/* MODAL HEADER */}

            <div className="tool-modal-header">

              <div>

                <h2>

                  {editingTool
                    ? "Edit Tool"
                    : "Add New Tool"}

                </h2>

                <p>
                  Enter tool and monitoring information
                </p>

              </div>


              <button
                className="modal-close-button"
                onClick={() =>
                  setShowModal(false)
                }
              >

                <FaTimes />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="tool-form"
            >


              {/* BASIC INFORMATION */}

              <div className="form-section">

                <h3>Basic Information</h3>


                <div className="form-grid">


                  <div className="form-group">

                    <label>
                      Tool ID *
                    </label>

                    <input
                      type="text"
                      name="tool_id"
                      value={formData.tool_id}
                      onChange={handleChange}
                      disabled={!!editingTool}
                      placeholder="Example: T001"
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Tool Name *
                    </label>

                    <input
                      type="text"
                      name="tool_name"
                      value={formData.tool_name}
                      onChange={handleChange}
                      placeholder="Example: End Mill 10mm"
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Tool Type
                    </label>

                    <input
                      type="text"
                      name="tool_type"
                      value={formData.tool_type}
                      onChange={handleChange}
                      placeholder="Example: End Mill"
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Manufacturer
                    </label>

                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      placeholder="Manufacturer name"
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Material
                    </label>

                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      placeholder="Example: Carbide"
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Machine ID
                    </label>

                    <input
                      type="text"
                      name="machine_id"
                      value={formData.machine_id}
                      onChange={handleChange}
                      placeholder="Example: CNC-001"
                    />

                  </div>

                </div>

              </div>


              {/* USAGE INFORMATION */}

              <div className="form-section">

                <h3>Tool Usage</h3>


                <div className="form-grid">


                  <div className="form-group">

                    <label>
                      Operating Hours
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="operating_hours"
                      value={formData.operating_hours}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Expected Life (Hours)
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      name="expected_life"
                      value={formData.expected_life}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Current Wear (%)
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      name="current_wear"
                      value={formData.current_wear}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      RUL (Hours)
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="rul"
                      value={formData.rul}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >

                      <option value="Normal">
                        Normal
                      </option>

                      <option value="Warning">
                        Warning
                      </option>

                      <option value="Critical">
                        Critical
                      </option>

                    </select>

                  </div>


                  <div className="form-group">

                    <label>
                      Lifecycle Stage
                    </label>

                    <select
                      name="lifecycle_stage"
                      value={formData.lifecycle_stage}
                      onChange={handleChange}
                    >

                      <option>
                        Tool Created
                      </option>

                      <option>
                        Approved
                      </option>

                      <option>
                        Installed
                      </option>

                      <option>
                        In Use
                      </option>

                      <option>
                        Wear Monitoring
                      </option>

                      <option>
                        AI Prediction
                      </option>

                      <option>
                        Maintenance
                      </option>

                      <option>
                        Reuse
                      </option>

                      <option>
                        Replacement
                      </option>

                      <option>
                        Retired
                      </option>

                    </select>

                  </div>

                </div>

              </div>


              {/* SENSOR DATA */}

              <div className="form-section">

                <h3>Machine & Sensor Data</h3>


                <div className="form-grid">


                  <div className="form-group">

                    <label>
                      Temperature (°C)
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Vibration
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="vibration"
                      value={formData.vibration}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Cutting Force
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="cutting_force"
                      value={formData.cutting_force}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Spindle Speed (RPM)
                    </label>

                    <input
                      type="number"
                      step="1"
                      min="0"
                      name="spindle_speed"
                      value={formData.spindle_speed}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Feed Rate
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="feed_rate"
                      value={formData.feed_rate}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Depth of Cut
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="depth_of_cut"
                      value={formData.depth_of_cut}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>


              {/* MAINTENANCE */}

              <div className="form-section">

                <h3>Maintenance Information</h3>


                <div className="form-grid">


                  <div className="form-group">

                    <label>
                      Last Maintenance
                    </label>

                    <input
                      type="date"
                      name="last_maintenance"
                      value={formData.last_maintenance}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Installation Date
                    </label>

                    <input
                      type="date"
                      name="installation_date"
                      value={formData.installation_date}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>


              {/* FORM BUTTONS */}

              <div className="tool-form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="save-tool-button"
                >

                  {editingTool
                    ? "Update Tool"
                    : "Add Tool"}

                </button>

              </div>


            </form>

          </div>

        </div>

      )}


      {/* =========================
          VIEW MODAL
      ========================= */}

      {showViewModal && selectedTool && (

        <div className="tool-modal-overlay">

          <div className="tool-view-modal">


            <div className="tool-modal-header">

              <div>

                <h2>
                  Tool Details
                </h2>

                <p>
                  {selectedTool.tool_id} —{" "}
                  {selectedTool.tool_name}
                </p>

              </div>


              <button
                className="modal-close-button"
                onClick={() =>
                  setShowViewModal(false)
                }
              >

                <FaTimes />

              </button>

            </div>


            {/* CONDITION SUMMARY */}

            <div className="view-condition-grid">


              <div className="condition-card">

                <span>
                  Current Wear
                </span>

                <strong>
                  {Number(
                    selectedTool.current_wear || 0
                  ).toFixed(1)}
                  %
                </strong>

              </div>


              <div className="condition-card">

                <span>
                  Condition
                </span>

                <strong
                  className={
                    getStatusClass(
                      selectedTool.status
                    )
                  }
                >
                  {selectedTool.status}
                </strong>

              </div>


              <div className="condition-card">

                <span>
                  RUL
                </span>

                <strong>
                  {Number(
                    selectedTool.rul || 0
                  ).toFixed(1)}
                  {" "}hrs
                </strong>

              </div>


              <div className="condition-card">

                <span>
                  Operating Hours
                </span>

                <strong>
                  {Number(
                    selectedTool.operating_hours || 0
                  ).toFixed(1)}
                  {" "}hrs
                </strong>

              </div>

            </div>


            {/* TOOL INFORMATION */}

            <div className="view-details-section">

              <h3>
                Tool Information
              </h3>


              <div className="details-grid">

                <div>
                  <span>Tool ID</span>
                  <strong>
                    {selectedTool.tool_id}
                  </strong>
                </div>

                <div>
                  <span>Tool Name</span>
                  <strong>
                    {selectedTool.tool_name}
                  </strong>
                </div>

                <div>
                  <span>Tool Type</span>
                  <strong>
                    {selectedTool.tool_type || "-"}
                  </strong>
                </div>

                <div>
                  <span>Manufacturer</span>
                  <strong>
                    {selectedTool.manufacturer || "-"}
                  </strong>
                </div>

                <div>
                  <span>Material</span>
                  <strong>
                    {selectedTool.material || "-"}
                  </strong>
                </div>

                <div>
                  <span>Machine</span>
                  <strong>
                    {selectedTool.machine_id || "-"}
                  </strong>
                </div>

              </div>

            </div>


            {/* SENSOR INFORMATION */}

            <div className="view-details-section">

              <h3>
                Machine & Sensor Data
              </h3>


              <div className="details-grid">

                <div>
                  <span>Temperature</span>
                  <strong>
                    {selectedTool.temperature ?? 0} °C
                  </strong>
                </div>

                <div>
                  <span>Vibration</span>
                  <strong>
                    {selectedTool.vibration ?? 0}
                  </strong>
                </div>

                <div>
                  <span>Cutting Force</span>
                  <strong>
                    {selectedTool.cutting_force ?? 0}
                  </strong>
                </div>

                <div>
                  <span>Spindle Speed</span>
                  <strong>
                    {selectedTool.spindle_speed ?? 0} RPM
                  </strong>
                </div>

                <div>
                  <span>Feed Rate</span>
                  <strong>
                    {selectedTool.feed_rate ?? 0}
                  </strong>
                </div>

                <div>
                  <span>Depth of Cut</span>
                  <strong>
                    {selectedTool.depth_of_cut ?? 0}
                  </strong>
                </div>

              </div>

            </div>


            {/* PLM INFORMATION */}

            <div className="view-details-section">

              <h3>
                PLM Lifecycle
              </h3>


              <div className="details-grid">

                <div>
                  <span>Lifecycle Stage</span>
                  <strong>
                    {selectedTool.lifecycle_stage}
                  </strong>
                </div>

                <div>
                  <span>Last Maintenance</span>
                  <strong>
                    {selectedTool.last_maintenance || "-"}
                  </strong>
                </div>

                <div>
                  <span>Installation Date</span>
                  <strong>
                    {selectedTool.installation_date || "-"}
                  </strong>
                </div>

                <div>
                  <span>Expected Life</span>
                  <strong>
                    {selectedTool.expected_life ?? 0} hrs
                  </strong>
                </div>

              </div>

            </div>


            <div className="view-modal-actions">

              <button
                className="cancel-button"
                onClick={() =>
                  setShowViewModal(false)
                }
              >

                Close

              </button>


              <button
                className="save-tool-button"
                onClick={() => {

                  setShowViewModal(false);

                  handleEdit(selectedTool);

                }}
              >

                <FaEdit />

                Edit Tool

              </button>

            </div>


          </div>

        </div>

      )}

    </div>

  );

}

export default ToolManagement;
