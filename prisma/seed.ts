import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

const categories = [
  { name: 'Productivity', slug: 'productivity', icon: '⚡' },
  { name: 'Social', slug: 'social', icon: '💬' },
  { name: 'Games', slug: 'games', icon: '🎮' },
  { name: 'Entertainment', slug: 'entertainment', icon: '🎬' },
  { name: 'Education', slug: 'education', icon: '📚' },
  { name: 'Health & Fitness', slug: 'health-fitness', icon: '💪' },
  { name: 'Finance', slug: 'finance', icon: '💰' },
  { name: 'Photography', slug: 'photography', icon: '📷' },
]

const appData = [
  // Productivity
  {
    name: 'TaskFlow Pro',
    slug: 'taskflow-pro',
    developer: 'Apex Software',
    description:
      'TaskFlow Pro is the ultimate task management app that helps you organize your work life. With smart deadlines, priority matrices, and team collaboration features, you can stay on top of every project. Features include Kanban boards, time tracking, recurring tasks, calendar sync, and detailed analytics to boost your productivity.',
    whatsNew:
      'New AI-powered task suggestions, improved calendar view, and performance improvements.',
    icon: 'https://placehold.co/96x96/3B82F6/FFFFFF?text=TF',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/0F172A/3B82F6?text=TaskFlow+Dashboard',
      'https://placehold.co/1280x720/1E293B/60A5FA?text=Task+Board',
      'https://placehold.co/1280x720/0F172A/93C5FD?text=Analytics',
    ]),
    categorySlug: 'productivity',
    rating: 4.8,
    downloads: 5200000,
    price: 0,
    version: '3.2.1',
    size: '24 MB',
    compatibility: 'iOS 14+, Android 8+',
    featured: true,
  },
  {
    name: 'NoteVault',
    slug: 'notevault',
    developer: 'CloudNote Inc',
    description:
      'NoteVault is a powerful note-taking app with rich text editing, voice notes, and seamless sync across all devices. Organize your thoughts with tags, notebooks, and smart search. Supports markdown, code blocks, and attachments.',
    whatsNew: 'Dark mode improvements, PDF export, and new templates.',
    icon: 'https://placehold.co/96x96/8B5CF6/FFFFFF?text=NV',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/1E293B/8B5CF6?text=NoteVault+Home',
      'https://placehold.co/1280x720/0F172A/A78BFA?text=Note+Editor',
    ]),
    categorySlug: 'productivity',
    rating: 4.6,
    downloads: 3100000,
    price: 0,
    version: '2.8.0',
    size: '18 MB',
    compatibility: 'iOS 13+, Android 7+',
    featured: false,
  },
  {
    name: 'FocusZen',
    slug: 'focuszen',
    developer: 'MindfulTech',
    description:
      'FocusZen uses the Pomodoro technique with ambient sounds and focus tracking to maximize your productivity. Block distracting apps, set goals, and review your focus sessions with detailed insights.',
    whatsNew: 'New ambient sound packs and streak tracking.',
    icon: 'https://placehold.co/96x96/10B981/FFFFFF?text=FZ',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/064E3B/10B981?text=Focus+Timer',
      'https://placehold.co/1280x720/022C22/34D399?text=Stats',
    ]),
    categorySlug: 'productivity',
    rating: 4.7,
    downloads: 1800000,
    price: 2.99,
    version: '1.5.3',
    size: '12 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: false,
  },
  {
    name: 'CalSync',
    slug: 'calsync',
    developer: 'TimeWise Apps',
    description:
      'CalSync is the smart calendar app that unifies all your schedules. Supports Google, Outlook, Apple Calendar and more. Features natural language event creation, smart scheduling, and timezone management.',
    whatsNew: 'New meeting scheduler and team availability view.',
    icon: 'https://placehold.co/96x96/F59E0B/FFFFFF?text=CS',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/451A03/F59E0B?text=Calendar+View',
      'https://placehold.co/1280x720/292524/FBBF24?text=Event+Details',
    ]),
    categorySlug: 'productivity',
    rating: 4.5,
    downloads: 4500000,
    price: 0,
    version: '4.1.0',
    size: '32 MB',
    compatibility: 'iOS 15+, Android 10+',
    featured: true,
  },
  {
    name: 'DocScan AI',
    slug: 'docscan-ai',
    developer: 'ScanTech Corp',
    description:
      'DocScan AI uses advanced OCR and AI to scan, digitize, and organize your documents. Sign PDFs, create multi-page documents, and sync to cloud storage automatically.',
    whatsNew: 'Improved AI text recognition and new e-signature feature.',
    icon: 'https://placehold.co/96x96/EF4444/FFFFFF?text=DS',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/450A0A/EF4444?text=Document+Scanner',
      'https://placehold.co/1280x720/450A0A/FCA5A5?text=PDF+Viewer',
    ]),
    categorySlug: 'productivity',
    rating: 4.4,
    downloads: 2200000,
    price: 0,
    version: '2.3.1',
    size: '55 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },

  // Social
  {
    name: 'CircleUp',
    slug: 'circleup',
    developer: 'Social Sphere Inc',
    description:
      'CircleUp is the next-generation social platform focused on meaningful connections. Create circles for interests, share updates, and discover communities that matter to you. Privacy-first with end-to-end encryption.',
    whatsNew: 'New stories feature and improved discovery algorithm.',
    icon: 'https://placehold.co/96x96/EC4899/FFFFFF?text=CU',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/500724/EC4899?text=CircleUp+Feed',
      'https://placehold.co/1280x720/4A044E/F9A8D4?text=Circle+View',
      'https://placehold.co/1280x720/2D1B69/A78BFA?text=Messages',
    ]),
    categorySlug: 'social',
    rating: 4.3,
    downloads: 12000000,
    price: 0,
    version: '5.0.2',
    size: '78 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: true,
  },
  {
    name: 'Whisper',
    slug: 'whisper',
    developer: 'PrivateChat Labs',
    description:
      'Whisper is a secure messaging app with military-grade encryption, self-destructing messages, and zero data retention. Chat, call, and share files with complete privacy.',
    whatsNew: 'Group calls now support up to 50 participants.',
    icon: 'https://placehold.co/96x96/0EA5E9/FFFFFF?text=W',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/0C4A6E/0EA5E9?text=Chat+Screen',
      'https://placehold.co/1280x720/082F49/38BDF8?text=Settings',
    ]),
    categorySlug: 'social',
    rating: 4.9,
    downloads: 8500000,
    price: 0,
    version: '3.1.0',
    size: '42 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },
  {
    name: 'MomentShare',
    slug: 'momentshare',
    developer: 'Pixels & People',
    description:
      'MomentShare is a photo and video sharing app designed for capturing life as it happens. AI-powered filters, collaborative albums, and private sharing make every moment special.',
    whatsNew: 'New collaborative albums and Reels-style video editor.',
    icon: 'https://placehold.co/96x96/F97316/FFFFFF?text=MS',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/431407/F97316?text=Photo+Feed',
      'https://placehold.co/1280x720/1C0A00/FB923C?text=Camera',
      'https://placehold.co/1280x720/431407/FED7AA?text=Profile',
    ]),
    categorySlug: 'social',
    rating: 4.5,
    downloads: 20000000,
    price: 0,
    version: '8.3.4',
    size: '95 MB',
    compatibility: 'iOS 15+, Android 10+',
    featured: true,
  },
  {
    name: 'Linkd',
    slug: 'linkd',
    developer: 'ProfessionalNet',
    description:
      'Linkd is a professional networking platform for the modern workforce. Showcase your portfolio, connect with industry leaders, find jobs, and grow your professional brand.',
    whatsNew: 'New skills assessment feature and AI resume builder.',
    icon: 'https://placehold.co/96x96/1D4ED8/FFFFFF?text=LK',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/1E3A5F/1D4ED8?text=Network+Feed',
      'https://placehold.co/1280x720/0D2137/3B82F6?text=Job+Board',
    ]),
    categorySlug: 'social',
    rating: 4.2,
    downloads: 15000000,
    price: 0,
    version: '12.1.0',
    size: '110 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: false,
  },

  // Games
  {
    name: 'Pixel Quest',
    slug: 'pixel-quest',
    developer: 'RetroGames Studio',
    description:
      'Pixel Quest is an epic retro-style RPG with stunning pixel art, hundreds of quests, and a massive open world. Build your character, craft items, and battle legendary monsters across 10 unique realms.',
    whatsNew: 'New realm added: The Crystal Caverns. 50+ new quests.',
    icon: 'https://placehold.co/96x96/7C3AED/FFFFFF?text=PQ',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/2E1065/7C3AED?text=Game+World',
      'https://placehold.co/1280x720/1E1B4B/A78BFA?text=Battle+Screen',
      'https://placehold.co/1280x720/1E1B4B/C4B5FD?text=Character+Menu',
    ]),
    categorySlug: 'games',
    rating: 4.9,
    downloads: 7500000,
    price: 0,
    version: '2.5.0',
    size: '450 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: true,
  },
  {
    name: 'Speed Racer X',
    slug: 'speed-racer-x',
    developer: 'Turbo Games',
    description:
      'Speed Racer X delivers console-quality racing on mobile. With photorealistic graphics, 50+ cars, and online multiplayer racing, experience the thrill of speed like never before.',
    whatsNew: 'New track added: Monaco. New car pack available.',
    icon: 'https://placehold.co/96x96/EF4444/FFFFFF?text=SR',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/450A0A/EF4444?text=Race+Track',
      'https://placehold.co/1280x720/7F1D1D/FCA5A5?text=Car+Garage',
    ]),
    categorySlug: 'games',
    rating: 4.6,
    downloads: 4200000,
    price: 0,
    version: '3.8.1',
    size: '1.2 GB',
    compatibility: 'iOS 15+, Android 10+',
    featured: false,
  },
  {
    name: 'Mind Puzzler',
    slug: 'mind-puzzler',
    developer: 'BrainGames Co',
    description:
      'Mind Puzzler offers 1000+ brain-teasing puzzles across 15 categories. Train your logical thinking, memory, and problem-solving skills with daily challenges and competitive leaderboards.',
    whatsNew: '100 new word puzzles added. New daily challenge mode.',
    icon: 'https://placehold.co/96x96/06B6D4/FFFFFF?text=MP',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/083344/06B6D4?text=Puzzle+Grid',
      'https://placehold.co/1280x720/0C4A6E/22D3EE?text=Level+Select',
    ]),
    categorySlug: 'games',
    rating: 4.7,
    downloads: 9000000,
    price: 0,
    version: '6.2.0',
    size: '85 MB',
    compatibility: 'iOS 13+, Android 7+',
    featured: false,
  },
  {
    name: 'Galaxy Warriors',
    slug: 'galaxy-warriors',
    developer: 'Cosmic Studios',
    description:
      'Galaxy Warriors is an epic space strategy game. Build your fleet, conquer planets, and engage in real-time battles with players worldwide. Lead your alliance to galactic domination.',
    whatsNew: 'New alien race added. Season 5 battle pass launched.',
    icon: 'https://placehold.co/96x96/4F46E5/FFFFFF?text=GW',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/1E1B4B/4F46E5?text=Galaxy+Map',
      'https://placehold.co/1280x720/1E1B4B/818CF8?text=Space+Battle',
      'https://placehold.co/1280x720/0F172A/6366F1?text=Fleet+Command',
    ]),
    categorySlug: 'games',
    rating: 4.5,
    downloads: 3800000,
    price: 0,
    version: '4.0.1',
    size: '780 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: true,
  },
  {
    name: 'Wordle Rush',
    slug: 'wordle-rush',
    developer: 'Word Games Inc',
    description:
      'Wordle Rush is the ultimate word game with daily challenges, multiplayer modes, and thousands of words. Compete with friends, earn achievements, and climb the global leaderboard.',
    whatsNew: 'New themed word packs and seasonal events.',
    icon: 'https://placehold.co/96x96/16A34A/FFFFFF?text=WR',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/052E16/16A34A?text=Word+Game',
      'https://placehold.co/1280x720/052E16/4ADE80?text=Leaderboard',
    ]),
    categorySlug: 'games',
    rating: 4.4,
    downloads: 11000000,
    price: 0,
    version: '2.1.5',
    size: '45 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },

  // Entertainment
  {
    name: 'StreamBox',
    slug: 'streambox',
    developer: 'MediaStream Inc',
    description:
      'StreamBox aggregates all your streaming services into one beautiful interface. Discover new content, track what you have watched, and get personalized recommendations powered by AI.',
    whatsNew: 'New parental controls, offline download scheduling, and 4K support.',
    icon: 'https://placehold.co/96x96/DC2626/FFFFFF?text=SB',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/450A0A/DC2626?text=Movie+Library',
      'https://placehold.co/1280x720/7F1D1D/EF4444?text=Watchlist',
      'https://placehold.co/1280x720/450A0A/FCA5A5?text=Player',
    ]),
    categorySlug: 'entertainment',
    rating: 4.6,
    downloads: 25000000,
    price: 0,
    version: '10.4.2',
    size: '65 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: true,
  },
  {
    name: 'PodcastHub',
    slug: 'podcasthub',
    developer: 'Audio World',
    description:
      'PodcastHub is your ultimate podcast companion. Discover millions of shows, create playlists, adjust playback speed, and sync across devices. Smart recommendations learn your taste over time.',
    whatsNew: 'New smart playlists and improved recommendation engine.',
    icon: 'https://placehold.co/96x96/9333EA/FFFFFF?text=PH',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/3B0764/9333EA?text=Podcast+Feed',
      'https://placehold.co/1280x720/3B0764/C084FC?text=Player',
    ]),
    categorySlug: 'entertainment',
    rating: 4.7,
    downloads: 6500000,
    price: 0,
    version: '5.3.0',
    size: '38 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },
  {
    name: 'ComicVerse',
    slug: 'comicverse',
    developer: 'Illustrated Worlds',
    description:
      'ComicVerse brings thousands of comics, manga, and graphic novels to your fingertips. Read in guided view or panel-by-panel mode. New releases daily from top publishers.',
    whatsNew: 'New manga section added with 10,000+ titles.',
    icon: 'https://placehold.co/96x96/F59E0B/FFFFFF?text=CV',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/451A03/F59E0B?text=Comic+Library',
      'https://placehold.co/1280x720/292524/FBBF24?text=Reading+View',
    ]),
    categorySlug: 'entertainment',
    rating: 4.5,
    downloads: 3200000,
    price: 4.99,
    version: '3.7.1',
    size: '55 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },
  {
    name: 'Melody',
    slug: 'melody',
    developer: 'Sonic Labs',
    description:
      'Melody is a lossless music streaming app with the largest catalog of high-quality audio. Dolby Atmos support, lyrics sync, and social listening rooms make it the premium music experience.',
    whatsNew: 'New spatial audio features and artist radio mode.',
    icon: 'https://placehold.co/96x96/0EA5E9/FFFFFF?text=M',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/0C4A6E/0EA5E9?text=Music+Player',
      'https://placehold.co/1280x720/082F49/7DD3FC?text=Library',
      'https://placehold.co/1280x720/0C4A6E/38BDF8?text=Discover',
    ]),
    categorySlug: 'entertainment',
    rating: 4.8,
    downloads: 18000000,
    price: 0,
    version: '9.2.0',
    size: '75 MB',
    compatibility: 'iOS 15+, Android 10+',
    featured: true,
  },

  // Education
  {
    name: 'LearnLingo',
    slug: 'learnlingo',
    developer: 'Language Lab',
    description:
      'LearnLingo uses science-backed methods to help you learn 40+ languages. Daily lessons, speech recognition, story-based learning, and live conversation practice with native speakers.',
    whatsNew: '5 new languages added. Improved pronunciation scoring.',
    icon: 'https://placehold.co/96x96/22C55E/FFFFFF?text=LL',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/052E16/22C55E?text=Language+Lessons',
      'https://placehold.co/1280x720/052E16/86EFAC?text=Progress+Tracker',
      'https://placehold.co/1280x720/14532D/4ADE80?text=Practice',
    ]),
    categorySlug: 'education',
    rating: 4.9,
    downloads: 30000000,
    price: 0,
    version: '7.8.0',
    size: '120 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: true,
  },
  {
    name: 'CodeMaster',
    slug: 'codemaster',
    developer: 'DevAcademy',
    description:
      'CodeMaster teaches you programming through interactive challenges, projects, and mentored paths. Covers Python, JavaScript, Swift, Kotlin, and more. Build real apps as you learn.',
    whatsNew: 'New AI-assisted code review and Rust course added.',
    icon: 'https://placehold.co/96x96/6366F1/FFFFFF?text=CM',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/1E1B4B/6366F1?text=Code+Editor',
      'https://placehold.co/1280x720/1E1B4B/A5B4FC?text=Learning+Path',
    ]),
    categorySlug: 'education',
    rating: 4.8,
    downloads: 4800000,
    price: 0,
    version: '4.2.0',
    size: '95 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: false,
  },
  {
    name: 'MathGenius',
    slug: 'mathgenius',
    developer: 'EduTech Solutions',
    description:
      'MathGenius makes mathematics fun and engaging for all ages. Step-by-step explanations, visual problem solving, and adaptive difficulty ensure every student progresses at their own pace.',
    whatsNew: 'New calculus section and AI tutor improvements.',
    icon: 'https://placehold.co/96x96/EAB308/FFFFFF?text=MG',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/422006/EAB308?text=Math+Problems',
      'https://placehold.co/1280x720/422006/FDE047?text=Practice+Mode',
    ]),
    categorySlug: 'education',
    rating: 4.6,
    downloads: 7200000,
    price: 0,
    version: '3.1.2',
    size: '42 MB',
    compatibility: 'iOS 13+, Android 7+',
    featured: false,
  },
  {
    name: 'QuizKing',
    slug: 'quizking',
    developer: 'Knowledge Games',
    description:
      'QuizKing covers 50+ subjects with thousands of questions. Challenge friends, join live tournaments, and track your knowledge growth. Perfect for students, trivia lovers, and lifelong learners.',
    whatsNew: 'New science trivia pack and live tournament mode.',
    icon: 'https://placehold.co/96x96/F43F5E/FFFFFF?text=QK',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/4C0519/F43F5E?text=Quiz+Game',
      'https://placehold.co/1280x720/4C0519/FDA4AF?text=Tournament',
    ]),
    categorySlug: 'education',
    rating: 4.5,
    downloads: 5600000,
    price: 0,
    version: '2.9.3',
    size: '35 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },
  {
    name: 'ScienceWorld',
    slug: 'scienceworld',
    developer: 'Discovery Labs',
    description:
      'ScienceWorld brings science to life with AR experiments, 3D models, and interactive simulations. Explore biology, chemistry, physics, and astronomy with hands-on virtual labs.',
    whatsNew: 'New AR chemistry experiments and virtual telescope feature.',
    icon: 'https://placehold.co/96x96/06B6D4/FFFFFF?text=SW',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/083344/06B6D4?text=AR+Lab',
      'https://placehold.co/1280x720/0C4A6E/22D3EE?text=3D+Models',
    ]),
    categorySlug: 'education',
    rating: 4.7,
    downloads: 2100000,
    price: 3.99,
    version: '2.0.1',
    size: '280 MB',
    compatibility: 'iOS 14+, Android 10+',
    featured: true,
  },

  // Health & Fitness
  {
    name: 'FitTrack',
    slug: 'fittrack',
    developer: 'Health Plus',
    description:
      'FitTrack is your complete fitness companion. Over 500 workouts, custom plans, nutrition tracking, and wearable sync. Whether you are a beginner or an athlete, FitTrack adapts to your goals.',
    whatsNew: 'New HIIT workout plans and improved nutrition database.',
    icon: 'https://placehold.co/96x96/EF4444/FFFFFF?text=FT',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/450A0A/EF4444?text=Workout+Plans',
      'https://placehold.co/1280x720/7F1D1D/FCA5A5?text=Exercise+Guide',
      'https://placehold.co/1280x720/450A0A/EF4444?text=Progress+Charts',
    ]),
    categorySlug: 'health-fitness',
    rating: 4.7,
    downloads: 14000000,
    price: 0,
    version: '6.5.2',
    size: '95 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: true,
  },
  {
    name: 'MindfulMed',
    slug: 'mindfulmed',
    developer: 'Calm Technologies',
    description:
      'MindfulMed is a meditation and mental wellness app with guided sessions, breathwork exercises, sleep stories, and mood tracking. Science-backed techniques to reduce stress and improve wellbeing.',
    whatsNew: 'New CBT-based anxiety relief program and sleep analysis.',
    icon: 'https://placehold.co/96x96/8B5CF6/FFFFFF?text=MM',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/2E1065/8B5CF6?text=Meditation+Guide',
      'https://placehold.co/1280x720/2E1065/C4B5FD?text=Sleep+Sounds',
    ]),
    categorySlug: 'health-fitness',
    rating: 4.8,
    downloads: 9500000,
    price: 0,
    version: '5.0.0',
    size: '55 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: false,
  },
  {
    name: 'NutriScan',
    slug: 'nutriscan',
    developer: 'FoodHealth AI',
    description:
      'NutriScan uses AI and your camera to instantly identify foods and track nutritional information. Set dietary goals, scan barcodes, and get meal suggestions based on your health profile.',
    whatsNew: 'Improved AI food recognition and new recipe suggestions.',
    icon: 'https://placehold.co/96x96/22C55E/FFFFFF?text=NS',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/052E16/22C55E?text=Food+Scanner',
      'https://placehold.co/1280x720/14532D/86EFAC?text=Nutrition+Stats',
    ]),
    categorySlug: 'health-fitness',
    rating: 4.5,
    downloads: 5100000,
    price: 0,
    version: '3.4.1',
    size: '48 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },
  {
    name: 'RunCoach',
    slug: 'runcoach',
    developer: 'Athletic Edge',
    description:
      'RunCoach uses GPS tracking, heart rate monitoring, and AI coaching to help you run faster and smarter. Personalized training plans, race prep programs, and community challenges.',
    whatsNew: 'New marathon training plan and live pace coaching.',
    icon: 'https://placehold.co/96x96/F97316/FFFFFF?text=RC',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/431407/F97316?text=Run+Tracker',
      'https://placehold.co/1280x720/431407/FED7AA?text=Training+Plan',
    ]),
    categorySlug: 'health-fitness',
    rating: 4.6,
    downloads: 4400000,
    price: 0,
    version: '4.2.3',
    size: '68 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: false,
  },
  {
    name: 'SleepCycle',
    slug: 'sleepcycle',
    developer: 'Dream Analytics',
    description:
      'SleepCycle tracks your sleep patterns using sound analysis and wakes you during your lightest sleep phase. Wake up refreshed every day with the world leading sleep app.',
    whatsNew: 'New snoring analysis and sleep score trends.',
    icon: 'https://placehold.co/96x96/1D4ED8/FFFFFF?text=SC',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/1E3A5F/1D4ED8?text=Sleep+Analysis',
      'https://placehold.co/1280x720/0D2137/93C5FD?text=Sleep+Trends',
    ]),
    categorySlug: 'health-fitness',
    rating: 4.7,
    downloads: 8200000,
    price: 0,
    version: '6.8.0',
    size: '35 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },

  // Finance
  {
    name: 'WealthWise',
    slug: 'wealthwise',
    developer: 'FinTech Pro',
    description:
      'WealthWise is your personal financial advisor in your pocket. Track expenses, set budgets, analyze spending patterns, and get personalized investment recommendations. Connect all your bank accounts for a complete financial picture.',
    whatsNew: 'New investment portfolio tracker and tax optimization tips.',
    icon: 'https://placehold.co/96x96/16A34A/FFFFFF?text=WW',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/052E16/16A34A?text=Finance+Dashboard',
      'https://placehold.co/1280x720/14532D/4ADE80?text=Budget+Tracker',
      'https://placehold.co/1280x720/052E16/86EFAC?text=Investment+View',
    ]),
    categorySlug: 'finance',
    rating: 4.7,
    downloads: 7800000,
    price: 0,
    version: '8.1.0',
    size: '45 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: true,
  },
  {
    name: 'CryptoVault',
    slug: 'cryptovault',
    developer: 'Blockchain Apps',
    description:
      'CryptoVault is a secure cryptocurrency portfolio tracker and news aggregator. Track prices, set alerts, view detailed charts, and stay updated with the latest crypto news across 500+ coins.',
    whatsNew: 'DeFi tracking added and new price alert customization.',
    icon: 'https://placehold.co/96x96/F59E0B/FFFFFF?text=CV',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/451A03/F59E0B?text=Crypto+Portfolio',
      'https://placehold.co/1280x720/292524/FBBF24?text=Price+Charts',
    ]),
    categorySlug: 'finance',
    rating: 4.4,
    downloads: 5200000,
    price: 0,
    version: '3.6.2',
    size: '38 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: false,
  },
  {
    name: 'BudgetBoss',
    slug: 'budgetboss',
    developer: 'Smart Finance',
    description:
      'BudgetBoss simplifies budgeting with the envelope method. Allocate money to categories, track every purchase, and achieve your savings goals. Receipt scanning and automatic categorization save time.',
    whatsNew: 'New savings goal feature and bank sync improvements.',
    icon: 'https://placehold.co/96x96/EC4899/FFFFFF?text=BB',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/500724/EC4899?text=Budget+View',
      'https://placehold.co/1280x720/4A044E/F9A8D4?text=Expenses',
    ]),
    categorySlug: 'finance',
    rating: 4.6,
    downloads: 3400000,
    price: 0,
    version: '2.5.0',
    size: '28 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },
  {
    name: 'TaxEasy',
    slug: 'taxeasy',
    developer: 'Tax Solutions LLC',
    description:
      'TaxEasy guides you through tax filing with a simple interview process. Import W-2s, 1099s, and investment statements automatically. Get the maximum refund guaranteed.',
    whatsNew: 'Updated for 2024 tax year. New crypto tax support.',
    icon: 'https://placehold.co/96x96/0EA5E9/FFFFFF?text=TE',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/0C4A6E/0EA5E9?text=Tax+Wizard',
      'https://placehold.co/1280x720/082F49/38BDF8?text=Documents',
    ]),
    categorySlug: 'finance',
    rating: 4.3,
    downloads: 2800000,
    price: 0,
    version: '15.0.1',
    size: '55 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: false,
  },
  {
    name: 'StockRadar',
    slug: 'stockradar',
    developer: 'Market Analytics',
    description:
      'StockRadar provides real-time stock quotes, advanced charts, analyst ratings, and AI-powered insights. Paper trading lets you practice strategies without risking real money.',
    whatsNew: 'New AI earnings prediction and options flow tracker.',
    icon: 'https://placehold.co/96x96/7C3AED/FFFFFF?text=SR',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/2E1065/7C3AED?text=Stock+Charts',
      'https://placehold.co/1280x720/1E1B4B/A78BFA?text=Market+Overview',
    ]),
    categorySlug: 'finance',
    rating: 4.5,
    downloads: 4100000,
    price: 0,
    version: '5.3.2',
    size: '42 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: true,
  },

  // Photography
  {
    name: 'LensAI',
    slug: 'lensai',
    developer: 'Vision Technologies',
    description:
      'LensAI transforms your photos with AI-powered editing. One-tap enhancements, sky replacement, background blur, and over 100 professional filters. Edit like a pro with zero learning curve.',
    whatsNew: 'New generative fill feature and portrait retouching AI.',
    icon: 'https://placehold.co/96x96/DC2626/FFFFFF?text=LA',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/450A0A/DC2626?text=Photo+Editor',
      'https://placehold.co/1280x720/7F1D1D/FCA5A5?text=AI+Filters',
      'https://placehold.co/1280x720/450A0A/EF4444?text=Before+After',
    ]),
    categorySlug: 'photography',
    rating: 4.8,
    downloads: 16000000,
    price: 0,
    version: '7.2.0',
    size: '150 MB',
    compatibility: 'iOS 14+, Android 9+',
    featured: true,
  },
  {
    name: 'ProCamera',
    slug: 'procamera',
    developer: 'CameraLabs',
    description:
      'ProCamera gives you DSLR-level control on your smartphone. Manual controls for ISO, shutter, white balance, and focus. Shoot in RAW, use histogram and zebra exposure guides.',
    whatsNew: 'New astrophotography mode and video log profiles.',
    icon: 'https://placehold.co/96x96/1D4ED8/FFFFFF?text=PC',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/1E3A5F/1D4ED8?text=Camera+Interface',
      'https://placehold.co/1280x720/0D2137/93C5FD?text=Manual+Controls',
    ]),
    categorySlug: 'photography',
    rating: 4.7,
    downloads: 3600000,
    price: 4.99,
    version: '9.1.2',
    size: '85 MB',
    compatibility: 'iOS 14+, Android 10+',
    featured: false,
  },
  {
    name: 'Photobooth Plus',
    slug: 'photobooth-plus',
    developer: 'Fun Frames Studio',
    description:
      'Photobooth Plus creates amazing photo booth experiences for parties and events. Fun filters, stickers, frames, GIF creation, and instant sharing make every moment unforgettable.',
    whatsNew: 'New AR stickers and party mode for group selfies.',
    icon: 'https://placehold.co/96x96/F97316/FFFFFF?text=PP',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/431407/F97316?text=Photo+Booth',
      'https://placehold.co/1280x720/431407/FED7AA?text=Filters',
    ]),
    categorySlug: 'photography',
    rating: 4.3,
    downloads: 2400000,
    price: 0,
    version: '4.0.3',
    size: '65 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },
  {
    name: 'ColorGrade',
    slug: 'colorgrade',
    developer: 'Cinematic Tools',
    description:
      'ColorGrade brings Hollywood color grading to mobile. LUT packs, color wheels, curves, and professional tone mapping. Create cinematic looks for photos and videos.',
    whatsNew: 'New film emulation presets and HDR export.',
    icon: 'https://placehold.co/96x96/7C3AED/FFFFFF?text=CG',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/2E1065/7C3AED?text=Color+Tools',
      'https://placehold.co/1280x720/1E1B4B/C4B5FD?text=LUT+Library',
    ]),
    categorySlug: 'photography',
    rating: 4.6,
    downloads: 1800000,
    price: 2.99,
    version: '3.5.0',
    size: '120 MB',
    compatibility: 'iOS 14+, Android 10+',
    featured: false,
  },
  {
    name: 'SnapCollagePro',
    slug: 'snapcollage-pro',
    developer: 'Grid Works',
    description:
      'SnapCollagePro is the ultimate collage maker with 200+ layouts, background patterns, stickers, and fonts. Create stunning photo grids, stories, and cards for any occasion.',
    whatsNew: 'New animated collage templates and video collage support.',
    icon: 'https://placehold.co/96x96/EC4899/FFFFFF?text=SC',
    screenshots: JSON.stringify([
      'https://placehold.co/1280x720/500724/EC4899?text=Collage+Maker',
      'https://placehold.co/1280x720/4A044E/F9A8D4?text=Layout+Library',
    ]),
    categorySlug: 'photography',
    rating: 4.5,
    downloads: 4700000,
    price: 0,
    version: '6.1.0',
    size: '72 MB',
    compatibility: 'iOS 13+, Android 8+',
    featured: false,
  },
]

