import { useRef } from 'react';
import Hero from './Hero';
import { gsap, useGSAP } from '../lib/motion';
import { MANIFESTO } from '../data/content';

/**
 * Pins the hero and turns it into the opening shot: the name parts and the arch opens until the
 * picture fills the screen, the manifesto develops word by word over it, and finally the image
 * closes into the exact arch of the Stories reel's first frame (which overlaps this pin's last
 * screen), so the hand-off has no visible cut.
 */
export default function HeroFlow() {
  const root = useRef<HTMLDivElement>(null);
  const words = MANIFESTO.split(' ');

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Where the Stories hand-off frame sits once its section reaches the top of the viewport
      const target = () => {
        // layout offsets, not rects: the reel track may already be translated when ScrollTrigger refreshes
        const frame = document.querySelector<HTMLElement>('#stories [data-handoff]');
        if (!frame) return 'inset(0px 0px 0px 0px)';
        const { offsetTop: top, offsetLeft: left, offsetWidth: w, offsetHeight: h } = frame;
        const box = root.current!;
        return `inset(${top}px ${box.offsetWidth - left - w}px ${box.offsetHeight - top - h}px ${left}px round ${w / 2}px ${w / 2}px 0px 0px)`;
      };

      // The arch window, in the same layout terms as the hand-off target
      const arch = () => q('[data-hero-arch]')[0] as HTMLElement;
      const slot = () => {
        const el = arch();
        const box = root.current!;
        const { offsetTop: top, offsetLeft: left, offsetWidth: w, offsetHeight: h } = el;
        return `inset(${top}px ${box.offsetWidth - left - w}px ${box.offsetHeight - top - h}px ${left}px round ${w / 2}px ${w / 2}px 0px 0px)`;
      };
      const FULL = 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)';

      // The full-screen photo starts scaled down just enough to still cover the window, so the
      // print shows the whole couple rather than a slice of the wide crop
      const slotFit = () => {
        const el = arch();
        const box = root.current!;
        return Math.max(el.offsetWidth / box.offsetWidth, el.offsetHeight / box.offsetHeight) * 1.05;
      };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: true, // Lenis already smooths the scroll; any extra lag would break the hand-off
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(q('[data-hero-fade]'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -30, duration: 0.1 }, 0)
        // the name parts to either side while the arch opens into the full picture
        .to(q('[data-hero-life]'), { xPercent: -42, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, 0.02)
        .to(q('[data-hero-touch]'), { xPercent: 42, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, 0.02)
        .to(q('[data-hero-arch]'), { autoAlpha: 0, duration: 0.04 }, 0.04)
        .fromTo(q('[data-hero-frame]'), { clipPath: slot }, { clipPath: FULL, duration: 0.24, ease: 'power2.inOut' }, 0.06)
        // on wide screens the couple stands right of centre, so the arch starts slid onto them
        .fromTo(q('[data-hero-frame-img]'), { scale: slotFit, xPercent: () => (innerWidth >= 640 ? -9 : 0) }, { scale: 1, xPercent: 0, duration: 0.24, ease: 'power2.inOut' }, 0.06)
        .to(q('[data-shade]'), { autoAlpha: 0.55, duration: 0.12 }, 0.3)
        .fromTo(q('[data-manifesto]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.33)
        .fromTo(q('[data-kicker]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.34)
        .fromTo(
          q('[data-word]'),
          { autoAlpha: 0.08, yPercent: 40, rotateX: -70 },
          { autoAlpha: 1, yPercent: 0, rotateX: 0, stagger: 0.011, duration: 0.08, ease: 'power2.out' },
          0.36,
        )
        // hand-off: text lifts away, the ground turns pine and the frame shrinks into the reel's first frame
        .to(q('[data-manifesto]'), { yPercent: -12, autoAlpha: 0, duration: 0.08 }, 0.78)
        .to(q('[data-shade]'), { autoAlpha: 0, duration: 0.08 }, 0.8)
        .fromTo(q('[data-backdrop]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.8)
        .fromTo(q('[data-hero-frame]'), { clipPath: FULL }, { clipPath: target, duration: 0.14, ease: 'power3.inOut', immediateRender: false }, 0.82)
        .to(q('[data-hero-frame-img]'), { scale: 1, duration: 0.14 }, 0.82)
        .to({}, { duration: 0.1 }); // hold the matched frame before the reel takes over
    },
    { scope: root },
  );

  return (
    <div ref={root} id="top" className="relative isolate h-[100lvh] w-full overflow-hidden bg-pine">
      <Hero />

      <div data-backdrop className="pointer-events-none invisible absolute inset-0 z-[14] bg-pine" />
      <div data-shade className="pointer-events-none invisible absolute inset-0 z-[35] bg-pine opacity-0" />

      <div
        data-manifesto
        className="pointer-events-none invisible absolute inset-0 z-[36] flex flex-col justify-center px-6 text-mist sm:px-10"
        style={{ perspective: '900px' }}
      >
        <p data-kicker className="invisible mb-6 text-xs uppercase tracking-[0.25em] text-dune sm:mb-10 sm:text-sm">
          (01) — The studio
        </p>
        <p className="max-w-[18ch] text-[9vw] leading-[1.02] tracking-tight sm:max-w-[22ch] sm:text-[5.6vw]">
          {words.map((w, i) => (
            <span key={i} className="mask">
              <span data-word className="inline-block origin-bottom will-change-transform">
                {w}&nbsp;
              </span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
