import { HERO_IMAGE, IG, IG_DM, PHONE, THREADS, img } from '../data/content';

const NAV_LINKS = [
  { label: 'Stories', href: '#stories' },
  { label: 'Services', href: '#sessions' },
  { label: 'Call us', href: PHONE },
];
const SOCIAL_LINKS = [
  { label: 'Instagram', href: IG },
  { label: 'Threads', href: THREADS },
  { label: 'Message', href: IG_DM },
];

const external = (href: string) =>
  href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {};

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

/**
 * A misty photograph seen through an arch, with the name parted around it: "Life" on one side,
 * "touch" on the other. HeroFlow opens the arch to the full picture on scroll.
 */
export default function Hero() {
  return (
    <section className="hero-root relative h-[100lvh] w-full overflow-hidden text-pine">
      <h1 className="sr-only">Lifetouch Photography: wedding and event photography in Shillong</h1>
      <div className="hero-bg absolute inset-0" aria-hidden="true" />

      {/* The name sits behind the arch; GSAP parts the two halves, CSS runs the entrance on the inner spans */}
      <div data-hero-life className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        <span className="hero-word hero-word-life anim-fade-up" style={delay(450)}>
          Life
        </span>
      </div>
      <div data-hero-touch className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        <span className="hero-word hero-word-touch anim-fade-up font-poem italic text-sage" style={delay(600)}>
          touch
        </span>
      </div>

      <div className="absolute inset-0 z-[15]">
        <div data-hero-arch className="hero-arch" aria-hidden="true" />
        <div data-hero-frame className="hero-frame absolute inset-0 overflow-hidden">
          <img data-hero-frame-img src={img(HERO_IMAGE)} alt="A couple embracing on a misty hilltop above the pines" className="hero-photo" />
        </div>
      </div>

      {/* Bottom-anchored copy lives in a small-viewport box so a phone's URL bar never covers it */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[100svh]">
        <p data-hero-fade className="hero-caption anim-fade-up hidden font-poem text-lg italic text-sage sm:block" style={delay(1100)}>
          Elegant · Timeless · Authentic
        </p>

        <div data-hero-fade className="absolute inset-x-6 bottom-[5.5rem] z-10 sm:inset-x-10 sm:bottom-28">
          <div className="anim-line h-px bg-pine/25" style={delay(1200)} />
        </div>

        <footer data-hero-fade className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex items-end justify-between px-6 pb-5 text-xs leading-relaxed sm:px-10 sm:pb-8 sm:text-sm">
          <div className="anim-fade-up" style={delay(1400)}>
            <p>Wedding &amp; event photography</p>
            <p className="text-pine/60">Preserving life’s finest moments</p>
          </div>
          <div className="anim-fade-up flex items-center gap-8" style={delay(1550)}>
            <div className="hidden text-right sm:block">
              <p>8.6K on Instagram</p>
              <a href={IG} {...external(IG)} className="text-pine/60 transition-opacity duration-300 hover:opacity-60">
                @lifetouch_photography_shillong
              </a>
            </div>
            <a href="#contact" className="rounded-full bg-pine px-5 py-3 text-mist transition-colors duration-300 hover:bg-sage">
              Reserve your date
            </a>
          </div>
        </footer>
      </div>

      <header data-hero-fade className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <a href="#top" className="anim-fade-up font-poem text-2xl italic tracking-wide" style={delay(800)}>
          Lifetouch
        </a>

        <div className="hidden items-start gap-16 sm:flex lg:gap-24">
          <span className="anim-fade-up text-sm" style={delay(900)}>
            Shillong, Meghalaya
          </span>
          <nav className="flex flex-col gap-0.5 text-sm">
            {NAV_LINKS.map(({ label, href }, i) => (
              <span key={label} className="anim-fade-up" style={delay(1000 + i * 80)}>
                <a href={href} {...external(href)} className="transition-opacity duration-300 hover:opacity-60">
                  {label}
                </a>
              </span>
            ))}
          </nav>
          <div className="flex flex-col gap-0.5 text-sm">
            {SOCIAL_LINKS.map(({ label, href }, i) => (
              <span key={label} className="anim-fade-up" style={delay(1150 + i * 80)}>
                <a href={href} {...external(href)} className="transition-opacity duration-300 hover:opacity-60">
                  {label}
                </a>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* The menu itself lives in Chrome so it stays reachable after the hero has gone */}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event('open-menu'))}
        aria-label="Open menu"
        data-hero-fade
        className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center sm:hidden"
      >
        <span className="anim-fade-up relative block h-4 w-6" style={delay(900)}>
          <span className="absolute left-0 top-0 h-0.5 w-6 bg-pine" />
          <span className="absolute left-0 top-[7px] h-0.5 w-6 bg-pine" />
          <span className="absolute left-0 top-[14px] h-0.5 w-6 bg-pine" />
        </span>
      </button>
    </section>
  );
}
