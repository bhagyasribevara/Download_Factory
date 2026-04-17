import SEOHead from '../components/SEOHead';
import Hero from '../components/Hero';
import TrustSignals from '../components/TrustSignals';
import Downloader from '../components/Downloader';
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';
import AdPlaceholder from '../components/AdPlaceholder';

const faqItems = [
  { q: 'Can I download Facebook Reels?', a: 'Yes! Download Factory fully supports Facebook Reels. Just copy the Reel link and paste it above to download in HD MP4.' },
  { q: 'Where do I find the Facebook Reel link?', a: 'Open the Reel in your Facebook app or browser, tap the share button, and select "Copy Link". Then paste it here.' },
  { q: 'Is the audio included in Facebook Reels downloads?', a: 'Yes. Every Facebook Reel is downloaded with its complete audio — background music, voiceover, and all sound effects.' },
  { q: 'What quality will the Reel be?', a: 'We automatically select the highest available quality, usually 720p or 1080p HD.' },
  { q: 'Are there any limits on downloads?', a: 'No! Download as many Facebook Reels as you want. It\'s completely unlimited and free.' },
  { q: 'Does it work with shared Reels?', a: 'Yes. If the Reel is publicly accessible, it can be downloaded regardless of whether it was shared from another page.' },
  { q: 'Can I use this on my iPhone or Android?', a: 'Absolutely. The tool is fully mobile-optimized and works in any browser on any device.' },
  { q: 'Is it safe to use this downloader?', a: 'Yes. We don\'t store your data, we don\'t ask for login credentials, and all processing is secure and temporary.' },
];

export default function FacebookReelsPage() {
  return (
    <>
      <SEOHead
        title="Facebook Reels Downloader — Save FB Reels in HD MP4 Free"
        description="Download Facebook Reels in HD MP4 format for free. Save any public Facebook Reel with full audio, no watermark, no registration. Fast and easy."
        keywords="facebook reels downloader, download facebook reels, fb reels download, save facebook reels, facebook reel video download"
        canonical="https://downloadfactory.app/facebook-reels-download"
      />

      <Hero
        title="Download"
        highlight="Facebook Reels"
        subtitle="Save Facebook Reels in HD MP4 with full audio. No watermarks, no sign-up, completely free. Paste the link and download now."
      />

      <TrustSignals />

      <AdPlaceholder variant="banner" id="ad-fb-reels-top" />

      <section className="section seo-intro">
        <h2 className="section-title">Save Facebook Reels in HD Instantly</h2>
        <p className="seo-text">
          Facebook Reels are one of the hottest short-form video formats, and now you can save them 
          effortlessly with Download Factory. Our tool instantly extracts the full HD video file with 
          original audio, delivering a clean MP4 download with no watermarks.
        </p>
        <p className="seo-text">
          Whether you want to save an inspiring motivational reel, a product demo, or a hilarious 
          comedy skit — just copy the Facebook Reel URL, paste it above, and hit Extract. The download 
          will be ready within seconds, compatible with all your devices.
        </p>
      </section>

      <Downloader />

      <AdPlaceholder variant="inline" id="ad-fb-reels-mid" />

      <HowItWorks />

      <AdPlaceholder variant="inline" id="ad-fb-reels-prefaq" />

      <FAQ items={faqItems} />
    </>
  );
}
