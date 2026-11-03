import React, { useState } from 'react';
import { X, Copy, Check, Twitter, Linkedin, MessageCircle, Mail, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  profile,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const profileUrl = window.location.href;
  const shareText = `Check out my mini social profile: ${profile.displayName} (@${profile.handle})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(profileUrl)}`,
      color: 'bg-black hover:bg-zinc-800 text-white',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        profileUrl
      )}`,
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText} ${profileUrl}`
      )}`,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(
        `Profile of ${profile.displayName}`
      )}&body=${encodeURIComponent(`${shareText}\n\n${profileUrl}`)}`,
      color: 'bg-slate-700 hover:bg-slate-600 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Share Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Snapshot Preview */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <img
            src={
              profile.photoURL ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
            }
            alt={profile.displayName}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">{profile.displayName}</h4>
            <p className="text-xs text-indigo-400 font-mono truncate">@{profile.handle}</p>
            <p className="text-[11px] text-slate-400 line-clamp-1">{profile.headline || profile.bio}</p>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Profile Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={profileUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Share to Social</label>
          <div className="grid grid-cols-2 gap-2.5">
            {shareLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium transition ${item.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
