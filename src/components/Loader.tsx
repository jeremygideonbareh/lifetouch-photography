import { useRef } from 'react';
import { gsap, useGSAP, motionOff } from '../lib/motion';
import { LOADER_FRAMES, img, thumb } from '../data/content';

const preload = (src: string) =>
  new Promise<void>((resolve) => {
    const i = new Image();
    i.onload = i.onerror = () => resolve();
    i.src = src;
  });

/**
 * A camera viewfinder: the studio's frames flicker through the lens while the counter racks focus,
 * then the shutter fires and the frame opens into the hero.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const frames = q('[data-frame]');
      const counter = { v: 0 };
      const countEl = q('[data-count]')[0] as HTMLElement;
      const reduced = motionOff();

      // a second visit in the same session gets a short count instead of the full ceremony
      const seen = (() => {
        try {
          return sessionStorage.getItem('lifetouch-seen') === '1';
        } catch {
          return false;
        }
      })();

      let loaded = 0;
      // only the hero photo has to be ready, and even that gives up after 2.5s on a slow connection
      const assets = [img(LOADER_FRAMES[LOADER_FRAMES.length - 1])];
      const ready = Promise.race([
        preload(assets[0]).then(() => loaded++),
        new Promise<void>((resolve) => setTimeout(() => ((loaded = assets.length), resolve()), 2500)),
      ]);

      gsap.set(frames, { autoAlpha: 0 });
      gsap.set(frames[0], { autoAlpha: 1 });

      // The lens is a full-screen layer clipped down to the viewfinder rectangle
      const box = (q('[data-box]')[0] as HTMLElement).getBoundingClientRect();
      const lensInset = () =>
        `inset(${box.top}px ${innerWidth - box.right}px ${innerHeight - box.bottom}px ${box.left}px)`;
      // (the final close-up below appends a radius so it can tween into the arch's rounded inset)
      const closedInset = `inset(${box.top + box.height / 2}px ${innerWidth / 2}px ${innerHeight - box.top - box.height / 2}px ${innerWidth / 2}px)`;

      const intro = gsap.timeline();
      intro
        .from(q('[data-corner]'), { scale: 1.6, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 })
        .fromTo(q('[data-lens]'), { clipPath: closedInset }, { clipPath: lensInset(), duration: 1, ease: 'expo.inOut' }, 0.1)
        .from(q('[data-meta]'), { yPercent: 120, duration: 0.8, ease: 'expo.out', stagger: 0.05 }, 0.3)
        .from(q('[data-focus]'), { rotate: -120, autoAlpha: 0, duration: 1.4, ease: 'expo.out' }, 0.2);

      // Flicker through the frames like a burst of shutter clicks
      let idx = 0;
      const flicker = gsap.to({}, {
        duration: 0.16,
        repeat: -1,
        onRepeat: () => {
          gsap.set(frames[idx], { autoAlpha: 0 });
          idx = (idx + 1) % frames.length;
          gsap.set(frames[idx], { autoAlpha: 1, scale: 1.12 });
          gsap.to(frames[idx], { scale: 1, duration: 0.5, ease: 'power3.out' });
        },
      });

      const count = gsap.to(counter, {
        v: 100,
        duration: reduced || seen ? 0.25 : 1.1,
        ease: 'power2.inOut',
        onUpdate: () => {
          // never run ahead of the real downloads
          const cap = 12 + (loaded / assets.length) * 88;
          countEl.textContent = String(Math.round(Math.min(counter.v, cap))).padStart(3, '0');
        },
      });

      Promise.all([ready, count.then()]).then(() => {
        countEl.textContent = '100';
        flicker.kill();
        const lastFrame = frames[frames.length - 1];
        gsap.set(frames, { autoAlpha: 0 });
        gsap.set(lastFrame, { autoAlpha: 1 });

        try {
          sessionStorage.setItem('lifetouch-seen', '1');
        } catch {
          // storage blocked: the full loader simply plays again next time
        }

        // the lens closes onto the hero's arch, wearing the hero photo's exact crop and transform,
        // so when the loader fades the picture is already standing where the page has it
        const arch = document.querySelector<HTMLElement>('[data-hero-arch]');
        const heroImg = document.querySelector<HTMLElement>('[data-hero-frame-img]');
        const archInset = () => {
          if (!arch) return 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)';
          const { offsetTop: t, offsetLeft: l, offsetWidth: w, offsetHeight: h } = arch;
          return `inset(${t}px ${innerWidth - l - w}px ${innerHeight - t - h}px ${l}px round ${w / 2}px ${w / 2}px 0px 0px)`;
        };
        if (heroImg) gsap.set(lastFrame, { transform: getComputedStyle(heroImg).transform, transformOrigin: getComputedStyle(heroImg).transformOrigin });

        gsap
          .timeline({ onComplete: onDone })
          // shutter: blades snap shut, flash, then the lens settles into the arch
          .to(q('[data-blade]'), { scaleY: 1, duration: 0.28, ease: 'power4.in', stagger: 0.02 })
          .set(q('[data-flash]'), { autoAlpha: 0.9 })
          .to(q('[data-flash]'), { autoAlpha: 0, duration: 0.5, ease: 'power2.out' })
          .to(q('[data-blade]'), { scaleY: 0, duration: 0.4, ease: 'power3.out', stagger: 0.02 }, '<')
          .to(q('[data-meta], [data-corner], [data-focus]'), { autoAlpha: 0, duration: 0.3 }, '<')
          .to(q('[data-lens-shade]'), { autoAlpha: 0, duration: 0.4 }, '<')
          .fromTo(q('[data-lens]'), { clipPath: () => `${lensInset()} round 0px 0px 0px 0px` }, { clipPath: archInset, duration: 1.1, ease: 'expo.inOut' }, '<0.1')
          // the hero's name, header and buttons enter around the photo while it settles
          .call(() => document.documentElement.classList.remove('is-loading'), [], '<0.35')
          .to(q('[data-paper]'), { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, '<')
          .to(root.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden text-pine">
      {/* the paper is its own layer so it can lift while the photo settles, revealing the hero around it */}
      <div data-paper className="hero-bg absolute inset-0" />
      <div className="absolute left-6 top-6 overflow-hidden text-lg tracking-wide sm:left-10 sm:top-8">
        <p data-meta className="font-poem text-2xl italic">Lifetouch</p>
      </div>
      <div className="absolute right-6 top-6 flex items-center gap-2 overflow-hidden text-xs uppercase tracking-[0.2em] sm:right-10 sm:top-8">
        <p data-meta className="flex items-center gap-2">
          <span className="rec-dot inline-block h-2 w-2 rounded-full bg-dune" />
          Rec
        </p>
      </div>

      <div data-lens className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(50% 50% 50% 50%)' }}>
        {LOADER_FRAMES.map((id, i) => (
          i === LOADER_FRAMES.length - 1 ? (
            <img key={id} data-frame src={img(id)} alt="" className="hero-photo absolute left-0 top-0" />
          ) : (
            <img key={id} data-frame src={thumb(id)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )
        ))}
        <div data-lens-shade className="absolute inset-0 bg-pine/20" />
      </div>

      <div data-box className="pointer-events-none relative flex h-[46svh] w-[34svh] items-center justify-center sm:h-[52svh] sm:w-[39svh]">
        {(['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'left-0 bottom-0 border-l border-b', 'right-0 bottom-0 border-r border-b'] as const).map(
          (pos) => (
            <span key={pos} data-corner className={`absolute h-6 w-6 -m-3 border-pine ${pos}`} />
          ),
        )}
        <svg data-focus className="pointer-events-none absolute h-[70%] w-[70%] opacity-70" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#151b17" strokeWidth="0.4" strokeDasharray="1 3" />
          <path d="M50 44v12M44 50h12" stroke="#151b17" strokeWidth="0.5" />
        </svg>
      </div>

      {/* shutter blades */}
      <div className="pointer-events-none absolute inset-0 flex flex-col">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} data-blade className="w-full flex-1 origin-top bg-pine" style={{ transform: 'scaleY(0)' }} />
        ))}
      </div>
      <div data-flash className="pointer-events-none invisible absolute inset-0 bg-mist opacity-0" />

      <div className="absolute bottom-5 left-6 overflow-hidden text-xs leading-relaxed sm:bottom-8 sm:left-10 sm:text-sm">
        <p data-meta>Preserving life’s finest moments</p>
        <p data-meta className="text-pine/50">ISO 200 · f/1.8 · 1/250</p>
      </div>
      <div className="absolute bottom-3 right-6 overflow-hidden sm:bottom-4 sm:right-10">
        <p data-meta data-count className="text-[18vw] leading-none tabular-nums sm:text-[12vw]">
          000
        </p>
      </div>
    </div>
  );
}
