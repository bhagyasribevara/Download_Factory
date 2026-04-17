import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Play, Link, AlertCircle, Video, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Downloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mediaData, setMediaData] = useState(null);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const pollJobStatus = async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/download/status/${jobId}`);
      const { status, media, progress: jobProgress } = response.data.data;

      if (status === 'completed') {
        setMediaData(media);
        setLoading(false);
        setPolling(false);
        toast.success(`Found: ${media.title.slice(0, 30)}...`);
      } else if (status === 'failed') {
        throw new Error(response.data.error?.message || 'Extraction failed');
      } else {
        setProgress(jobProgress || 50);
        setTimeout(() => pollJobStatus(jobId), 1500);
      }
    } catch (err) {
      setLoading(false);
      setPolling(false);
      const errMsg = err.response?.data?.error?.message || err.message || 'An unexpected error occurred';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!url) return;

    setError('');
    setMediaData(null);
    setLoading(true);
    setProgress(10);
    setIsPlaying(false);

    try {
      const response = await axios.post(`${API_URL}/download/extract`, { url });
      if (response.data.success && response.data.data.jobId) {
        setPolling(true);
        setTimeout(() => pollJobStatus(response.data.data.jobId), 1000);
      } else {
        throw new Error('Failed to start download job');
      }
    } catch (err) {
      setLoading(false);
      setPolling(false);
      const errMsg = err.response?.data?.error?.message || 'Failed to connect to server';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Input Form */}
      <motion.form
        className="input-card"
        onSubmit={handleExtract}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link className="text-secondary" style={{ color: '#9ba1b0', marginLeft: '0.5rem' }} size={24} />
        <input
          type="text"
          className="input-field"
          placeholder="Paste Instagram or Facebook URL right here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading || polling}
          id="url-input"
        />
        <button
          type="submit"
          className="action-button"
          disabled={!url || loading || polling}
          id="extract-button"
        >
          {loading || polling ? (
            <Loader2 className="spinner" size={20} />
          ) : (
            <Download size={20} />
          )}
          {loading || polling ? 'Extracting...' : 'Start Extraction'}
        </button>
      </motion.form>

      {/* Error State */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.95, height: 0 }}
            className="error-banner"
          >
            <AlertCircle size={20} />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {(loading || polling) && (
          <motion.div
            className="loading-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, position: 'absolute' }}
            key="loader"
          >
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8b5cf6',
                }}
              />
              <Sparkles size={24} color="#8b5cf6" style={{ position: 'absolute' }} />
            </div>
            <div className="loading-bar-container">
              <div className="loading-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="loading-text">
              <Loader2 size={16} className="spinner" />
              {progress < 50 ? 'Connecting to servers...' : 'Extracting media metadata...'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {mediaData && !loading && (
          <motion.div
            className="result-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            key="result"
          >
            <div className="media-preview-container">
              {mediaData.videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    className="media-player"
                    src={mediaData.videoUrl}
                    poster={mediaData.thumbnail}
                    loop playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={togglePlay}
                  />
                  {!isPlaying && (
                    <div className="play-overlay" onClick={togglePlay}>
                      <div className="play-button">
                        <Play size={32} fill="white" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <img src={mediaData.thumbnail} alt={mediaData.title} className="thumbnail" />
              )}
            </div>

            <div className="media-details">
              <div>
                <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content', marginBottom: '1rem' }}>
                  {mediaData.platform}
                </span>
                <h2 className="media-title">{mediaData.title || 'Untitled Media'}</h2>
                <div className="media-meta">
                  <span className="meta-item"><Video size={14} /> Duration: {formatDuration(mediaData.duration)}</span>
                  <span className="meta-item">User: @{mediaData.uploader}</span>
                </div>
              </div>

              <div className="divider"></div>

              <div className="download-options">
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Download Options</h3>

                {(() => {
                  const validFormats = (mediaData.formats || [])
                    .filter(f => f.hasVideo && f.hasAudio && f.url && f.ext === 'mp4')
                    .slice(0, 3);

                  if (validFormats.length > 0) {
                    return validFormats.map((format, index) => (
                      <a
                        key={index}
                        href={`${API_URL}/download/proxy?url=${encodeURIComponent(format.url)}`}
                        className={`download-btn ${index === 0 ? 'download-btn-primary' : ''}`}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Video size={18} />
                          {format.quality !== 'unknown' ? `MP4 • ${format.quality}` : 'Download Video (MP4)'}
                        </span>
                        <Download size={18} />
                      </a>
                    ));
                  } else if (mediaData.videoUrl) {
                    return (
                      <a
                        href={`${API_URL}/download/proxy?url=${encodeURIComponent(mediaData.videoUrl)}`}
                        className="download-btn download-btn-primary"
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Video size={18} /> Download High Quality (MP4)
                        </span>
                        <Download size={18} />
                      </a>
                    );
                  }
                  return null;
                })()}

                {mediaData.thumbnail && (
                  <a href={mediaData.thumbnail} target="_blank" rel="noopener noreferrer" className="download-btn" download>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Download Thumbnail (JPG)
                    </span>
                    <Download size={18} opacity={0.7} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
