import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import MattressChecker from './pages/MattressChecker';
import CleanupGuide from './pages/CleanupGuide';
import Visualizer from './components/Visualizer';
import LiveExpert from './pages/LiveExpert';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-background text-text font-sans">
        <NavBar />
        <main className="flex-1 ml-16 md:ml-64 p-6 overflow-y-auto h-screen relative">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<LiveExpert />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/checker" element={<MattressChecker />} />
            <Route path="/cleanup" element={<CleanupGuide />} />
            <Route path="/scan" element={<Visualizer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
