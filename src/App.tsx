import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Importar componentes
import Layout from "./components/common/Layout";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import UserList from "./components/users/UserList";
import ProjectList from "./components/projects/ProjectList";
import AIFeatures from "./components/ai/AIFeatures";
import Settings from "./components/settings/Settings";
import authService from "./services/authService";

// Componente temporal para páginas no implementadas
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="p-5 text-center">
    <h2>{title}</h2>
    <p>Esta sección está en desarrollo</p>
  </div>
);

// Componente de redirección para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar primero si existe el token de demo
        const demoToken = localStorage.getItem("supabase.auth.token");
        if (demoToken === "demo-token") {
          console.log("Token de demo encontrado, autenticación simulada");
          setIsAuthenticated(true);
          return;
        }

        // Verificación normal con Supabase
        const session = await authService.getSession();
        console.log("Sesión:", session);
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error al comprobar la autenticación:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout>
              <UserList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Layout>
              <ProjectList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <Layout>
              <AIFeatures />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
