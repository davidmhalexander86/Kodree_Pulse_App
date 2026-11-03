import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  addDoc,
  increment,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, UserPost } from '../types';

export const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80',
];

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export function subscribeToUserProfile(
  userId: string,
  onUpdate: (profile: UserProfile | null) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}`;
  const docRef = doc(db, 'users', userId);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as UserProfile);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

export async function createInitialUserProfile(
  userId: string,
  email: string | null,
  displayName: string | null,
  photoURL: string | null
): Promise<UserProfile> {
  const path = `users/${userId}`;
  const safeDisplayName = displayName || email?.split('@')[0] || 'Social Explorer';
  const cleanHandle = safeDisplayName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .slice(0, 30) || `user_${userId.slice(0, 6)}`;

  const newProfile: UserProfile = {
    id: userId,
    userId,
    displayName: safeDisplayName.slice(0, 100),
    handle: cleanHandle,
    email: (email || '').slice(0, 120),
    photoURL: photoURL || DEFAULT_AVATARS[0],
    bannerTheme: 'ocean',
    headline: 'Exploring ideas, building cool tech, and connecting with people ✨',
    bio: 'Hey there! Welcome to my mini social media space. Feel free to explore my updates, check out my links, and drop a cheer! 🚀',
    location: 'San Francisco, CA',
    website: 'https://github.com',
    pronouns: 'they/them',
    statusMessage: 'Ready to connect & build',
    statusEmoji: '⚡',
    followersCount: 142,
    followingCount: 88,
    likesCount: 29,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'UI/UX Design', 'Product Strategy'],
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://x.com',
      linkedin: 'https://linkedin.com',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'userId' | 'createdAt' | 'id'>>
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const sanitizedUpdates = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, sanitizedUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function cheerUserProfile(userId: string): Promise<void> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      likesCount: increment(1),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function toggleFollow(userId: string, isCurrentlyFollowing: boolean): Promise<void> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      followersCount: increment(isCurrentlyFollowing ? -1 : 1),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export function subscribeToUserPosts(
  userId: string,
  onPosts: (posts: UserPost[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/posts`;
  const postsRef = collection(db, 'users', userId, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snap) => {
      const posts: UserPost[] = [];
      snap.forEach((docSnap) => {
        posts.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<UserPost, 'id'>),
        });
      });
      onPosts(posts);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

export async function createUserPost(
  userId: string,
  profile: UserProfile,
  content: string,
  tag: string = 'Update'
): Promise<void> {
  const path = `users/${userId}/posts`;
  const postsRef = collection(db, 'users', userId, 'posts');
  const now = new Date().toISOString();

  const newPost = {
    userId,
    authorName: profile.displayName.slice(0, 100),
    authorAvatar: (profile.photoURL || '').slice(0, 1000),
    authorHandle: profile.handle.slice(0, 50),
    content: content.slice(0, 1000),
    tag: tag.slice(0, 40),
    likes: 0,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await addDoc(postsRef, newPost);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function likeUserPost(userId: string, postId: string): Promise<void> {
  const path = `users/${userId}/posts/${postId}`;
  try {
    const postRef = doc(db, 'users', userId, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function deleteUserPost(userId: string, postId: string): Promise<void> {
  const path = `users/${userId}/posts/${postId}`;
  try {
    const postRef = doc(db, 'users', userId, 'posts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}