const reviewComments = [
  'This app has completely changed how I work. Highly recommended!',
  'Great app but could use some improvements in the UI.',
  'Absolutely love this! The features are exactly what I needed.',
  'Been using this for months and it just keeps getting better.',
  'Good overall but the premium features are behind a paywall.',
  'The best app in its category by far. No competition.',
  'Some bugs in the latest update but the developer is responsive.',
  'Simple, clean, and effective. Does exactly what it promises.',
  'The new update completely ruined the app. Going back to the old version.',
  'Incredible app. Worth every penny.',
  'Very polished and intuitive. My daily driver now.',
  'Good concept but execution needs work.',
  'My go-to app for this category. Cannot imagine life without it.',
  'The free tier is generous enough for casual users.',
  'Customer support is excellent and the app is rock solid.',
  'A bit heavy on battery but the features justify it.',
  'Clean design, fast performance, zero crashes. 5 stars.',
  'Decent app but competitors offer more features for less.',
  'The AI features are surprisingly accurate and useful.',
  'Regular updates keep the app fresh and improving.',
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.app.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create categories
  console.log('Creating categories...')
  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat })
    createdCategories[cat.slug] = created.id
  }

  // Create apps
  console.log('Creating apps...')
  const createdApps: string[] = []
  for (const app of appData) {
    const { categorySlug, ...appFields } = app
    const downloadCount = Math.floor(Math.random() * (5_000_000 - 10_000) + 10_000)
    const created = await prisma.app.create({
      data: {
        ...appFields,
        categoryId: createdCategories[categorySlug],
        downloadCount,
      },
    })
    createdApps.push(created.id)
  }

  // Create users
  console.log('Creating users...')
  const hashedPassword = await bcrypt.hash('demo1234', 10)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@appvault.com',
        password: hashedPassword,
        avatar: 'https://placehold.co/40x40/3B82F6/FFFFFF?text=DU',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: hashedPassword,
        avatar: 'https://placehold.co/40x40/EC4899/FFFFFF?text=AJ',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: hashedPassword,
        avatar: 'https://placehold.co/40x40/10B981/FFFFFF?text=BS',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carol White',
        email: 'carol@example.com',
        password: hashedPassword,
        avatar: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=CW',
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Chen',
        email: 'david@example.com',
        password: hashedPassword,
        avatar: 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=DC',
      },
    }),
  ])

  // Create reviews
  console.log('Creating reviews...')
  let reviewCount = 0
  for (let i = 0; i < createdApps.length; i++) {
    const numReviews = Math.floor(Math.random() * 3) + 2 // 2-4 reviews per app
    for (let j = 0; j < numReviews; j++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const rating = Math.floor(Math.random() * 2) + 4 // 4-5 stars
      await prisma.review.create({
        data: {
          rating,
          comment: reviewComments[reviewCount % reviewComments.length],
          userId: user.id,
          appId: createdApps[i],
        },
      })
      reviewCount++
    }
  }

  console.log(`✅ Seed complete!`)
  console.log(`   - ${categories.length} categories`)
  console.log(`   - ${appData.length} apps`)
  console.log(`   - ${users.length} users`)
  console.log(`   - ${reviewCount} reviews`)
  console.log(`\n🔐 Demo login: demo@appvault.com / demo1234`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
