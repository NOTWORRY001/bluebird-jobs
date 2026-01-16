import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Auth Pages
import RoleSelection from "./pages/auth/RoleSelection";
import Login from "./pages/auth/Login";

// Worker Pages
import WorkerHome from "./pages/worker/WorkerHome";
import WorkerApplications from "./pages/worker/WorkerApplications";
import WorkerProfile from "./pages/worker/WorkerProfile";

// Admin Pages
import AdminHome from "./pages/admin/AdminHome";
import PostJob from "./pages/admin/PostJob";
import ManageWorkers from "./pages/admin/ManageWorkers";
import Payments from "./pages/admin/Payments";
import AdminProfile from "./pages/admin/AdminProfile";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'worker' | 'admin' }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'worker' ? '/worker' : '/admin'} replace />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === 'worker' ? '/worker' : '/admin'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<AuthRoute><RoleSelection /></AuthRoute>} />
      <Route path="/auth/login" element={<AuthRoute><Login /></AuthRoute>} />

      {/* Worker Routes */}
      <Route path="/worker" element={<ProtectedRoute role="worker"><WorkerHome /></ProtectedRoute>} />
      <Route path="/worker/applications" element={<ProtectedRoute role="worker"><WorkerApplications /></ProtectedRoute>} />
      <Route path="/worker/profile" element={<ProtectedRoute role="worker"><WorkerProfile /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>} />
      <Route path="/admin/post-job" element={<ProtectedRoute role="admin"><PostJob /></ProtectedRoute>} />
      <Route path="/admin/workers" element={<ProtectedRoute role="admin"><ManageWorkers /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute role="admin"><Payments /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
