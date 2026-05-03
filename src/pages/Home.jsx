import { lazy, Suspense, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import {PageTransition} from '../components/layout/PageTransition';
import MemoryCard from '../components/MemoryCard';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../auth/AuthContext';
import { FiArrowUpRight, FiCamera, FiClock, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ClassOrbit = lazy(() => import('../components/visuals/ClassOrbit'));

export default function Home() {
  const { data: postsData, isLoading, error } = usePosts();
  const { user } = useAuth();
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-pop',
        { opacity: 0, y: 28, rotateX: -12, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.08,
          ease: 'back.out(1.35)',
        }
      );

      gsap.to('.gsap-drift', {
        y: -12,
        rotate: 1.5,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.18,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl pt-12 mx-auto space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-6 glass-panel rounded-3xl animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cream-200"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 rounded bg-cream-200"></div>
                <div className="w-20 h-3 rounded bg-cream-200"></div>
              </div>
            </div>
            <div className="w-full h-24 mb-4 bg-cream-100 rounded-xl"></div>
            <div className="w-full h-48 bg-cream-200 rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-memory-danger">Failed to load memories. Please try again later.</p>
      </div>
    );
  }

  const posts = postsData?.data || [];
  const featuredPosts = posts.slice(0, 3);
  const mediaCount = posts.reduce((count, post) => count + (post.media?.length || 0), 0);
  const role = String(user?.role || 'user').toLowerCase();
  const canCreate = role === 'student' || role === 'admin';

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl">
        <motion.div 
          ref={heroRef}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="hero-shell mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/72 shadow-[0_28px_90px_rgba(37,99,235,0.18)] backdrop-blur-xl"
        >
          <div className="grid min-h-[380px] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <div className="gsap-pop mb-5 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/66 px-3 py-1 text-sm font-bold text-amber-deep shadow-card backdrop-blur-xl">
                  <span className="h-2 w-2 rounded-full bg-sage-soft shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
                  Class 3E cosmic feed
                </div>
                <h1 className="gsap-pop neon-text max-w-xl text-4xl font-black leading-tight text-memory-text sm:text-6xl">
                  Memories, but make it electric.
                </h1>
                <p className="gsap-pop mt-4 max-w-2xl text-base leading-7 text-memory-muted sm:text-lg">
                  3E got a neon universe now: posts, photos, confessions, and class moments moving like a digital yearbook from the future.
                </p>
              </div>

              <div className="gsap-pop mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                {canCreate && (
                  <Link to="/create" className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl">
                    Launch memory
                    <FiArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
                <Link to="/gallery" className="btn-secondary inline-flex items-center justify-center gap-2 rounded-2xl">
                  Enter gallery
                  <FiCamera className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="cosmic-panel relative min-h-[320px] overflow-hidden">
              <Suspense fallback={<div className="h-full min-h-[220px] w-full" />}>
                <ClassOrbit />
              </Suspense>
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'Posts', value: posts.length, icon: FiClock },
                  { label: 'Media', value: mediaCount, icon: FiCamera },
                  { label: 'Active', value: featuredPosts.length, icon: FiUsers },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="holo-card gsap-drift rounded-2xl border border-white/25 bg-white/16 p-3 text-white shadow-[0_12px_40px_rgba(37,99,235,0.18)] backdrop-blur-md">
                      <Icon className="mb-2 h-4 w-4 text-sky-soft" />
                      <p className="text-lg font-black leading-none">{item.value}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-indigo-100/76">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <MemoryCard key={post.id} post={post} />
              ))
            ) : (
              <div className="rounded-[2rem] border border-dashed border-memory-border bg-white/70 px-6 py-14 text-center shadow-card backdrop-blur">
                <p className="font-medium text-memory-muted">No memories shared yet. Be the first!</p>
              </div>
            )}
          </div>

          <aside className="hidden space-y-4 lg:block">
            <div className="sticky top-8 space-y-4">
              <div className="rounded-[1.5rem] border border-white/70 bg-white/74 p-5 shadow-card backdrop-blur-xl">
                <h2 className="text-lg font-bold text-memory-text">Latest highlights</h2>
                <div className="mt-4 space-y-3">
                  {featuredPosts.length > 0 ? (
                    featuredPosts.map((post) => (
                      <div key={post.id} className="rounded-2xl border border-memory-border/70 bg-cream-50/80 p-3">
                        <p className="line-clamp-2 text-sm font-medium text-memory-text">
                          {post.content || 'Photo memory'}
                        </p>
                        <p className="mt-2 text-xs text-memory-muted">{post.user?.name || 'Classmate'}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-memory-muted">Highlights will appear as memories are shared.</p>
                  )}
                </div>
              </div>

              <div className="cosmic-panel rounded-[1.5rem] border border-white/20 p-5 text-white shadow-card">
                <p className="text-sm font-semibold uppercase tracking-wide text-memory-muted">Class pulse</p>
                <p className="mt-2 text-2xl font-bold text-white">{posts.length ? 'Fresh stories' : 'Quiet for now'}</p>
                <p className="mt-2 text-sm leading-6 text-indigo-100/72">
                  The feed updates as classmates post new memories, comments, and photos.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
