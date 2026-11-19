import { useRef } from 'react';
import { curtain, gsap, useGSAP, motionOff, scrollToY, setMotion } from '../lib/motion';
import { HERO_IMAGE, IG, IG_DM, PHONE, PHONE_LABEL, REELS, THREADS, img } from '../data/content';
import SplitChars from './SplitChars';

const LINE_1 = 'Reserve';
const LINE_2 = 'your date.';


/** The closing credits: the sign-off rises letter by letter over a slow-drifting last frame. */
export default function Contact() {
  const root = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      curtain(root.current, 'top 25%');
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'top 10%', scrub: 1 } })
        .fromTo(q('[data-cc]'), { yPercent: 150, rotate: 12 }, { yPercent: 0, rotate: 0, stagger: 0.03, ease: 'power3.out' })
        .fromTo(q('[data-bgimg]'), { scale: 1.4, autoAlpha: 0 }, { scale: 1.1, autoAlpha: 0.35, ease: 'none' }, 0);

      gsap.fromTo(q('[data-bgimg]'), { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } });
      gsap.from(q('[data-foot] > *'), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: q('[data-foot]')[0], start: 'top 95%' } });
    },
    { scope: root },
  );

  // magnetic call-to-action
  const onMagnet = contextSafe((e: React.PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(e.currentTarget, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.6, ease: 'power3.out' });
  });
  const onMagnetLeave = contextSafe((e: React.PointerEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
  });

  return (
    <section ref={root} id="contact" className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-pine px-6 pb-8 pt-44 text-mist sm:px-10">
      <img data-bgimg src={img(HERO_IMAGE)} alt="" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[62%_45%] opacity-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pine via-pine/60 to-pine/90" />

      <div className="relative">
        <p className="text-xs uppercase tracking-[0.2em]">(08) — Contact</p>
        <h2 className="mt-10 text-[17vw] leading-[0.95] tracking-tight sm:text-[12vw]">
          <span className="block">
            <SplitChars text={LINE_1} attr="data-cc" />
          </span>
          <span className="block font-poem italic text-dune">
            <SplitChars text={LINE_2} attr="data-cc" />
          </span>
        </h2>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href={PHONE}
            onPointerMove={onMagnet}
            onPointerLeave={onMagnetLeave}
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-dune px-8 text-sm text-pine transition-colors duration-300 hover:bg-mist"
          >
            Call {PHONE_LABEL}
          </a>
          <a
            href={IG_DM}
            target="_blank"
            rel="noreferrer"
            onPointerMove={onMagnet}
            onPointerLeave={onMagnetLeave}
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-mist px-8 text-sm text-pine transition-colors duration-300 hover:bg-dune"
          >
            Message on Instagram ↗
          </a>
        </div>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-mist/70">
          Weddings, engagements and events in and around Shillong. Message the studio with your date and venue.
        </p>
      </div>

      <footer data-foot className="relative mt-24 grid gap-8 border-t border-mist/15 pt-8 text-sm sm:grid-cols-4">
        <div>
          <p className="text-mist/50">Studio</p>
          <p className="mt-2">Lifetouch Photography, Shillong</p>
          <a href={PHONE} className="block py-2 hover:text-dune sm:py-0">
            {PHONE_LABEL}
          </a>
        </div>
        <div>
          <p className="text-mist/50">Follow</p>
          <a href={IG} target="_blank" rel="noreferrer" className="mt-1 block py-2 hover:text-dune sm:mt-2 sm:py-0">
            Instagram ↗
          </a>
          <a href={IG_DM} target="_blank" rel="noreferrer" className="block py-2 hover:text-dune sm:py-0">
            Send a message ↗
          </a>
        </div>
        <div>
          <p className="text-mist/50">More</p>
          <a href={REELS} target="_blank" rel="noreferrer" className="mt-1 block py-2 hover:text-dune sm:mt-2 sm:py-0">
            Reels ↗
          </a>
          <a href={THREADS} target="_blank" rel="noreferrer" className="block py-2 hover:text-dune sm:py-0">
            Threads ↗
          </a>
        </div>
        <div className="flex items-end justify-between sm:flex-col sm:items-end">
          <button type="button" onClick={() => scrollToY(0)} className="py-2 hover:text-dune sm:py-0" data-cursor="Top">
            Back to the beginning ↑
          </button>
          <button type="button" onClick={() => setMotion(motionOff())} className="py-2 text-mist/60 hover:text-dune sm:py-0">
            Motion: {motionOff() ? 'Off' : 'On'}
          </button>
        </div>
        <p className="text-xs leading-relaxed text-mist/60 sm:col-span-4">
          Design concept for Lifetouch Photography, not yet the official site. Photographs and captions from @lifetouch_photography_shillong, used for preview only.
        </p>
      </footer>
    </section>
  );
}
