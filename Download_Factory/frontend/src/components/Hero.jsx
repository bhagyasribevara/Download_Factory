import { motion } from 'framer-motion';

export default function Hero({ title, highlight, subtitle }) {
  return (
    <motion.div
      className="hero"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="hero-title">
        {title} <span>{highlight}</span>
      </h1>
      <p className="hero-subtitle">{subtitle}</p>
    </motion.div>
  );
}
