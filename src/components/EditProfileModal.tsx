import React, { useState } from 'react';
import {
  X,
  Save,
  Sparkles,
  User,
  Palette,
  Share2,
  Plus,
  Trash2,
  Check,
  Link,
  MapPin,
  Globe,
} from 'lucide-react';
import { UserProfile, BANNER_THEMES } from '../types';
import { DEFAULT_AVATARS } from '../services/profileService';

interface EditProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (updated: Partial<UserProfile>) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave,
}) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'theme' | 'social' | 'skills'>(
    'profile'
  );

  // Form states
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [handle, setHandle] = useState(profile.handle || '');
  const [pronouns, setPronouns] = useState(profile.pronouns || '');
  const [headline, setHeadline] = useState(profile.headline || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || '');
  const [website, setWebsite] = useState(profile.website || '');
  const [statusEmoji, setStatusEmoji] = useState(profile.statusEmoji || '⚡');
  const [statusMessage, setStatusMessage] = useState(profile.statusMessage || '');
  const [bannerTheme, setBannerTheme] = useState(profile.bannerTheme || 'ocean');
  const [photoURL, setPhotoURL] = useState(profile.photoURL || DEFAULT_AVATARS[0]);

  // Skills
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Social Links
  const [github, setGithub] = useState(profile.socialLinks?.github || '');
  const [twitter, setTwitter] = useState(profile.socialLinks?.twitter || '');
  const [linkedin, setLinkedin] = useState(profile.socialLinks?.linkedin || '');
  const [instagram, setInstagram] = useState(profile.socialLinks?.instagram || '');
  const [youtube, setYoutube] = useState(profile.socialLinks?.youtube || '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 15) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const cleanHandle = handle
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .slice(0, 50);

      await onSave({
        displayName: displayName.trim().slice(0, 100),
        handle: cleanHandle || profile.handle,
        pronouns: pronouns.trim().slice(0, 50),
        headline: headline.trim().slice(0, 150),
        bio: bio.trim().slice(0, 500),
        location: location.trim().slice(0, 100),
        website: website.trim().slice(0, 200),
        statusEmoji: statusEmoji.slice(0, 20),
        statusMessage: statusMessage.trim().slice(0, 150),
        bannerTheme,
        photoURL,
        skills,
        socialLinks: {
          github: github.trim(),
          twitter: twitter.trim(),
          linkedin: linkedin.trim(),
          instagram: instagram.trim(),
          youtube: youtube.trim(),
          website: website.trim(),
        },
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const emojiPresets = ['⚡', '✨', '💻', '🚀', '☕', '🎨', '🌿', '🎧', '🔥', '💡'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Edit Social Profile</span>
            </h2>
            <p className="text-xs text-slate-400">Update your public identity and social links</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 gap-2 bg-slate-950/40 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSection('profile')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition ${
              activeSection === 'profile'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Bio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('theme')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition ${
              activeSection === 'theme'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Avatar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('social')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition ${
              activeSection === 'social'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Links</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('skills')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition ${
              activeSection === 'skills'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skills & Tags</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Section 1: Basic Info */}
          {activeSection === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Handle (@username)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500">@</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                      maxLength={50}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pronouns
                  </label>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    placeholder="e.g. they/them, she/her, he/him"
                    maxLength={50}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      maxLength={100}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Headline / Tagline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Product Designer & Builder • Exploring new ideas ✨"
                  maxLength={150}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Bio</label>
                  <span className="text-[10px] text-slate-500">{bio.length}/500</span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Write a brief introduction about yourself..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                />
              </div>

              {/* Status Mood */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Current Status Mood
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {emojiPresets.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setStatusEmoji(emoji)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition ${
                          statusEmoji === emoji
                            ? 'bg-indigo-600 ring-2 ring-indigo-400'
                            : 'bg-slate-700/60 hover:bg-slate-700'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="What are you up to right now? (e.g. Deep in code)"
                  maxLength={150}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>
          )}

          {/* Section 2: Theme & Avatar */}
          {activeSection === 'theme' && (
            <div className="space-y-6">
              {/* Banner Theme selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Cover Banner Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.values(BANNER_THEMES).map((theme) => {
                    const isSelected = bannerTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setBannerTheme(theme.id)}
                        className={`relative rounded-2xl overflow-hidden p-3 text-left border-2 transition ${
                          isSelected
                            ? 'border-white shadow-lg'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div
                          className={`h-12 rounded-xl bg-gradient-to-r ${theme.gradient} mb-2 flex items-center justify-center`}
                        >
                          {isSelected && <Check className="w-5 h-5 text-white drop-shadow" />}
                        </div>
                        <span className="text-xs font-semibold text-white block truncate">
                          {theme.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Choose Avatar Preset
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {DEFAULT_AVATARS.map((avatar, idx) => {
                    const isSelected = photoURL === avatar;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoURL(avatar)}
                        className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition ${
                          isSelected ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={avatar}
                          alt={`Avatar option ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Or custom image URL
                  </label>
                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    maxLength={1000}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Social Links */}
          {activeSection === 'social' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Add your social profiles and website so visitors can connect with you.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Website / Portfolio
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub</label>
                <div className="relative">
                  <Link className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">X (Twitter)</label>
                <div className="relative">
                  <Link className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://x.com/username"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn</label>
                <div className="relative">
                  <Link className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram</label>
                <div className="relative">
                  <Link className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube</label>
                <div className="relative">
                  <Link className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/@channel"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Skills & Tags */}
          {activeSection === 'skills' && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-300">
                Add Skills, Interests & Badges
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="e.g. React, UX Writing, Travel, AI"
                  maxLength={40}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
