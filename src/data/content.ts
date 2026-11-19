// Everything here comes from @lifetouch_photography_shillong — captions, dates and like counts are
// real. Couples' names are deliberately left out of the demo.
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const img = (id: string) => asset(`img/${id}.webp`);
export const thumb = (id: string) => asset(`img/t/${id}.webp`);

export const IG = 'https://www.instagram.com/lifetouch_photography_shillong/';
export const IG_DM = 'https://ig.me/m/lifetouch_photography_shillong';
export const REELS = 'https://www.instagram.com/lifetouch_photography_shillong/reels/';
export const THREADS = 'https://www.threads.com/@lifetouch_photography_shillong';
export const IMPRINT = 'https://www.instagram.com/imprint_studio_shillong/';
export const PHONE = 'tel:+917005201031';
export const PHONE_LABEL = '+91 70052 01031';

export const HERO_IMAGE = 'DX4tztVE3Tn_01';

export const LOADER_FRAMES = [
  'DYBu7cRoPOG_03', 'DaFDQVUoAhK_12', 'DXD-1V3k4_l_18', 'DWqSLmCEzOC_08', 'DbnNz63IEqd_11',
  'DJMHcruT_aK_15', 'DaFDQVUoAhK_10', 'DX4tztVE3Tn_10', HERO_IMAGE,
];

export const MANIFESTO =
  "Preserving life's finest moments: elegant, timeless, authentic. Every glance tells a story, and every touch is worth keeping.";

export type Chapter = {
  title: string;
  date: string;
  likes: string;
  line: string;
  images: [string, string, string];
  href: string;
};

const post = (id: string) => `https://www.instagram.com/lifetouch_photography_shillong/p/${id}/`;

export const CHAPTERS: Chapter[] = [
  {
    title: 'By the lake',
    date: 'May 2026',
    likes: '2,560',
    line: 'Two hearts, one journey, and countless memories being made on the most beautiful day together.',
    images: ['DYBu7cRoPOG_03', 'DYBu7cRoPOG_08', 'DYBu7cRoPOG_06'],
    href: post('DYBu7cRoPOG'),
  },
  {
    title: 'Above the mist',
    date: 'May 2026',
    likes: '889',
    line: 'The sunset sets the scene, but their love tells the story.',
    images: ['DX4tztVE3Tn_10', 'DX4tztVE3Tn_03', 'DX4tztVE3Tn_12'],
    href: post('DX4tztVE3Tn'),
  },
  {
    title: 'On the plateau',
    date: 'April 2026',
    likes: '836',
    line: 'Every smile, every glance, every memory we create becomes a reminder that this life with you is my greatest blessing.',
    images: ['DXD-1V3k4_l_18', 'DXD-1V3k4_l_06', 'DXD-1V3k4_l_02'],
    href: post('DXD-1V3k4_l'),
  },
  {
    title: 'Among the pines',
    date: 'June 2026',
    likes: '1,543',
    line: 'The celebration ends, but the magic of forever never does.',
    images: ['DaFDQVUoAhK_12', 'DaFDQVUoAhK_02', 'DaFDQVUoAhK_14'],
    href: post('DaFDQVUoAhK'),
  },
  {
    title: 'White rooms',
    date: 'April 2026',
    likes: '553',
    line: 'A reunion of hearts, witnessed by love and blessed by time.',
    images: ['DWqSLmCEzOC_08', 'DWqSLmCEzOC_12', 'DWqSLmCEzOC_13'],
    href: post('DWqSLmCEzOC'),
  },
  {
    title: 'Candlelight',
    date: 'August 2026',
    likes: '445',
    line: 'This is where love begins.',
    images: ['DbnNz63IEqd_11', 'DbnNz63IEqd_07', 'DbnNz63IEqd_08'],
    href: post('DbnNz63IEqd'),
  },
];

export const TUNNEL = [
  'DYBu7cRoPOG_18', 'DX4tztVE3Tn_14', 'DWqSLmCEzOC_14', 'DJMHcruT_aK_03', 'DbnNz63IEqd_13', 'DJMHcruT_aK_12', 'DX4tztVE3Tn_07',
  'Da261m2IFYQ_12', 'DWqSLmCEzOC_19', 'DJMHcruT_aK_15', 'DJMHcruT_aK_17', 'DJMHcruT_aK_13', 'Da261m2IFYQ_15', 'DYBu7cRoPOG_11',
];

export const TUNNEL_LINES = ['Every glance', 'every promise', 'every touch', 'kept for life'];

export const QUIET = [
  'DX4tztVE3Tn_03', 'DWqSLmCEzOC_12', 'DXD-1V3k4_l_02', 'DaFDQVUoAhK_02', 'Da261m2IFYQ_15',
  'DbnNz63IEqd_08', 'DX4tztVE3Tn_07', 'DYBu7cRoPOG_08', 'DXD-1V3k4_l_06',
];

// The caption of one of the studio's albums, August 2026
export const QUIET_POEM = [
  'Every glance tells a story,',
  'every touch echoes a lifetime,',
  'and every heartbeat whispers,',
  '“This is where love begins.”',
];

export const STATS = [
  { value: 8.6, suffix: 'K', decimals: 1, label: 'People following the studio' },
  { value: 442, suffix: '', decimals: 0, label: 'Posts on Instagram' },
  { value: 14, suffix: 'K', decimals: 0, label: 'Hearts on a single wedding album' },
];

export const SESSIONS = [
  { name: 'Weddings', note: 'From getting ready to the last dance', image: 'DYBu7cRoPOG_06' },
  { name: 'Engagements', note: 'The yes, and the families around it', image: 'Da261m2IFYQ_12' },
  { name: 'Post-wedding', note: 'A slower day among the pines', image: 'DaFDQVUoAhK_10' },
  { name: 'Receptions & events', note: 'Candlelight, toasts and the dance floor', image: 'DbnNz63IEqd_13' },
];

export const BEYOND_FRAMES = [
  { label: 'Reels', image: 'DX4tztVE3Tn_14', href: REELS },
  { label: 'Threads', image: 'DJMHcruT_aK_12', href: THREADS },
  { label: 'Films by Imprint', image: 'DWqSLmCEzOC_13', href: IMPRINT },
];
