import React, { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ToolManagement from "./pages/ToolManagement";
import MachineMonitoring from "./pages/MachineMonitoring";
import WearPrediction from "./pages/WearPrediction";
import RULPrediction from "./pages/RULPrediction";
import ToolLifecycle from "./pages/ToolLifecycle";
import MaintenanceAlerts from "./pages/MaintenanceAlerts";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Login Page
  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Tool Management
  if (currentPage === "tools") {
    return (
      <ToolManagement
        onNavigate={handleNavigate}
      />
    );
  }

  // Machine & Sensors
  if (currentPage === "machine") {
    return (
      <MachineMonitoring
        onNavigate={handleNavigate}
      />
    );
  }

  // AI Wear Prediction
  if (currentPage === "wear") {
    return (
      <WearPrediction
        onNavigate={handleNavigate}
      />
    );
  }

  // RUL Prediction
  if (currentPage === "rul") {
    return (
      <RULPrediction
        onNavigate={handleNavigate}
      />
    );
  }

  // Tool Lifecycle / PLM
  if (currentPage === "lifecycle") {
    return (
      <ToolLifecycle
        onNavigate={handleNavigate}
      />
    );
  }

  // Maintenance & Alerts
  if (currentPage === "maintenance") {
    return (
      <MaintenanceAlerts
        onNavigate={handleNavigate}
      />
    );
  }

  // Dashboard
  return (
    <Dashboard
      onNavigate={handleNavigate}
    />
  );
}

export default App;