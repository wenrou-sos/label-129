import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import VisitDetail from "@/pages/VisitDetail";
import HealthCompare from "@/pages/HealthCompare";
import MedicalCalendar from "@/pages/MedicalCalendar";
import { BottomNav } from "@/components/BottomNav";

function AppContent() {
  const location = useLocation();
  const showBottomNav = !location.pathname.startsWith('/visit/');

  return (
    <div className="min-h-screen bg-surface-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visit/:id" element={<VisitDetail />} />
        <Route path="/compare" element={<HealthCompare />} />
        <Route path="/calendar" element={<MedicalCalendar />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
