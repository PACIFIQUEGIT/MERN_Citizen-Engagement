import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Admin from './pages/admin/Admin';
import AdminSignup from './pages/adminsignup/AdminSignup';
import Tracking from './pages/tracking/Tracking';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin-signup" element={<AdminSignup />} />
      <Route path="/tracking" element={<Tracking />} />
    </Routes>
  );
}

export default App;
