import SEOHead from '../components/SEOHead';
import Hero from '../components/Hero';
import TrustSignals from '../components/TrustSignals';
import Downloader from '../components/Downloader';
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';
import AdPlaceholder from '../components/AdPlaceholder';

const faqItems = [
  { q: 'How do I download Instagram Reels?', a: 'Simply open the Reel on Instagram, tap the three dots, copy the link, and paste it above. Click "Start Extraction" and your Reel will be ready to download in HD MP4.' },
  { q: 'Can I save Reels without a watermark?', a: 'Yes! Download Factory saves the original video file directly. There are no watermarks, logos, or overlays added to your download.' },
  { q: 'Is the audio included in Reel downloads?', a: 'Absolutely. Every Reel is downloaded with its original audio track — music, voiceover, and sound effects included.' },
  { q: 'Do I need an Instagram account to download Reels?', a: 'No. As long as the Reel is publicly accessible, you can download it without logging in to Instagram.' },
  { q: 'What quality are the downloaded Reels?', a: 'We always fetch the highest quality available, typically 1080p Full HD with crystal-clear audio.' },
  { q: 'Can I download Reels on my phone?', a: 'Yes! Download Factory works on all devices — iPhone, Android, tablets, and desktop computers.' },
  { q: 'Is it legal to download Instagram Reels?', a: 'Downloading content for personal use is generally acceptable. Always respect the creator\'s rights and do not redistribute without permission.' },
  { q: 'How many Reels can I download?', a: 'There is no limit! Download as many Reels as you want, completely free.' },
];

export default function InstagramReelsPage() {
  return (
    <>
      <SEOHead
        title="Instagram Reels Downloader — Save Reels in HD MP4 (Free, No Watermark)"
        description="Download Instagram Reels in HD MP4 format for free. No watermark, no signup. Save any public Instagram Reel video with audio to your device in seconds."
        keywords="instagram reels downloader, save instagram reels, download reels mp4, instagram reel video download, reels saver"
        canonical="https://downloadfactory.app/instagram-reels-downloader"
      />

      <Hero
        title="Download"
        highlight="Instagram Reels"
        subtitle="Save any Instagram Reel in HD MP4 format. Full audio, no watermarks, completely free. Just paste the link and download instantly."
      />

      <TrustSignals />

      <AdPlaceholder variant="banner" id="ad-ig-reels-top" />

      <section className="section seo-intro">
        <h2 className="section-title">The Best Instagram Reels Downloader Online</h2>
        <p className="seo-text">
          Download Factory is the fastest and most reliable Instagram Reels downloader on the web. Whether you want to 
          save a viral dance video, a cooking tutorial, or a funny meme reel — our tool extracts the original HD video 
          file with full audio in just seconds. No app installation needed, no account required, and absolutely no 
          watermarks on your downloads.
        </p>
        <p className="seo-text">
          Our advanced extraction engine supports all types of Instagram content including Reels, Posts, IGTV videos, 
          and Stories. Simply copy the Instagram URL, paste it into the field below, and click "Start Extraction". Your 
          video will be ready to download in MP4 format within seconds.
        </p>
      </section>

      <Downloader />

      <AdPlaceholder variant="inline" id="ad-ig-reels-mid" />

      <HowItWorks />

      <AdPlaceholder variant="inline" id="ad-ig-reels-prefaq" />

      <FAQ items={faqItems} />
    </>
  );
}
