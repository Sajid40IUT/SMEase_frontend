import { Routes, Route, Navigate } from "react-router-dom";
import { Frame as LoginPage } from "./screens/Frame";
import { Dashboard } from "./screens/Dashboard";
import { EmployeeOverview } from "./screens/EmployeeOverview";
import { EmployeeManagement } from "./screens/EmployeeManagement";
import { InventoryOverview } from "./screens/InventoryOverview";
import { InventoryManagement } from "./screens/InventoryManagement";
import { useState } from "react";
import { PayrollDistribution } from "./screens/PayrollDistribution";
import { LegalDocumentation } from "./screens/LegalDocumentation";

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage setIsAuthenticated={setIsAuthenticated} />
          )
        } 
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/employee-overview"
        element={
          isAuthenticated ? (
            <EmployeeOverview />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/employee-management"
        element={
          isAuthenticated ? (
            <EmployeeManagement />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/inventory-overview"
        element={
          isAuthenticated ? (
            <InventoryOverview />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/inventory-management"
        element={
          isAuthenticated ? (
            <InventoryManagement />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/payroll-distribution"
        element={
          isAuthenticated ? (
            <PayrollDistribution />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/legal-documentation"
        element={
          isAuthenticated ? (
            <LegalDocumentation />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};