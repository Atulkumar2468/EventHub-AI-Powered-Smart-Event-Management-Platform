import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Clubs from './pages/Clubs';
import ClubProfile from './pages/ClubProfile';
import AIAssistant from './pages/AIAssistant';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#192122',
              color: '#dce4e5',
              border: '1px solid #3b494c',
              borderRadius: '0',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            },
            success: { iconTheme: { primary: '#00e5ff', secondary: '#0a0a0a' } },
            error: { iconTheme: { primary: '#ffb4ab', secondary: '#0a0a0a' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<ProductDetail />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:id" element={<ClubProfile />} />
          <Route path="/ai" element={<AIAssistant />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
