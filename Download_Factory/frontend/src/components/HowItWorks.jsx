import { motion } from 'framer-motion';
import { Link, Download, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: <Link size={28} />,
    title: 'Paste the URL',
    desc: 'Copy the video or reel link from Instagram or Facebook and paste it above.',
  },
  {
    icon: <Sparkles size={28} />,
    title: 'Extract Media',
    desc: 'Our engine instantly fetches the highest quality available — video + audio.',
  },
  {
    icon: <Download size={28} />,
    title: 'Download MP4',
    desc: 'Click the download button to save the video in HD MP4 format — no watermark!',
  },
];

export default function HowItWorks() {
  return (
    <section className="section how-it-works" id="how-it-works">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        How It Works
      </motion.h2>
      <div className="steps-grid">
        {steps.map((step, i) => (
          <motion.div
            className="step-card"
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="step-number">{i + 1}</div>
            <div className="step-icon">{step.icon}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
