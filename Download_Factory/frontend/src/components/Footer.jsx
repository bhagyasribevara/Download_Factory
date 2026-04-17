import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Sparkles color="#8b5cf6" size={22} />
          <span className="footer-logo-text">DownloadFactory</span>
          <p className="footer-tagline">The fastest way to download Instagram & Facebook media in HD.</p>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Tools</h4>
          <Link to="/instagram-reels-downloader">Instagram Reels Downloader</Link>
          <Link to="/facebook-reels-download">Facebook Reels Download</Link>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Resources</h4>
          <a href="#how-it-works">How It Works</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DownloadFactory. All rights reserved.</p>
      </div>
    </footer>
  );
}
