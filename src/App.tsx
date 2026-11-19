import { useCallback, useEffect, useState } from 'react';
import Loader from './components/Loader';
import HeroFlow from './components/HeroFlow';
import Stories from './components/Stories';
import Tunnel from './components/Tunnel';
import Quiet from './components/Quiet';
import Numbers from './components/Numbers';
import Sessions from './components/Sessions';
import Beyond from './components/Beyond';
import Contact from './components/Contact';
import Chrome from './components/Chrome';
import { ScrollTrigger, getLenis, scrollToAnchor, startSmoothScroll, warmLazyImages } from './lib/motion';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stop = startSmoothScroll();
    getLenis()?.stop();
    window.scrollTo(0, 0);
    return stop;
  }, []);

  useEffect(() => {
    // hero CSS entrances wait (paused) until the shutter opens
    document.documentElement.classList.toggle('is-loading', loading);
    document.body.style.overflow = loading ? 'hidden' : '';
    if (!loading) {
      getLenis()?.start();
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      warmLazyImages();
    }
  }, [loading]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      scrollToAnchor(link.getAttribute('href')!);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const done = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Loader onDone={done} />}
      <a href="#stories" className="sr-only z-[100] rounded-full bg-pine px-5 py-3 text-sm text-mist focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to the stories
      </a>
      <Chrome />
      <main>
        <HeroFlow />
        <Stories />
        <Tunnel />
        <div className="bg-pine">
          <Quiet />
        </div>
        <div className="bg-pine">
          <Numbers />
        </div>
        {/* curtain grounds: what shows around each section's clip-path reveal is the colour it's leaving */}
        <div className="bg-fern">
          <Sessions />
        </div>
        <div className="bg-mist">
          <Beyond />
        </div>
        <div className="bg-fern">
          <Contact />
        </div>
      </main>
    </>
  );
}
