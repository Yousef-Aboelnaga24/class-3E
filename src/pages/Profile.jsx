import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  FiBarChart2,
  FiCheck,
  FiEdit3,
  FiGrid,
  FiImage,
  FiLock,
  FiPlus,
  FiShield,
  FiUserCheck,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { PageTransition } from '../components/layout/PageTransition';
import MemoryCard from '../components/MemoryCard';
import { useAuth } from '../auth/AuthContext';
import { useUserPosts, useUpdateProfile, useUser } from '../hooks/useUsers';

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const roleStyles = {
  admin: {
    label: 'Admin',
    icon: FiShield,
    badge: 'border-red-200 bg-red-50 text-red-600 shadow-[0_0_28px_rgba(239,68,68,0.35)]',
    pulse: 'bg-red-400',
  },
  student: {
    label: 'Student',
    icon: FiUserCheck,
    badge: 'border-amber-200 bg-amber-50 text-amber-700 shadow-[0_0_28px_rgba(244,162,97,0.45)]',
    pulse: 'bg-amber-warm',
  },
  user: {
    label: 'User',
    icon: FiLock,
    badge: 'border-gray-200 bg-white text-gray-600 shadow-card',
    pulse: 'bg-gray-400',
  },
};

function normalizeRole(role) {
  return String(role || 'user').toLowerCase();
}

function extractCollection(page) {
  const payload = page?.data || page;
  const data = payload?.data || payload?.posts || payload;
  return Array.isArray(data) ? data : [];
}

