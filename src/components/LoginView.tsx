import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Heart, Share2, MessageSquare, Shield, Globe } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => Promise<void>;
  isLoading: boolean;
  errorMessage?: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  isLoading,
  errorMessage,
}) => {
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      await onLogin();
    } catch {
      // Error handled in parent
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Intro & Login CTA */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mini Social Media Identity</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Your personal hub,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              simplified & beautiful.
            </span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Sign in to access your mini social profile. Customize your bio, organize your links, publish status updates, and showcase your online presence with clean modern flair.
          </p>

          {/* Value points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto lg:mx-0 pt-2">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-200">Personalized Card</p>
                <p className="text-xs text-slate-400">Avatars, custom themes, and bio highlights.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <Globe className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-200">Link-in-Bio</p>
                <p className="text-xs text-slate-400">All your social accounts in one clean view.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <MessageSquare className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-200">Micro Updates</p>
                <p className="text-xs text-slate-400">Share your thoughts, projects & moods.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-200">Real-Time Sync</p>
                <p className="text-xs text-slate-400">Secure Firestore persistence across devices.</p>
              </div>
            </div>
          </div>

          {/* Login Action */}
          <div className="pt-2">
            <button
              onClick={handleSignIn}
              disabled={isLoading || signingIn}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-xl text-base font-medium text-slate-900 bg-white hover:bg-slate-100 shadow-xl shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading || signingIn ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span className="font-semibold text-slate-900">
                {isLoading || signingIn ? 'Connecting...' : 'Sign in with Google'}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-600" />
            </button>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm text-left">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Mockup Card Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl overflow-hidden relative group">
            {/* Ambient backdrop glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500" />

            <div className="relative z-10 bg-slate-900 rounded-3xl overflow-hidden">
              {/* Cover Banner Mock */}
              <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 relative flex items-end p-3">
                <span className="ml-auto text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20">
                  Preview
                </span>
              </div>

              {/* Avatar & Badges */}
              <div className="px-5 pt-0 pb-5">
                <div className="flex justify-between items-end -mt-12 mb-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                      alt="Demo Avatar"
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl"
                    />
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                    <span>⚡ Exploring</span>
                  </div>
                </div>

                {/* Profile Identity */}
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  Alex Morgan
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                </h3>
                <p className="text-xs text-indigo-400 font-medium">@alex_creative • she/they</p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Design Technologist crafting delightful web experiences & micro-apps. Coffee enthusiast ☕
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 mt-3 border-y border-slate-800 text-center">
                  <div>
                    <p className="text-sm font-bold text-white">412</p>
                    <p className="text-[10px] text-slate-400">Followers</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">186</p>
                    <p className="text-[10px] text-slate-400">Following</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-pink-400">89</p>
                    <p className="text-[10px] text-slate-400">Cheers</p>
                  </div>
                </div>

                {/* Sample Post */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">Latest update</span>
                    <span>2h ago</span>
                  </div>
                  <p className="text-slate-200">
                    Just shipped a new mini-profile concept! Loving the instant sync. 🚀
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-pink-400">
                      <Heart className="w-3 h-3 fill-pink-400" /> 18
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" /> Share
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
