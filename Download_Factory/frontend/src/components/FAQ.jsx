import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'faq-open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{question}</span>
        <ChevronDown size={18} className={`faq-chevron ${open ? 'faq-chevron-open' : ''}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ({ items }) {
  const defaultItems = [
    { q: 'Is Download Factory free to use?', a: 'Yes! Download Factory is 100% free. No hidden fees, no subscriptions, no sign-up required.' },
    { q: 'Can I download Instagram Reels?', a: 'Absolutely. Just paste the Reel link and click Extract. We support Reels, Posts, IGTV, and Stories.' },
    { q: 'Does it work with Facebook videos?', a: 'Yes. We support Facebook videos, Reels, Watch videos, and shared video links.' },
    { q: 'Will the downloaded video have audio?', a: 'Yes! All downloads include full audio. We always pick the highest quality combined video+audio stream.' },
    { q: 'Is there a watermark on downloaded videos?', a: 'No. You get the original, clean video file exactly as uploaded by the creator.' },
    { q: 'What format are the downloads?', a: 'All videos are downloaded in MP4 format, which is universally compatible with all devices and players.' },
    { q: 'Do I need to install any software?', a: 'No. Download Factory works entirely in your browser. No apps, extensions, or plugins needed.' },
    { q: 'Is it safe to use?', a: 'Yes. We don\'t store any of your data or downloaded content. Everything is processed securely and discarded.' },
  ];

  const faqData = items || defaultItems;

  return (
    <section className="section faq-section" id="faq">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="faq-list">
        {faqData.map((item, i) => (
          <FAQItem key={i} question={item.q} answer={item.a} />
        ))}
      </div>
    </section>
  );
}
