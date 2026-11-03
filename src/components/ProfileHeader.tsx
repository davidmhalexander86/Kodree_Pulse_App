import React, { useState } from 'react';
import {
  Heart,
  UserCheck,
  UserPlus,
  Edit3,
  Share2,
  MapPin,
  Globe,
  Calendar,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { UserProfile, BANNER_THEMES } from '../types';

interface ProfileHeaderProps {
  profile: UserProfile;
  totalPosts: number;
  onEditClick: () => void;
  onShareClick: () => void;
  onCheer: () => Promise<void>;
  onToggleFollow: (isFollowing: boolean) => Promise<void>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  totalPosts,
  onEditClick,
  onShareClick,
  onCheer,
  onToggleFollow,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [cheerAnimating, setCheerAnimating] = useState(false);

  const activeTheme = BANNER_THEMES[profile.bannerTheme] || BANNER_THEMES.ocean;

  const handleCheerClick = async () => {
    setCheerAnimating(true);
    try {
      await onCheer();
    } finally {
      setTimeout(() => setCheerAnimating(false), 600);
    }
  };

  const handleFollowClick = async () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    await onToggleFollow(isFollowing);
  };

  const formattedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden mb-8">
      {/* Dynamic Cover Banner */}
      <div
        className={`h-44 sm:h-56 w-full bg-gradient-to-r ${activeTheme.gradient} relative overflow-hidden`}
      >
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Badges */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/30 text-white border border-white/20 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeTheme.name}</span>
          </span>
        </div>
      </div>

      {/* Main Profile Info Header */}
      <div className="px-6 sm:px-8 pb-8 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
          {/* Avatar & Online status */}
          <div className="relative inline-block">
            <img
              src={
                profile.photoURL ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80'
              }
              alt={profile.displayName}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-slate-900 shadow-2xl bg-slate-800"
            />
            <span
              className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-slate-900 shadow-md"
              title="Active now"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCheerClick}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                cheerAnimating
                  ? 'bg-rose-500 text-white scale-110'
                  : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
              }`}
              title="Cheer this profile"
            >
              <Heart
                className={`w-4 h-4 ${
                  cheerAnimating ? 'fill-white text-white scale-125' : 'fill-rose-400 text-rose-400'
                } transition-transform`}
              />
              <span>Cheer</span>
              <span className="font-mono text-xs opacity-80">({profile.likesCount})</span>
            </button>

            <button
              onClick={handleFollowClick}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isFollowing
                  ? 'bg-slate-800 text-indigo-400 border border-indigo-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Follow</span>
                </>
              )}
            </button>

            <button
              onClick={onEditClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Edit3 className="w-4 h-4 text-slate-400" />
              <span>Edit</span>
            </button>

            <button
              onClick={onShareClick}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="Share profile link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Identity & Status */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {profile.displayName}
              <CheckCircle className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
            </h1>

            {profile.pronouns && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/80">
                {profile.pronouns}
              </span>
            )}

            {profile.statusMessage && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                <span>{profile.statusEmoji || '✨'}</span>
                <span>{profile.statusMessage}</span>
              </div>
            )}
          </div>

          <p className="text-sm font-mono text-indigo-400">@{profile.handle}</p>

          {profile.headline && (
            <p className="text-base font-medium text-slate-200">{profile.headline}</p>
          )}

          {profile.bio && (
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl whitespace-pre-line">
              {profile.bio}
            </p>
          )}

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-400 pt-1">
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {profile.location}
              </span>
            )}

            {profile.website && (
              <a
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-indigo-400 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}

            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Joined {formattedDate}
            </span>
          </div>
        </div>

        {/* Profile Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700/80 transition">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Followers
            </span>
            <p className="text-2xl font-black text-white mt-1">
              {profile.followersCount.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700/80 transition">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Following
            </span>
            <p className="text-2xl font-black text-white mt-1">
              {profile.followingCount.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700/80 transition">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Cheers & Likes
            </span>
            <p className="text-2xl font-black text-rose-400 mt-1">
              {profile.likesCount.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700/80 transition">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Updates
            </span>
            <p className="text-2xl font-black text-indigo-400 mt-1">
              {totalPosts}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
