import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, getLenis } from '../lib/motion';
import { IG, IG_DM, PHONE, PHONE_LABEL, THREADS } from '../data/content';

const SCENES = [
  { id: 'stories', label: 'Stories' },
  { id: 'gallery', label: 'The archive' },
  { id: 'quiet', label: 'By touch' },
  { id: 'numbers', label: 'In numbers' },
  { id: 'sessions', label: 'Services' },
  { id: 'beyond', label: 'Elsewhere' },
  { id: 'contact', label: 'Contact' },
];

const MENU_LINKS = [
  { label: 'Stories', href: '#stories' },
  { label: 'The archive', href: '#gallery' },
  { label: 'Services', href: '#sessions' },
  { label: 'Contact', href: '#contact' },
];
const MENU_SOCIAL = [
  { label: 'Instagram', href: IG },
  { label: 'Message', href: IG_DM },
  { label: 'Threads', href: THREADS },
];

const DRAWER_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

/** Fixed layer: film grain, a custom cursor, the slim bar that takes over from the hero, and the menu. */
export default function Chrome() {
  const bar = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [scene, setScene] = useState('Opening');
  const [light, setLight] = useState(false);
  const [label, setLabel] = useState('');
  const [mode, setMode] = useState<'dot' | 'ring' | 'label'>('dot');
  const [open, setOpen] = useState(false);

  useGSAP(() => {
    gsap.set(bar.current, { yPercent: -120 });
    // the bar arrives as the hero's own header fades, so there is always a way to navigate
    ScrollTrigger.create({
      start: () => innerHeight * 0.3,
      end: 'max',
      onEnter: () => gsap.to(bar.current, { yPercent: 0, duration: 0.8, ease: 'expo.out' }),
      onLeaveBack: () => gsap.to(bar.current, { yPercent: -120, duration: 0.6, ease: 'expo.in' }),
    });
    const tc = document.querySelector('[data-timecode]');
    // pinned sections move in and out of pin-spacers, so read the scene straight from the layout
    const findScene = () => {
      const mid = innerHeight / 2;
      let current = 'Opening';
      SCENES.forEach((s) => {
        const el = document.getElementById(s.id);
        const box = (el?.closest('.pin-spacer') ?? el)?.getBoundingClientRect();
        if (box && box.top <= mid && box.bottom > mid) current = s.label;
      });
      setScene(current);
      // the bar reads against whatever sits under it: pine type over the hero and the services sheet
      const sheet = document.getElementById('sessions')?.getBoundingClientRect();
      const hero = document.getElementById('top')?.closest('.pin-spacer')?.getBoundingClientRect();
      setLight((!!sheet && sheet.top <= 36 && sheet.bottom > 36) || (!!hero && window.scrollY < innerHeight * 0.45));
    };
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        findScene();
        const frames = Math.round(self.scroll() / 4);
        const s = Math.floor(frames / 24);
        const pad = (n: number) => String(n).padStart(2, '0');
        if (tc) tc.textContent = `${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(frames % 24)}`;
      },
    });
  });

  // the hero's own menu button asks for this drawer
  useEffect(() => {
    const onOpen = () => {
      opener.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    window.addEventListener('open-menu', onOpen);
    return () => window.removeEventListener('open-menu', onOpen);
  }, []);

  useEffect(() => {
    if (drawer.current) drawer.current.inert = !open;
  }, [open]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open === wasOpen.current) return;
    wasOpen.current = open;
    const main = document.querySelector('main');
    if (main) main.inert = open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      getLenis()?.stop();
      drawer.current?.querySelector<HTMLElement>('a, button')?.focus();
    } else {
      getLenis()?.start();
      opener.current?.focus?.();
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const el = cursor.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    let shown = false;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const last = { x: -1, y: -1 };
    const probe = (node: Element | null) => {
      const target = node?.closest<HTMLElement>('a, button, [data-cursor]');
      const text = target?.dataset.cursor ?? '';
      setLabel(text);
      // labelled targets get a solid disc; plain links/buttons (which carry their own text) get a hollow ring
      setMode(text ? 'label' : target ? 'ring' : 'dot');
      gsap.to(el, { scale: text ? 1 : target ? 0.7 : 0.16, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
    };
    const onScroll = () => {
      if (last.x >= 0) probe(document.elementFromPoint(last.x, last.y));
    };
    const move = (e: PointerEvent) => {
      last.x = e.clientX;
      last.y = e.clientY;
      if (!shown) {
        // appear where the pointer is, not sliding in from the corner
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
      probe(e.target as Element);
    };
    const leave = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    opener.current = e.currentTarget;
    setOpen(true);
  };

  const drawerItem = (openDelay: number) => ({
    className: `transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`,
    style: { transitionDelay: open ? `${openDelay}ms` : '0ms', transitionTimingFunction: DRAWER_EASE },
  });

  return (
    <>
      <div className="grain pointer-events-none fixed inset-0 z-[90]" aria-hidden="true" />

      <div
        ref={cursor}
        className={`pointer-events-none fixed left-0 top-0 z-[95] hidden h-20 w-20 items-center justify-center rounded-full text-[11px] uppercase tracking-[0.15em] text-pine transition-colors duration-300 [@media(pointer:fine)]:flex ${
          mode === 'ring' ? 'border border-dune bg-transparent' : 'border border-dune bg-dune'
        }`}
        aria-hidden="true"
      >
        <span className={label ? 'opacity-100' : 'opacity-0'}>{label}</span>
      </div>

      <div ref={bar} className={`fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-6 py-3 transition-colors duration-300 sm:px-10 ${light ? 'text-pine' : 'text-mist'}`}>
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b transition-colors duration-300 ${light ? 'from-mist/90' : 'from-pine/80'} to-transparent`}
          aria-hidden="true"
        />
        <a href="#top" className="font-poem text-2xl italic tracking-wide">
          Lifetouch
        </a>
        <p className="hidden items-center gap-3 text-xs uppercase tracking-[0.2em] lg:flex">
          <span className="rec-dot inline-block h-1.5 w-1.5 rounded-full bg-dune" />
          <span>{scene}</span>
          <span data-timecode className="tabular-nums opacity-60">
            00:00:00
          </span>
        </p>
        <div className="flex items-center gap-2 sm:gap-6">
          <a href={PHONE} className="flex min-h-11 items-center text-sm hover:opacity-60">
            <span className="sm:hidden">Call</span>
            <span className="hidden sm:inline">{PHONE_LABEL}</span>
          </a>
          <button type="button" onClick={openMenu} aria-expanded={open} className="flex min-h-11 items-center px-2 text-sm uppercase tracking-[0.2em] hover:opacity-60">
            Menu
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[70] bg-pine/40 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        ref={drawer}
        className={`fixed inset-y-0 right-0 z-[75] w-[82%] max-w-sm bg-pine px-8 py-10 text-mist transition-transform duration-[600ms] ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ transitionTimingFunction: DRAWER_EASE }}
        aria-hidden={!open}
        aria-label="Site menu"
      >
        <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center">
          <X size={26} strokeWidth={1.5} />
        </button>

        <div className="mt-16">
          <p {...drawerItem(200)}>
            <span className="text-xs uppercase tracking-[0.2em] text-mist/60">Site index</span>
          </p>
          <nav className="mt-4 flex flex-col">
            {MENU_LINKS.map(({ label, href }, i) => {
              const item = drawerItem(260 + i * 70);
              return (
                <a key={label} href={href} onClick={() => setOpen(false)} className={`py-1 font-poem text-4xl ${item.className}`} style={item.style}>
                  {label}
                </a>
              );
            })}
          </nav>
          <p className={`mt-12 ${drawerItem(500).className}`} style={drawerItem(500).style}>
            <span className="text-xs uppercase tracking-[0.2em] text-mist/60">Find us</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-x-6">
            {MENU_SOCIAL.map(({ label, href }, i) => {
              const item = drawerItem(540 + i * 60);
              return (
                <a key={label} href={href} target="_blank" rel="noreferrer" className={`py-2 text-sm ${item.className}`} style={item.style}>
                  {label} ↗
                </a>
              );
            })}
          </div>
          <a href={PHONE} className={`mt-8 inline-flex min-h-12 items-center rounded-full bg-dune px-6 text-sm text-pine ${drawerItem(700).className}`} style={drawerItem(700).style}>
            Call {PHONE_LABEL}
          </a>
        </div>
      </aside>
    </>
  );
}
