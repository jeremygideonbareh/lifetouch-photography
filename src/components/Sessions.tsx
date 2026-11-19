import { useRef, useState } from 'react';
import { curtain, gsap, ScrollTrigger, useGSAP } from '../lib/motion';
import { SESSIONS, IG_DM, thumb } from '../data/content';

/** Session types as a big index; a photo floats after the cursor and leans into its motion in 3D. */
export default function Sessions() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const hide = () => {
    setActive(null);
    const floater = root.current?.querySelector('[data-floater]');
    if (floater) gsap.to(floater, { scale: 0, autoAlpha: 0, duration: 0.4, ease: 'expo.out' });
  };

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q('[data-floater]'), { xPercent: -50, yPercent: -50, scale: 0, transformPerspective: 800 });

      q('[data-row]').forEach((row) => {
        const r = gsap.utils.selector(row);
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 96%', end: 'top 78%', scrub: 1 } })
          .from(r('[data-line]'), { scaleX: 0, ease: 'none' })
          .from(r('[data-name]'), { yPercent: 150, rotateX: -60, ease: 'none' }, 0)
          .from(r('[data-meta]'), { autoAlpha: 0, x: 40, ease: 'none' }, 0.2);
      });

      // the mist sheet unrolls over the fern section above instead of cutting to it
      curtain(root.current);
      // drop the hover image whenever the list leaves the screen (scrolling with a still mouse)
      ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onLeave: () => hide(), onLeaveBack: () => hide() });

      gsap.from(q('[data-heading] [data-h]'), {
        yPercent: 150,
        stagger: 0.08,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: q('[data-heading]')[0], start: 'top 80%' },
      });
    },
    { scope: root },
  );

  const follow = useRef({ x: 0, y: 0, lastX: 0 });
  const onMove = contextSafe((e: React.PointerEvent) => {
    const floater = root.current?.querySelector('[data-floater]');
    if (!floater) return;
    const dx = e.clientX - follow.current.lastX;
    follow.current.lastX = e.clientX;
    gsap.to(floater, {
      x: e.clientX + 140,
      y: e.clientY,
      rotateY: gsap.utils.clamp(-35, 35, dx * 1.6),
      rotateZ: gsap.utils.clamp(-10, 10, dx * 0.4),
      duration: 0.9,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  });

  const show = contextSafe((i: number | null) => {
    setActive(i);
    const floater = root.current?.querySelector('[data-floater]');
    if (floater) gsap.to(floater, { scale: i === null ? 0 : 1, autoAlpha: i === null ? 0 : 1, duration: 0.6, ease: 'expo.out' });
  });

  return (
    <section
      ref={root}
      id="sessions"
      className="relative bg-mist px-6 py-28 text-pine sm:px-10 sm:py-40"
      onPointerMove={onMove}
      onPointerLeave={() => show(null)}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sage">(06) — Services</p>
          <h2 data-heading className="mt-6 text-[14vw] leading-[0.9] tracking-tight sm:text-[8vw]">
            <span className="mask block">
              <span data-h className="inline-block">Which day</span>
            </span>
            <span className="mask block">
              <span data-h className="inline-block font-poem italic text-sage">is yours?</span>
            </span>
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-pine/70">
          Tell us your date and your church or venue. Message or call the studio to reserve it.
        </p>
      </div>

      <ul className="mt-20 sm:mt-28" style={{ perspective: '900px' }}>
        {SESSIONS.map((s, i) => (
          <li key={s.name} data-row>
            <a
              href={IG_DM}
              target="_blank"
              rel="noreferrer"
              data-cursor="Book"
              onPointerEnter={() => show(i)}
              className="group relative flex items-center justify-between gap-4 py-6 sm:py-8"
            >
              <span data-line className="absolute inset-x-0 top-0 h-px origin-left bg-pine/25" />
              <span className="flex items-baseline gap-4 transition-transform duration-500 group-hover:translate-x-4 sm:gap-8">
                <span className="text-xs tabular-nums text-sage">{String(i + 1).padStart(2, '0')}</span>
                <span className="mask">
                <span
                  data-name
                  className={`inline-block origin-bottom text-[10vw] leading-none tracking-tight transition-colors duration-500 sm:text-[6vw] ${
                    active !== null && active !== i ? 'text-pine/25' : ''
                  }`}
                >
                  {s.name}
                </span>
                </span>
              </span>
              <span data-meta className="hidden text-right text-sm text-pine/70 sm:block">
                {s.note}
                <span className="ml-4 inline-block transition-transform duration-500 group-hover:-rotate-45">→</span>
              </span>
              <img src={thumb(s.image)} alt="" loading="lazy" className="h-20 w-16 shrink-0 object-cover sm:hidden" />
            </a>
          </li>
        ))}
      </ul>

      <div
        data-floater
        className="pointer-events-none invisible fixed left-0 top-0 z-40 hidden h-[44vh] w-[32vh] overflow-hidden sm:block"
      >
        {SESSIONS.map((s, i) => (
          <img
            key={s.name}
            src={thumb(s.image)}
            alt=""
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ${
              active === i ? 'scale-100 opacity-100' : 'scale-125 opacity-0'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
