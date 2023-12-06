import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import ProtectedRoute from "./providers/Auth/ProtectedRoute";

import AppLayout from "./components/AppLayout";
import CustomerDashboard from "./components/CustomerDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import SupplierDashboard from "./components/SupplierDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/home" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CustomerDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ManagerDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier-dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SupplierDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
