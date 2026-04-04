import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ClaimDetail from './pages/ClaimDetail';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        <header className="w-full bg-blue-600 p-4 text-white font-bold text-center shadow">
          Seguro Partner - Parametric Income Protection
        </header>
        <div className="w-full max-w-md md:max-w-4xl p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/claim/:id" element={<ClaimDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
