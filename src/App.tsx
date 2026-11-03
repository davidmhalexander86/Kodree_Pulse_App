/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser, testConnection } from './firebase';
import {
  getUserProfile,
  createInitialUserProfile,
  subscribeToUserProfile,
  subscribeToUserPosts,
  updateUserProfile,
  createUserPost,
  likeUserPost,
  deleteUserPost,
  cheerUserProfile,
  toggleFollow,
} from './services/profileService';
import { UserProfile, UserPost } from './types';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileTabs } from './components/ProfileTabs';
import { EditProfileModal } from './components/EditProfileModal';
import { ShareModal } from './components/ShareModal';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Run test connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  // Auth state listener
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;
    let unsubscribePosts: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        setLoading(true);
        try {
          // Check if profile exists
          let existingProfile = await getUserProfile(user.uid);
          if (!existingProfile) {
            existingProfile = await createInitialUserProfile(
              user.uid,
              user.email,
              user.displayName,
              user.photoURL
            );
          }
          setProfile(existingProfile);

          // Subscribe to real-time profile changes
          unsubscribeProfile = subscribeToUserProfile(
            user.uid,
            (updatedProfile) => {
              if (updatedProfile) {
                setProfile(updatedProfile);
              }
            },
            (err) => {
              console.error('Profile subscription error:', err);
            }
          );

          // Subscribe to real-time posts
          unsubscribePosts = subscribeToUserPosts(
            user.uid,
            (userPosts) => {
              setPosts(userPosts);
            },
            (err) => {
              console.error('Posts subscription error:', err);
            }
          );
        } catch (err) {
          console.error('Error initializing user profile:', err);
          setAuthError('Failed to load profile. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        if (unsubscribeProfile) unsubscribeProfile();
        if (unsubscribePosts) unsubscribePosts();
        setProfile(null);
        setPosts([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribePosts) unsubscribePosts();
    };
  }, []);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await loginWithGoogle();
      showToast('Welcome back to PulseProfile! 🎉');
    } catch (err) {
      console.error(err);
      setAuthError('Sign-in cancelled or encountered an error.');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    showToast('Signed out successfully.');
  };

  const handleSaveProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    await updateUserProfile(currentUser.uid, updates);
    showToast('Profile updated successfully! ✨');
  };

  const handleCheer = async () => {
    if (!currentUser) return;
    await cheerUserProfile(currentUser.uid);
    showToast('Cheer added! ❤️');
  };

  const handleToggleFollow = async (isFollowing: boolean) => {
    if (!currentUser) return;
    await toggleFollow(currentUser.uid, isFollowing);
    showToast(isFollowing ? 'Unfollowed profile.' : 'Now following profile! 🤝');
  };

  const handleCreatePost = async (content: string, tag: string) => {
    if (!currentUser || !profile) return;
    await createUserPost(currentUser.uid, profile, content, tag);
    showToast('Update posted to your timeline! 🚀');
  };

  const handleLikePost = async (postId: string) => {
    if (!currentUser) return;
    await likeUserPost(currentUser.uid, postId);
  };

  const handleDeletePost = async (postId: string) => {
    if (!currentUser) return;
    await deleteUserPost(currentUser.uid, postId);
    showToast('Post removed.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-indigo-600 text-white shadow-2xl text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        profile={profile}
        onEditClick={() => setIsEditModalOpen(true)}
        onShareClick={() => setIsShareModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8">
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-400">Loading profile data...</p>
          </div>
        ) : !currentUser || !profile ? (
          <LoginView
            onLogin={handleLogin}
            isLoading={loading}
            errorMessage={authError}
          />
        ) : (
          <div className="animate-fade-in">
            {/* Profile Hero Header */}
            <ProfileHeader
              profile={profile}
              totalPosts={posts.length}
              onEditClick={() => setIsEditModalOpen(true)}
              onShareClick={() => setIsShareModalOpen(true)}
              onCheer={handleCheer}
              onToggleFollow={handleToggleFollow}
            />

            {/* Profile Tabbed Content (Feed, About, Social Links, Card) */}
            <ProfileTabs
              profile={profile}
              posts={posts}
              onCreatePost={handleCreatePost}
              onLikePost={handleLikePost}
              onDeletePost={handleDeletePost}
            />

            {/* Edit Profile Modal */}
            <EditProfileModal
              isOpen={isEditModalOpen}
              profile={profile}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSaveProfile}
            />

            {/* Share Profile Modal */}
            <ShareModal
              isOpen={isShareModalOpen}
              profile={profile}
              onClose={() => setIsShareModalOpen(false)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        <p>PulseProfile • Mini Social Media Space</p>
      </footer>
    </div>
  );
}
