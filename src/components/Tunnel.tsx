import { useRef } from 'react';
import { curtain, gsap, useGSAP } from '../lib/motion';
import { TUNNEL, TUNNEL_LINES, img, thumb } from '../data/content';

const GAP = 520; // depth between frames, px
const NEAR = 600; // frames fade as they reach the lens

/**
 * A 3D tunnel: frames spiral down a helix and the camera flies through them on scroll.
 * The final frame sits dead centre and swallows the screen, opening into the next scene.
 */
export default function Tunnel() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const items = q('[data-t-item]') as HTMLElement[];
      const shades = q('[data-t-shade]');
      const lines = q('[data-t-line]');
      const last = items.length - 1;
      const depth = last * GAP;
      const pointer = { x: 0, y: 0 };
      const cam = { x: 0, y: 0 };
      const hidden = items.map(() => false);

      const render = (p: number) => {
        const camZ = p * (depth + NEAR * 0.9);
        const radius = Math.min(innerWidth, 1400) * (innerWidth < 640 ? 0.32 : 0.36);
        cam.x += (pointer.x - cam.x) * 0.08;
        cam.y += (pointer.y - cam.y) * 0.08;

        items.forEach((el, i) => {
          const z = -i * GAP + camZ;
          const isLast = i === last;
          const angle = i * 0.95 + p * 2.2;
          const r = isLast ? 0 : radius * (1 - Math.max(0, z) / 2400);
          // the last frame lets go of the pointer as it fills the screen, so no edge ever shows
          const follow = isLast ? 1 - gsap.utils.clamp(0, 1, (p - 0.8) / 0.15) : 1;
          const x = Math.cos(angle) * r - cam.x * (1 + i * 0.02) * follow;
          const y = Math.sin(angle) * r * 0.62 - cam.y * (1 + i * 0.02) * follow;
          const far = gsap.utils.clamp(0, 1, 1 + z / 4200);
          const near = isLast ? 1 : gsap.utils.clamp(0, 1, (NEAR - z) / 260);
          // frames behind the lens or beyond the fog cost nothing until they come back
          const alpha = far * near;
          if (!alpha && hidden[i]) return;
          hidden[i] = !alpha;
          gsap.set(el, {
            x,
            y,
            z,
            rotateZ: isLast ? 0 : Math.cos(angle) * 6,
            rotateY: isLast ? 0 : -Math.cos(angle) * 18,
            autoAlpha: alpha,
          });
          gsap.set(shades[i], { opacity: (1 - far) * 0.75 });
        });

        const seg = 0.35 + p * (TUNNEL_LINES.length - 0.35) * 1.02;
        lines.forEach((l, i) => {
          const local = seg - i;
          const a = local < 0 || local > 1 ? 0 : Math.sin(local * Math.PI);
          gsap.set(l, { autoAlpha: a, scale: 0.9 + local * 0.2 });
        });
      };

      gsap.set(items, { xPercent: -50, yPercent: -50, force3D: true });
      curtain(root.current, 'top top');
      render(0);

      const st = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${items.length * 22}%`,
          pin: true,
          scrub: true,
        },
      });
      const prog = { p: 0 };
      // a short hold so the last frame finishes filling the screen before the pin lets go
      st.to(prog, { p: 1, ease: 'none' }).to({}, { duration: 0.12 });

      const onMove = (e: PointerEvent) => {
        pointer.x = (e.clientX / innerWidth - 0.5) * 120;
        pointer.y = (e.clientY / innerHeight - 0.5) * 80;
      };
      // redraw only when the scroll moved, or the pointer parallax is still settling inside the pin
      let drawn = -1;
      const drift = () => {
        const settling = Math.abs(pointer.x - cam.x) + Math.abs(pointer.y - cam.y) > 0.5;
        if (prog.p === drawn && !(settling && st.scrollTrigger?.isActive)) return;
        drawn = prog.p;
        render(prog.p);
      };
      window.addEventListener('pointermove', onMove);
      gsap.ticker.add(drift);
      return () => {
        window.removeEventListener('pointermove', onMove);
        gsap.ticker.remove(drift);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="gallery" className="relative h-[100lvh] overflow-hidden bg-pine text-mist">
      <div className="tunnel-glow pointer-events-none absolute inset-0" />
      <div className="absolute inset-0" style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}>
        <div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: 'preserve-3d' }}>
          {TUNNEL.map((id, i) => {
            const isLast = i === TUNNEL.length - 1;
            return (
              <div
                key={id}
                data-t-item
                className={`absolute left-0 top-0 overflow-hidden will-change-transform ${
                  isLast ? 'h-[72svh] w-[52svh] sm:h-[max(26.25vw,40svh)] sm:w-[max(42vw,64svh)]' : 'h-[34svh] w-[25svh] sm:h-[40svh] sm:w-[30svh]'
                }`}
              >
                <img src={isLast ? img(id) : thumb(id)} alt="" className={`h-full w-full object-cover ${isLast ? 'object-[50%_30%]' : ''}`} loading="lazy" decoding="async" />
                <div data-t-shade className="absolute inset-0 bg-pine" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        {TUNNEL_LINES.map((line) => (
          <p key={line} data-t-line className="invisible absolute text-center font-poem text-[13vw] italic leading-none text-mist sm:text-[8vw]" style={{ textShadow: '0 4px 30px rgba(21,27,23,.9), 0 0 80px rgba(21,27,23,.7)' }}>
            {line}
          </p>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-40 bg-gradient-to-b from-pine/90 to-transparent" />
      <div className="absolute inset-x-6 top-20 z-30 flex justify-between text-xs uppercase [text-shadow:0_1px_12px_rgba(21,27,23,.9)] tracking-[0.2em] sm:inset-x-10">
        <span>(03) — The archive</span>
        <span className="hidden sm:inline">{TUNNEL.length} frames deep</span>
      </div>
    </section>
  );
}
