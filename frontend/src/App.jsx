import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import Team from './pages/Team';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <div className="app-layout">
            <Sidebar />
            <Dashboard />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/projects" element={
        <ProtectedRoute>
          <div className="app-layout">
            <Sidebar />
            <Projects />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/projects/:id" element={
        <ProtectedRoute>
          <div className="app-layout">
            <Sidebar />
            <ProjectDetail />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/tasks" element={
        <ProtectedRoute>
          <div className="app-layout">
            <Sidebar />
            <Tasks />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/team" element={
        <ProtectedRoute>
          <div className="app-layout">
            <Sidebar />
            <Team />
          </div>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '10px',
            border: '1px solid #E1EBF0',
            boxShadow: '0 4px 20px rgba(135,206,235,0.25)',
          },
          success: { iconTheme: { primary: '#34D399', secondary: 'white' } },
          error: { iconTheme: { primary: '#F87171', secondary: 'white' } },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;