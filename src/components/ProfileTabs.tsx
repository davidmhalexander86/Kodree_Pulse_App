import React, { useState } from 'react';
import {
  MessageSquare,
  User,
  Share2,
  Send,
  Heart,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  Tag,
  CreditCard,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { UserProfile, UserPost, BANNER_THEMES } from '../types';

interface ProfileTabsProps {
  profile: UserProfile;
  posts: UserPost[];
  onCreatePost: (content: string, tag: string) => Promise<void>;
  onLikePost: (postId: string) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  profile,
  posts,
  onCreatePost,
  onLikePost,
  onDeletePost,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'about' | 'links' | 'card'>('feed');
  const [postContent, setPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Update');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLinkKey, setCopiedLinkKey] = useState<string | null>(null);

  const availableTags = ['Update', 'Design', 'Code', 'Milestone', 'Thought', 'Life'];

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onCreatePost(postContent.trim(), selectedTag);
      setPostContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLinkKey(key);
    setTimeout(() => setCopiedLinkKey(null), 2000);
  };

  const activeTheme = BANNER_THEMES[profile.bannerTheme] || BANNER_THEMES.ocean;

  const socialPlatforms = [
    {
      key: 'github',
      name: 'GitHub',
      icon: Github,
      url: profile.socialLinks.github,
      color: 'hover:text-white hover:border-slate-600',
    },
    {
      key: 'twitter',
      name: 'X (Twitter)',
      icon: Twitter,
      url: profile.socialLinks.twitter,
      color: 'hover:text-sky-400 hover:border-sky-500/40',
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      url: profile.socialLinks.linkedin,
      color: 'hover:text-blue-400 hover:border-blue-500/40',
    },
    {
      key: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      url: profile.socialLinks.instagram,
      color: 'hover:text-pink-400 hover:border-pink-500/40',
    },
    {
      key: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      url: profile.socialLinks.youtube,
      color: 'hover:text-red-400 hover:border-red-500/40',
    },
    {
      key: 'website',
      name: 'Website / Portfolio',
      icon: Globe,
      url: profile.website || profile.socialLinks.website,
      color: 'hover:text-indigo-400 hover:border-indigo-500/40',
    },
  ].filter((p) => Boolean(p.url));

  return (
    <div className="w-full">
      {/* Navigation Tab Bar */}
      <div className="flex border-b border-slate-800 mb-6 gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'feed'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Updates & Posts</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {posts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'about'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>About & Skills</span>
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'links'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social Links</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {socialPlatforms.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('card')}
          className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'card'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Digital Card</span>
        </button>
      </div>

      {/* Tab 1: Feed & Updates */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Post Composer */}
          <form
            onSubmit={handlePostSubmit}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4"
          >
            <div className="flex gap-3">
              <img
                src={
                  profile.photoURL ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                }
                alt={profile.displayName}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800 shrink-0"
              />
              <div className="w-full">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share a thought, project milestone, or what's on your mind..."
                  rows={2}
                  maxLength={1000}
                  className="w-full bg-slate-800/60 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-400 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Tag selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
                <span className="text-slate-400 flex items-center gap-1 mr-1">
                  <Tag className="w-3.5 h-3.5" />
                  Tag:
                </span>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      selectedTag === tag
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!postContent.trim() || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50 disabled:pointer-events-none ml-auto"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Publish</span>
              </button>
            </div>
          </form>

          {/* Posts Timeline */}
          {posts.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-200">No updates yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Publish your first micro-status update above to let profile visitors know what you are working on!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-md hover:border-slate-700/80 transition space-y-3"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          post.authorAvatar ||
                          profile.photoURL ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                        }
                        alt={post.authorName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{post.authorName}</p>
                          {post.tag && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              #{post.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          @{post.authorHandle || profile.handle} •{' '}
                          {new Date(post.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          on {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line pl-12">
                    {post.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-800/60 pl-12 text-xs">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          post.likes > 0 ? 'fill-rose-400 text-rose-400' : ''
                        }`}
                      />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(post.content, `post-${post.id}`)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
                    >
                      {copiedLinkKey === `post-${post.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: About & Skills */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Bio Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                About Me
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {profile.bio || 'No bio provided yet. Click "Edit Profile" to share your story!'}
              </p>
            </div>

            {/* Skills & Interests */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Skills & Specialties</span>
              </h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700 hover:border-indigo-500/40 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No skills added yet.</p>
              )}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Profile Info
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Email</span>
                  <span className="font-mono text-slate-200">{profile.email || 'Private'}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Handle</span>
                  <span className="font-mono text-indigo-400">@{profile.handle}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Status Message</span>
                  <span className="text-slate-200">
                    {profile.statusEmoji} {profile.statusMessage || 'Available'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Pronouns</span>
                  <span className="text-slate-200">{profile.pronouns || 'Not specified'}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Location</span>
                  <span className="text-slate-200">{profile.location || 'Remote'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Social Links / Link-in-Bio */}
      {activeTab === 'links' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="text-center pb-2">
            <h3 className="text-lg font-bold text-white">Connected Accounts</h3>
            <p className="text-xs text-slate-400 mt-1">
              Tap any link to visit or copy the verified link directly.
            </p>
          </div>

          {socialPlatforms.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <p className="text-sm text-slate-300">No social links added yet.</p>
              <p className="text-xs text-slate-400">
                Click "Edit Profile" to link your GitHub, Twitter/X, LinkedIn, and more!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                const fullUrl = platform.url?.startsWith('http')
                  ? platform.url
                  : `https://${platform.url}`;

                return (
                  <div
                    key={platform.key}
                    className={`flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition group shadow-md ${platform.color}`}
                  >
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3.5 flex-1 min-w-0"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                        <Icon className="w-5 h-5 text-slate-300 group-hover:text-white" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition truncate">
                          {platform.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono truncate">{platform.url}</p>
                      </div>
                    </a>

                    <div className="flex items-center gap-2 pl-3">
                      <button
                        onClick={() => copyToClipboard(fullUrl, platform.key)}
                        className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition"
                        title="Copy link"
                      >
                        {copiedLinkKey === platform.key ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Digital Card */}
      {activeTab === 'card' && (
        <div className="max-w-md mx-auto py-4 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-white">Digital Pass</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your compact identity card to share on other platforms.
            </p>
          </div>

          {/* Pass Card Container */}
          <div className="rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden relative">
            {/* Theme header */}
            <div className={`h-24 w-full bg-gradient-to-r ${activeTheme.gradient} p-4 flex justify-between items-start`}>
              <span className="text-xs font-bold tracking-widest uppercase text-white/90">
                PulseProfile Pass
              </span>
              <QrCode className="w-6 h-6 text-white/80" />
            </div>

            <div className="px-6 pb-6 pt-0">
              <div className="flex justify-between items-end -mt-10 mb-4">
                <img
                  src={
                    profile.photoURL ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
                  }
                  alt={profile.displayName}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl"
                />
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                  {profile.statusEmoji || '⚡'} Active
                </span>
              </div>

              <h4 className="text-xl font-black text-white">{profile.displayName}</h4>
              <p className="text-xs text-indigo-400 font-mono">@{profile.handle}</p>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">{profile.headline || profile.bio}</p>

              <div className="grid grid-cols-3 gap-2 py-3 mt-4 border-y border-slate-800 text-center">
                <div>
                  <p className="text-base font-black text-white">{profile.followersCount}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Followers</p>
                </div>
                <div>
                  <p className="text-base font-black text-white">{profile.followingCount}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Following</p>
                </div>
                <div>
                  <p className="text-base font-black text-pink-400">{profile.likesCount}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Cheers</p>
                </div>
              </div>

              <div className="mt-4 pt-1 flex items-center justify-between text-xs text-slate-400">
                <span>Verified pulseprofile.app</span>
                <span className="font-mono text-[10px]">ID: {profile.userId.slice(0, 8)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() =>
                copyToClipboard(
                  `Check out my mini social profile: ${profile.displayName} (@${profile.handle}) - ${profile.headline || profile.bio}`,
                  'digital-card'
                )
              }
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20"
            >
              {copiedLinkKey === 'digital-card' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Card Summary Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Profile Card Summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
