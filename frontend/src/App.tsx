import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import "./index.css";
import "./App.css";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import EnhancedDashboardPage from "./pages/EnhancedDashboardPage";
import ApiTestPage from "./pages/ApiTestPage";
import CustomersManagementPageNew from "./pages/CustomersManagementPageNew";
import BeautifulCustomerDetailPage from "./pages/BeautifulCustomerDetailPage";
import BeautifulAddCustomerPage from "./pages/BeautifulAddCustomerPage";
import BeautifulEditCustomerPage from "./pages/BeautifulEditCustomerPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserManagementPage from "./pages/UserManagementPage";
import DebugUserPage from "./pages/DebugUserPage";
import AuthDebugPage from "./pages/AuthDebugPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup-admin" element={<SignupPage />} />
          <Route path="/debug-user" element={<DebugUserPage />} />
          <Route path="/auth-debug" element={<AuthDebugPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EnhancedDashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/api-test"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ApiTestPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CustomersManagementPageNew />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BeautifulCustomerDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers/add"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BeautifulAddCustomerPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers/edit/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BeautifulEditCustomerPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* User profile route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AppLayout>
                  <UserManagementPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
