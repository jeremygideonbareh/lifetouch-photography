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
    // measure once the fonts are in, while the loader still covers the page: a refresh re-wraps the
    // pinned hero, which would restart its entrance animations if it happened after the reveal
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return stop;
  }, []);

  useEffect(() => {
    // hero CSS entrances wait (paused) until the shutter opens
    document.documentElement.classList.toggle('is-loading', loading);
    document.body.style.overflow = loading ? 'hidden' : '';
    if (!loading) {
      getLenis()?.start();
      warmLazyImages();
    }
  }, [loading]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      const hash = link.getAttribute('href')!;
      scrollToAnchor(hash);
      // keyboard and screen-reader users land where the page now shows
      const target = hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
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
        <div className="bg-fern">
          <Tunnel />
        </div>
        <div className="bg-fern">
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
