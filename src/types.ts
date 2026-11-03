export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
}

export interface UserProfile {
  id?: string;
  userId: string;
  displayName: string;
  handle: string;
  email?: string;
  photoURL?: string;
  bannerTheme: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  pronouns?: string;
  statusMessage?: string;
  statusEmoji?: string;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  skills: string[];
  socialLinks: SocialLinks;
  createdAt: string;
  updatedAt?: string;
}

export interface UserPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  content: string;
  tag?: string;
  likes: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BannerTheme {
  id: string;
  name: string;
  gradient: string;
  accentColor: string;
  badgeBg: string;
}

export const BANNER_THEMES: Record<string, BannerTheme> = {
  ocean: {
    id: 'ocean',
    name: 'Ocean Depths',
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    accentColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    gradient: 'from-orange-500 via-pink-600 to-purple-600',
    accentColor: 'text-pink-400',
    badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora Borealis',
    gradient: 'from-emerald-500 via-teal-600 to-indigo-700',
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    gradient: 'from-fuchsia-600 via-purple-700 to-pink-500',
    accentColor: 'text-fuchsia-400',
    badgeBg: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Slate',
    gradient: 'from-slate-900 via-zinc-800 to-neutral-900',
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  cherry: {
    id: 'cherry',
    name: 'Rose Romance',
    gradient: 'from-rose-500 via-red-500 to-amber-500',
    accentColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
};
