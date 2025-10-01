import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import "./index.css";
import "./App.css";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import EnhancedDashboardPage from "./pages/EnhancedDashboardPage";
import ApiTestPage from "./pages/ApiTestPage";
import ModernLoginPage from "./pages/ModernLoginPage";
import ModernCustomersPage from "./pages/ModernCustomersPage";
import ModernCustomerDetailPage from "./pages/ModernCustomerDetailPage";
import ModernAddCustomerPage from "./pages/ModernAddCustomerPage";
import ModernEditCustomerPage from "./pages/ModernEditCustomerPage";
import ModernUsersPage from "./pages/ModernUsersPage";
import SignupPage from "./pages/SignupPage";
import DebugUserPage from "./pages/DebugUserPage";
import AuthDebugPage from "./pages/AuthDebugPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<ModernLoginPage />} />
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
                  <ModernCustomersPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ModernCustomerDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers/add"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ModernAddCustomerPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers/edit/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ModernEditCustomerPage />
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
                  <ModernUsersPage />
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
