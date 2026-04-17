import SEOHead from '../components/SEOHead';
import Hero from '../components/Hero';
import TrustSignals from '../components/TrustSignals';
import Downloader from '../components/Downloader';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import FAQ from '../components/FAQ';
import AdPlaceholder from '../components/AdPlaceholder';

export default function HomePage() {
  return (
    <>
      <SEOHead
        title="Download Factory — Free Instagram & Facebook Video Downloader (HD MP4)"
        description="Download Instagram Reels, Facebook Videos, and Stories in HD MP4 format. Free, fast, no watermarks, no registration. Works on all devices."
        keywords="instagram downloader, facebook video downloader, reels downloader, instagram video download, facebook reels download, mp4 downloader"
        canonical="https://downloadfactory.app/"
      />

      <Hero
        title="Ultimate"
        highlight="Facebook & Instagram"
        subtitle="Instantly extract and download high-quality Reels, Posts, and Videos from Instagram and Facebook. Free, fast, and no watermarks."
      />

      <TrustSignals />

      <AdPlaceholder variant="banner" id="ad-hero-top" />

      <Downloader />

      <AdPlaceholder variant="inline" id="ad-after-downloader" />

      <HowItWorks />
      <Features />

      <AdPlaceholder variant="inline" id="ad-before-faq" />

      <FAQ />
    </>
  );
}
