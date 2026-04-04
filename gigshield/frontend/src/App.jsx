import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ClaimDetail from './pages/ClaimDetail';
import AdminPanel from './pages/AdminPanel';
import RaiseIssue from './pages/RaiseIssue';
import Payments from './pages/Payments';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col items-center">
        <header className="w-full glass-dark p-4 text-white font-bold text-center shadow sticky top-0 z-50 tracking-wide">
          ⛱️ GigShield — Parametric Income Protection
        </header>
        <div className="w-full p-4 mt-6">
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/raise-issue" element={<RaiseIssue />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/claim/:id" element={<ClaimDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
