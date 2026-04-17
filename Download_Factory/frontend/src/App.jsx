import { Routes, Route, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import InstagramReelsPage from './pages/InstagramReelsPage';
import FacebookReelsPage from './pages/FacebookReelsPage';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <div className="cosmic-bg"></div>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#13131a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />

      {/* Header */}
      <header className="header">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <Sparkles color="#8b5cf6" size={28} />
          <span>DownloadFactory</span>
        </Link>
        <nav className="header-nav">
          <Link to="/instagram-reels-downloader">Instagram Reels</Link>
          <Link to="/facebook-reels-download">Facebook Reels</Link>
        </nav>
      </header>

      {/* Page Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/instagram-reels-downloader" element={<InstagramReelsPage />} />
          <Route path="/facebook-reels-download" element={<FacebookReelsPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
