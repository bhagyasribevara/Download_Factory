import { motion } from 'framer-motion';
import { Video, Music, Zap, Shield, Smartphone, FileVideo } from 'lucide-react';

const features = [
  { icon: <Video size={24} />, title: 'HD Video Quality', desc: 'Download videos in the highest resolution available — up to 1080p Full HD.' },
  { icon: <Music size={24} />, title: 'Audio Included', desc: 'Every download comes with crystal-clear audio. No silent videos, ever.' },
  { icon: <Zap size={24} />, title: 'Ultra Fast', desc: 'Our servers extract media in seconds. No waiting, no queues.' },
  { icon: <Shield size={24} />, title: 'No Watermarks', desc: 'Save clean, original media files without any added watermarks or logos.' },
  { icon: <Smartphone size={24} />, title: 'Mobile Friendly', desc: 'Works flawlessly on phones, tablets, and desktops. Download anywhere.' },
  { icon: <FileVideo size={24} />, title: 'MP4 Format', desc: 'All downloads are delivered in universal MP4 format. Play on any device.' },
];

export default function Features() {
  return (
    <section className="section features" id="features">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Why Choose Download Factory?
      </motion.h2>
      <div className="features-grid">
        {features.map((f, i) => (
          <motion.div
            className="feature-card"
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
