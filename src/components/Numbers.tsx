import { useRef } from 'react';
import { curtain, gsap, ScrollTrigger, useGSAP, scrollVelocity } from '../lib/motion';
import { STATS, SESSIONS } from '../data/content';

const ROW_A = SESSIONS.map((s) => s.name);
const ROW_B = ['Life’s finest moments', 'Elegant', 'Timeless', 'Authentic'];

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const content = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap py-2">
      <div data-row data-reverse={reverse || undefined} className="flex w-max">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {content.map((t, i) => (
              <span key={i} className="flex items-center text-[12vw] leading-none tracking-tight sm:text-[8vw]">
                <span className={i % 2 ? 'font-poem italic text-dune' : ''}>{t}</span>
                <span className="mx-[3vw] inline-block h-[0.5em] w-[0.5em] rotate-45 border border-mist/40" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Real numbers from the studio's profile, counting up, over two marquees whose speed follows the scroll. */
export default function Numbers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      curtain(root.current);

      q('[data-stat]').forEach((el, i) => {
        const node = el as HTMLElement;
        const target = Number(node.dataset.value);
        const decimals = Number(node.dataset.decimals);
        const out = node.querySelector('[data-out]') as HTMLElement;
        const obj = { v: 0 };
        // counts are tied to the scrollbar: scroll back and the numbers run back down
        gsap
          .timeline({ scrollTrigger: { trigger: node, start: 'top 95%', end: 'top 60%', scrub: 1 } })
          .fromTo(node, { yPercent: 60 + i * 25, rotateX: -65, autoAlpha: 0 }, { yPercent: 0, rotateX: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.5 })
          .to(obj, { v: target, ease: 'power1.out', duration: 1, onUpdate: () => { out.textContent = obj.v.toFixed(decimals); } }, 0)
          .fromTo(node.querySelector('[data-rule]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 0.8 }, 0.1);
      });

      const rows = q('[data-row]').map((el) => ({
        el,
        dir: (el as HTMLElement).dataset.reverse ? 1 : -1,
        pos: 0,
        set: gsap.quickSetter(el, 'xPercent'),
      }));
      const wrap = gsap.utils.wrap(-50, 0);
      let heading = 1;
      let lean = 0;
      const skew = gsap.quickSetter(q('[data-row]'), 'skewX', 'deg');
      let speed = 1;

      let visible = false;
      ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onToggle: (self) => (visible = self.isActive) });

      // scroll speed pushes the marquees; scrolling up flips them
      const onTick = (_t: number, dt: number) => {
        if (!visible) return;
        const v = scrollVelocity();
        if (Math.abs(v) > 0.3) heading = v < 0 ? -1 : 1;
        speed += (1 + Math.min(Math.abs(v) * 0.4, 14) - speed) * 0.08;
        rows.forEach((r) => {
          r.pos = wrap(r.pos + r.dir * heading * speed * dt * 0.0022);
          r.set(r.pos);
        });
        lean += (gsap.utils.clamp(-18, 18, v * -0.9) - lean) * 0.1;
        skew(lean);
      };
      gsap.ticker.add(onTick);

      gsap.fromTo(q('[data-marquees]'), { rotate: -4 }, { rotate: 2, ease: 'none', scrollTrigger: { trigger: q('[data-marquees]')[0], start: 'top bottom', end: 'bottom top', scrub: true } });

      return () => gsap.ticker.remove(onTick);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="numbers" className="relative overflow-hidden bg-fern py-28 text-mist sm:py-40">
      <div className="px-6 sm:px-10">
        <p className="text-xs uppercase tracking-[0.2em]">(05) — In numbers</p>
        <div className="mt-14 grid gap-14 sm:grid-cols-3 sm:gap-10" style={{ perspective: '800px' }}>
          {STATS.map((s) => (
            <div key={s.label} data-stat data-value={s.value} data-decimals={s.decimals}>
              <p className="text-[22vw] leading-none tracking-tight tabular-nums sm:text-[9vw]">
                <span data-out>0</span>
                <span className="text-dune">{s.suffix}</span>
              </p>
              <div data-rule className="mt-4 h-px origin-left bg-mist/30" />
              <p className="mt-4 text-sm text-mist/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div data-marquees className="mt-28 -mx-[5vw] sm:mt-40">
        <MarqueeRow items={ROW_A} />
        <MarqueeRow items={ROW_B} reverse />
      </div>
    </section>
  );
}