function getAvatar(name, avatar) {
  if (typeof avatar === 'string' && avatar.trim().length > 0) {
    return avatar;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || 'User'
  )}&background=F4A261&color=fff`;
}

function AnimatedCounter({ value }) {
  const numericValue = Number(value || 0);
  const spring = useSpring(0, { stiffness: 90, damping: 22, mass: 0.8 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    spring.set(numericValue);
    return spring.on('change', (latest) => setDisplay(Math.round(latest)));
  }, [numericValue, spring]);

  return <span>{display.toLocaleString()}</span>;
}

function ProfileSkeleton() {
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="h-72 rounded-[2rem] bg-gradient-to-r from-white via-cream-100 to-white bg-[length:200%_100%] animate-shimmer" />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="h-72 rounded-3xl bg-gradient-to-r from-white via-cream-100 to-white bg-[length:200%_100%] animate-shimmer" />
          <div className="space-y-4">
            <div className="h-40 rounded-3xl bg-gradient-to-r from-white via-cream-100 to-white bg-[length:200%_100%] animate-shimmer" />
            <div className="h-40 rounded-3xl bg-gradient-to-r from-white via-cream-100 to-white bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function EditProfileModal({ isOpen, onClose, user, profileId, onSaved }) {
  const updateUser = useUpdateProfile();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(preview);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('bio', form.bio || '');
    if (avatarFile) formData.append('avatar', avatarFile);

    const optimisticUser = {
      id: profileId,
      name: form.name,
      bio: form.bio,
      avatar: avatarPreview || user?.avatar,
    };

    const response = await updateUser.mutateAsync({ id: profileId, formData, optimisticUser });
    setShowSuccess(true);
    onSaved(response?.data || response || optimisticUser);
    window.setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 850);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <motion.button
            aria-label="Close edit profile"
            className="absolute inset-0 bg-memory-text/35 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.form
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg overflow-hidden bg-white border shadow-2xl rounded-3xl border-white/70"
            initial={{ opacity: 0, scale: 0.86, y: 28, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.88, y: 24, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-memory-border">
              <div>
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <p className="text-sm text-memory-muted">Your wall should feel unmistakably yours.</p>
              </div>
              <motion.button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-cream-100" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                <FiX />
              </motion.button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <motion.img
                  src={getAvatar(form.name, avatarPreview)}
                  className="object-cover w-20 h-20 border-4 rounded-full shadow-card border-cream-100"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                  alt=""
                />
                <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition border rounded-full cursor-pointer border-memory-border hover:border-amber-warm hover:text-amber-deep">
                  <FiImage />
                  Avatar
                  <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="ml-1 text-sm font-semibold">Name</span>
                <input className="input-field" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
              </label>

              <label className="block space-y-2">
                <span className="ml-1 text-sm font-semibold">Bio</span>
                <textarea className="min-h-28 input-field" value={form.bio} onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))} />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 bg-cream-50/70">
              <motion.button type="button" onClick={onClose} className="btn-secondary" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                Cancel
              </motion.button>
              <motion.button type="submit" disabled={updateUser.isPending} className="inline-flex items-center justify-center gap-2 btn-primary min-w-32" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                {updateUser.isPending ? <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" /> : <FiCheck />}
                Save
              </motion.button>
            </div>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="grid text-white rounded-full size-24 place-items-center bg-sage-soft shadow-[0_0_50px_rgba(149,213,178,0.75)]"
                    initial={{ scale: 0.2, rotate: -25 }}
                    animate={{ scale: [0.2, 1.15, 1], rotate: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <FiCheck className="text-5xl" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, setUser } = useAuth();
  const profileId = id || currentUser?.id;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const loadMoreRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const { data: userData, isLoading: isLoadingUser, isError: isUserError } = useUser(profileId);
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useUserPosts(profileId);

  const user = userData?.data || userData;
  const roleKey = normalizeRole(user?.role);
  const role = roleStyles[roleKey] || roleStyles.user;
  const RoleIcon = role.icon;
  const isOwner = currentUser?.id && String(currentUser.id) === String(profileId);
  const isAdmin = roleKey === 'admin';
  const isStudent = roleKey === 'student';

  const posts = useMemo(() => postsData?.pages?.flatMap(extractCollection) || [], [postsData]);
  const stats = [
    { label: 'Memories', value: user?.posts_count ?? posts.length, icon: FiGrid },
    { label: 'Photos', value: user?.photos_count ?? posts.reduce((count, post) => count + (post.media?.length || 0), 0), icon: FiImage },
    { label: 'Comments', value: user?.comments_count ?? 0, icon: FiBarChart2 },
  ];

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: '360px' },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoadingUser) return <ProfileSkeleton />;

  if (isUserError || !user) {
    return (
      <PageTransition>
        <motion.div className="max-w-xl p-8 mx-auto text-center glass-panel rounded-3xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FiLock className="mx-auto mb-4 text-4xl text-memory-danger" />
          <h1 className="mb-2 text-2xl font-bold">Profile unavailable</h1>
          <p className="text-memory-muted">The API did not return a profile for this wall.</p>
        </motion.div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-6xl pb-16 mx-auto">
        <section ref={heroRef} className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/70 shadow-card">
          {user.cover_photo ? (
            <motion.img style={{ y: heroY, scale: heroScale }} src={user.cover_photo} className="absolute inset-0 object-cover w-full h-[120%]" alt="" />
          ) : (
            <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(142,202,230,0.65),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(149,213,178,0.55),transparent_28%),linear-gradient(135deg,#FEF9F0_0%,#F8DCC0_48%,#E76F51_100%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-memory-text/75 via-memory-text/18 to-white/5" />

          <motion.div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9" variants={listVariants} initial="hidden" animate="show">
            <motion.div variants={itemVariants} className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <motion.img
                src={getAvatar(user.name, user.avatar)}
                className="object-cover border-4 rounded-full shadow-2xl size-32 border-white/90 sm:size-40"
                initial={{ scale: 0.25, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 170, damping: 18 }}
                whileHover={{ scale: 1.04, rotate: 1 }}
                alt=""
              />
              <div className="flex-1 text-white">
                <motion.div variants={itemVariants} className={`relative inline-flex items-center gap-2 px-3 py-1.5 mb-3 text-sm font-bold border rounded-full ${role.badge}`}>
                  <span className={`absolute rounded-full -inset-1 opacity-20 blur-md ${role.pulse}`} />
                  <RoleIcon className="relative" />
                  <span className="relative">{role.label}</span>
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-4xl font-bold text-white sm:text-6xl">
                  {user.name}
                </motion.h1>
                <motion.p variants={itemVariants} className="max-w-2xl mt-3 text-sm leading-6 text-white/82 sm:text-base">
                  {user.bio || 'This memory wall is waiting for its first personal note.'}
                </motion.p>
              </div>
              {isOwner && (
                <motion.button onClick={() => setIsEditOpen(true)} className="inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white border rounded-full bg-white/15 border-white/35 backdrop-blur-md" whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.95 }}>
                  <FiEdit3 />
                  Edit Profile
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </section>

        <motion.section variants={listVariants} initial="hidden" animate="show" className="grid gap-6 mt-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="p-6 glass-panel rounded-3xl">
              <h2 className="mb-4 text-xl font-bold">Profile Stats</h2>
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <motion.div key={stat.label} className="p-4 text-center transition bg-white border border-memory-border rounded-2xl" whileHover={{ y: -6, boxShadow: '0 16px 45px rgba(244,162,97,0.18)' }}>
                      <StatIcon className="mx-auto mb-2 text-amber-deep" />
                      <div className="text-2xl font-black text-memory-text"><AnimatedCounter value={stat.value} /></div>
                      <div className="text-xs font-semibold text-memory-muted">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="p-6 glass-panel rounded-3xl">
              {isStudent && (
                <Link to="/create" className="flex items-center justify-between gap-4 p-4 text-white transition bg-amber-gradient rounded-2xl shadow-warm">
                  <span className="font-bold">Create Memory</span>
                  <motion.span className="grid bg-white rounded-full size-10 place-items-center text-amber-deep" whileHover={{ rotate: 90, scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                    <FiPlus />
                  </motion.span>
                </Link>
              )}
              {roleKey === 'user' && (
                <motion.div className="flex items-center gap-4 p-4 border border-gray-200 bg-gray-50 rounded-2xl" initial={{ opacity: 0.6 }} animate={{ opacity: 1 }}>
                  <motion.div className="grid bg-white rounded-full shadow-card size-11 place-items-center text-memory-muted" animate={{ rotate: [0, -4, 4, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
                    <FiLock />
                  </motion.div>
                  <div>
                    <p className="font-bold">Only students can share memories</p>
                    <p className="text-sm text-memory-muted">You can still explore and react to the wall.</p>
                  </div>
                </motion.div>
              )}
              {isAdmin && (
                <Link to="/members" className="flex items-center justify-between gap-4 p-4 text-red-600 border border-red-100 bg-red-50 rounded-2xl">
                  <span className="font-bold">User Management</span>
                  <motion.span className="grid bg-white rounded-full shadow-card size-10 place-items-center" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                    <FiUsers />
                  </motion.span>
                </Link>
              )}
            </motion.div>
          </div>

          <div className="space-y-5">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Memories</h2>
                <p className="text-sm text-memory-muted">A living archive, straight from the API.</p>
              </div>
            </motion.div>

            {isLoadingPosts ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="h-64 rounded-3xl bg-gradient-to-r from-white via-cream-100 to-white bg-[length:200%_100%] animate-shimmer" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <motion.div className="p-10 text-center glass-panel rounded-3xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <FiGrid className="mx-auto mb-4 text-4xl text-amber-warm" />
                <h3 className="mb-2 text-xl font-bold">No memories yet</h3>
                <p className="text-memory-muted">When this profile shares a memory, it will appear here.</p>
              </motion.div>
            ) : (
              <motion.div variants={listVariants} initial="hidden" animate="show" className="gap-5 columns-1 sm:columns-2">
                {posts.map((post) => (
                  <motion.div key={post.id} variants={itemVariants} className="mb-5 break-inside-avoid" whileHover={{ y: -5 }}>
                    <MemoryCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div ref={loadMoreRef} className="h-8" />
            <AnimatePresence>
              {isFetchingNextPage && (
                <motion.div className="h-28 rounded-3xl bg-gradient-to-r from-white via-cream-100 to-white bg-[length:200%_100%] animate-shimmer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {isStudent && (
          <motion.div className="fixed z-40 bottom-24 right-5 md:bottom-8 md:right-8" initial={{ scale: 0, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 16 }}>
            <Link to="/create" className="grid text-white rounded-full shadow-2xl size-16 place-items-center bg-amber-gradient">
              <motion.span animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
                <FiPlus className="text-2xl" />
              </motion.span>
            </Link>
          </motion.div>
        )}

        {isEditOpen && (
          <EditProfileModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            user={user}
            profileId={profileId}
            onSaved={(updatedUser) => {
              if (isOwner) setUser((prev) => ({ ...prev, ...updatedUser }));
            }}
          />
        )}
      </div>
    </PageTransition>
  );
}
