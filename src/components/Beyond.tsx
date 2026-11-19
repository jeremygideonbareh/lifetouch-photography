import { useRef } from 'react';
import { curtain, gsap, useGSAP } from '../lib/motion';
import { BEYOND_FRAMES, THREADS, thumb } from '../data/content';

/** Where else to find the studio: three frames rise out of a stack and fan open in 3D as you scroll. */
export default function Beyond() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const frames = q('[data-frame]');
      const mm = gsap.matchMedia();

      curtain(root.current, 'top top');

      // the title sets while the sheet rises, so the section is never an empty colour field
      gsap.fromTo(
        q('[data-s-title] .mask > span'),
        { yPercent: 150 },
        { yPercent: 0, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'top 15%', scrub: true } },
      );

      mm.add({ wide: '(min-width: 1100px)', mid: '(min-width: 640px) and (max-width: 1099px)', narrow: '(max-width: 639px)' }, (ctx) => {
        const { wide, mid } = ctx.conditions ?? {};
        const spread = wide || mid ? 30 : 0;
        // distance between fanned frames, in frame widths, sized so the outer frames stay on screen
        const step = wide ? 1.12 : mid ? 0.9 : 1.08;
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=180%', pin: true, scrub: 1 },
        });

        tl.fromTo(
          frames,
          { xPercent: -50, yPercent: 60, rotateX: 55, rotateY: 0, rotateZ: (i) => (i - 1) * 4, z: -400, opacity: 0 },
          { yPercent: -50, rotateX: 0, z: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: 'power2.out' },
          0,
        )
          .to(
            frames,
            {
              xPercent: (i) => -50 + (i - 1) * step * 100,
              yPercent: -50,
              rotateY: (i) => (i - 1) * -spread,
              rotateZ: 0,
              z: (i) => (!spread ? 0 : i === 1 ? 120 : -60),
              scale: mid ? 0.8 : 1,
              duration: 0.4,
              ease: 'power2.inOut',
            },
            0.45,
          )
          .fromTo(q('[data-s-label]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.12 }, 0.72)
          .to({}, { duration: 0.15 }); // hold the finished fan before the pin lets go
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="beyond" className="relative h-[100lvh] overflow-hidden bg-fern text-mist">
      <div className="absolute inset-x-6 top-20 z-10 flex justify-between text-xs uppercase tracking-[0.2em] sm:inset-x-10">
        <span>(07) — Elsewhere</span>
        <a href={THREADS} target="_blank" rel="noreferrer" className="hidden hover:text-dune sm:inline" data-cursor="Visit">
          Threads ↗
        </a>
      </div>

      <h2 data-s-title className="absolute inset-x-6 top-[14svh] z-0 text-[13vw] leading-[0.88] tracking-tight sm:inset-x-10 sm:text-[min(7.5vw,13svh)]">
        <span className="mask block">
          <span className="inline-block">Beyond</span>
        </span>
        <span className="mask block">
          <span className="inline-block font-poem italic text-dune">the album.</span>
        </span>
      </h2>

      <div className="absolute inset-0 top-[22svh] sm:top-[28svh]" style={{ perspective: '1400px' }}>
        {BEYOND_FRAMES.map((f) => (
          <a
            key={f.label}
            href={f.href}
            target="_blank"
            rel="noreferrer"
            data-frame
            data-cursor="Open"
            className="absolute left-1/2 top-1/2 block h-[40vw] w-[29vw] sm:h-[50svh] sm:w-[35svh]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="block h-full w-full overflow-hidden">
              <img src={thumb(f.image)} alt={f.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
            </span>
            <span data-s-label className="absolute -bottom-8 left-0 flex w-full justify-between whitespace-nowrap text-xs sm:-bottom-9 sm:text-sm">
              <span>{f.label}</span>
              <span className="text-dune">↗</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
