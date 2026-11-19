import { useRef } from 'react';
import { curtain, gsap, useGSAP } from '../lib/motion';
import { QUIET, QUIET_POEM, thumb } from '../data/content';
import SplitChars from './SplitChars';

/** Close moments on a rotating 3D ring, with the lines from one of the studio's albums developing one by one. */
export default function Quiet() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const ring = q('[data-ring]')[0] as HTMLElement;
      const items = q('[data-w-item]') as HTMLElement[];
      const shades = q('[data-w-shade]');
      const n = items.length;
      const state = { rot: 0, tiltX: -8, tiltY: 0 };
      curtain(root.current, 'top top');

      const layout = () => {
        const w = items[0].offsetWidth;
        const radius = (w / 2 / Math.tan(Math.PI / n)) * 1.25;
        // rotate first, then push out along the new Z — GSAP's transform order can't express this, so write it directly
        items.forEach((el, i) => {
          el.style.transform = `translate(-50%, -50%) rotateY(${(360 / n) * i}deg) translateZ(${radius}px)`;
        });
        return radius;
      };
      let radius = layout();
      let painted = '';

      const paint = () => {
        const key = `${state.rot}|${state.tiltX}|${state.tiltY}`;
        if (key === painted) return;
        painted = key;
        ring.style.transform = `translateZ(${-radius * 0.6}px) rotateX(${state.tiltX}deg) rotateY(${state.rot + state.tiltY}deg)`;
        items.forEach((_, i) => {
          const a = ((((360 / n) * i + state.rot + state.tiltY) % 360) + 360) % 360;
          const facing = Math.cos((a * Math.PI) / 180); // 1 = facing the viewer
          gsap.set(shades[i], { opacity: gsap.utils.clamp(0, 0.85, 0.55 - facing * 0.6) });
        });
      };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 1,
          onRefresh: () => {
            radius = layout();
            painted = '';
          },
        },
      });

      tl.fromTo(ring.parentElement, { scale: 0.8, autoAlpha: 0.35 }, { scale: 1, autoAlpha: 1, duration: 0.14, ease: 'power2.out' }, 0)
        .to(state, { rot: -360 - 360 / n, duration: 1 }, 0)
        .fromTo(q('[data-w-title] [data-c]'), { yPercent: 150 }, { yPercent: 0, stagger: 0.01, duration: 0.12, ease: 'power3.out' }, 0.02)
        .to(q('[data-w-title]'), { autoAlpha: 0, scale: 1.3, duration: 0.1 }, 0.3)
        .fromTo(q('[data-glow]'), { scale: 0.6, autoAlpha: 0.2 }, { scale: 1.4, autoAlpha: 1, duration: 0.6 }, 0.1);

      q('[data-poem]').forEach((line, i) => {
        tl.fromTo(line, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.38 + i * 0.12);
      });
      tl.to(q('[data-poem]'), { autoAlpha: 0.25, duration: 0.08 }, 0.9);

      const onMove = (e: PointerEvent) => {
        if (!tl.scrollTrigger?.isActive) return;
        gsap.to(state, { tiltX: -8 + (e.clientY / innerHeight - 0.5) * -14, tiltY: (e.clientX / innerWidth - 0.5) * 24, duration: 1.2, ease: 'power3.out' });
      };
      window.addEventListener('pointermove', onMove);
      gsap.ticker.add(paint);
      return () => {
        window.removeEventListener('pointermove', onMove);
        gsap.ticker.remove(paint);
      };
    },
    { scope: root },
  );

  const title = 'Every touch';

  return (
    <section ref={root} id="quiet" className="relative h-[100lvh] overflow-hidden bg-pine text-mist">
      <div data-glow className="quiet-glow pointer-events-none absolute left-1/2 top-1/2 h-[90vmax] w-[90vmax] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1600px' }}>
        <div className="relative h-0 w-0" style={{ transformStyle: 'preserve-3d' }}>
          <div data-ring className="absolute left-0 top-0" style={{ transformStyle: 'preserve-3d' }}>
            {QUIET.map((id) => (
              <div key={id} data-w-item className="absolute left-0 top-0 h-[38svh] w-[26svh] overflow-hidden sm:h-[48svh] sm:w-[33svh]">
                <img src={thumb(id)} alt="A close wedding-day moment" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                <div data-w-shade className="absolute inset-0 bg-pine" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 data-w-title className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-center text-[14vw] leading-none tracking-tight sm:text-[10vw]">
        <span className="block w-full px-6 text-center" style={{ textShadow: '0 4px 30px rgba(21,27,23,.9), 0 0 80px rgba(21,27,23,.7)' }}>
          <SplitChars text={title} attr="data-c" />
        </span>
      </h2>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55svh] bg-gradient-to-t from-pine via-pine/75 to-transparent" />
      <div className="pointer-events-none absolute inset-x-6 bottom-[calc(100lvh-100svh+2.5rem)] z-20 sm:inset-x-10 sm:bottom-[calc(100lvh-100svh+3.5rem)]">
        {QUIET_POEM.map((line) => (
          <p key={line} data-poem className="invisible font-poem text-2xl italic leading-tight text-mist sm:text-4xl">
            {line}
          </p>
        ))}
      </div>

      <div className="absolute inset-x-6 top-20 z-20 flex justify-between text-xs uppercase tracking-[0.2em] sm:inset-x-10">
        <span>(04) — By touch</span>
        <span className="hidden text-dune sm:inline">From an album, August 2026</span>
      </div>
    </section>
  );
}
