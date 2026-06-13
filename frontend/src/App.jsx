import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Segments from './pages/Segments';
import Campaigns from './pages/Campaigns';
import CampaignReport from './pages/CampaignReport';
import AIStudio from './pages/AIStudio';
import Ingest from './pages/Ingest';
import LandingPage from './pages/LandingPage';
import { getMe } from './services/api';

function AppLayout({ user, theme, toggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)', transition: 'background 0.25s' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/dashboard" element={
                <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <Dashboard />
                </motion.div>
              } />
              <Route path="/customers" element={
                <motion.div key="customers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <Customers />
                </motion.div>
              } />
              <Route path="/orders" element={
                <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <Orders />
                </motion.div>
              } />
              <Route path="/ingest" element={
                <motion.div key="ingest" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <Ingest />
                </motion.div>
              } />
              <Route path="/segments" element={
                <motion.div key="segments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <Segments />
                </motion.div>
              } />
              <Route path="/campaigns" element={
                <motion.div key="campaigns" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <Campaigns />
                </motion.div>
              } />
              <Route path="/campaigns/:id" element={
                <motion.div key="report" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <CampaignReport />
                </motion.div>
              } />
              <Route path="/ai-studio" element={
                <motion.div key="ai" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <AIStudio />
                </motion.div>
              } />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    if (oauthError === 'google_auth_failed') {
      window.history.replaceState({}, '', '/');
      setTimeout(() => toast.error('Google sign-in failed. Please try again or use email/password.'), 100);
    }

    getMe()
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <Loader size="lg" text="Loading OutReach..." />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: 'var(--color-bg)' } },
          error: { iconTheme: { primary: '#f87171', secondary: 'var(--color-bg)' } },
        }}
      />
      {user ? (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<AppLayout user={user} theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />} />
          <Route path="/login" element={<LoginPage onLogin={(u) => setUser(u)} initialTab="login" theme={theme} />} />
          <Route path="/signup" element={<LoginPage onLogin={(u) => setUser(u)} initialTab="signup" theme={theme} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
