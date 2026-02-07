import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import MattressChecker from './pages/MattressChecker';
import CleanupGuide from './pages/CleanupGuide';
import Visualizer from './components/Visualizer';
import LiveExpert from './pages/LiveExpert';
import SafetyLab from './pages/SafetyLab';
import Assessment from './pages/Assessment';
import DisclaimerModal from './components/DisclaimerModal';

// Placeholder Components for secondary routes
const EducationHub = () => <div className="p-10"><h1 className="text-4xl font-display mb-4 uppercase">Education Hub</h1><p className="text-muted">Researching health impacts and manufacturing laws.</p></div>;
const CommunityForum = () => <div className="p-10"><h1 className="text-4xl font-display mb-4 uppercase">Community Nexus</h1><p className="text-muted">Direct connection to the Facebook Support Group community.</p></div>;
const Resources = () => <div className="p-10"><h1 className="text-4xl font-display mb-4 uppercase">Verified Resources</h1><p className="text-muted">Safety supply chain data.</p></div>;
const OrganizationResources = () => <div className="p-10"><h1 className="text-4xl font-display mb-4 uppercase">mattressfiberglass.org</h1><p className="text-muted">Official document repository.</p></div>;
const ReportIncident = () => <div className="p-10"><h1 className="text-4xl font-display mb-4 uppercase">Registry Report</h1><p className="text-muted">Incident logging for regulatory tracking.</p></div>;
const ContactUs = () => <div className="p-10"><h1 className="text-4xl font-display mb-4 uppercase">Contact Nexus</h1><p className="text-muted">Direct co-founder line.</p></div>;

const App: React.FC = () => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('fiberglass_disclaimer_accepted');
    if (!accepted) {
      setIsDisclaimerOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('fiberglass_disclaimer_accepted', 'true');
    setIsDisclaimerOpen(false);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-background text-text font-sans overflow-hidden">
        <DisclaimerModal isOpen={isDisclaimerOpen} onAccept={handleAccept} />
        <NavBar />
        <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen relative scroll-smooth bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_50%)]">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<LiveExpert />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/checker" element={<MattressChecker />} />
            <Route path="/cleanup" element={<CleanupGuide />} />
            <Route path="/scan" element={<Visualizer />} />
            <Route path="/lab" element={<SafetyLab />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/hub" element={<EducationHub />} />
            <Route path="/forum" element={<CommunityForum />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/org-resources" element={<OrganizationResources />} />
            <Route path="/report" element={<ReportIncident />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;