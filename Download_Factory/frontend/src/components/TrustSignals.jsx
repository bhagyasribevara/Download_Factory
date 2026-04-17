import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Heart } from 'lucide-react';

const signals = [
  { icon: <Shield size={20} />, text: '100% Safe & Secure' },
  { icon: <Zap size={20} />, text: 'Lightning Fast Downloads' },
  { icon: <Globe size={20} />, text: 'No Registration Required' },
  { icon: <Heart size={20} />, text: 'Trusted by 50,000+ Users' },
];

export default function TrustSignals() {
  return (
    <motion.div
      className="trust-signals"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {signals.map((s, i) => (
        <div className="trust-item" key={i}>
          <span className="trust-icon">{s.icon}</span>
          <span className="trust-text">{s.text}</span>
        </div>
      ))}
    </motion.div>
  );
}
