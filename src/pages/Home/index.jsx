import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import PostCard from '../../components/feed/PostCard'
import { PostSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import { AnimatedPage, staggerContainer, staggerItem } from '../../lib/motionVariants'
import { MOCK_POSTS } from '../../api/mockData'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import Avatar from '../../components/ui/Avatar'
import { RiAddCircleLine, RiSparklingLine } from 'react-icons/ri'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loaderRef = useRef(null)

  // Simulated fetch
  const fetchPosts = async (p = 1) => {
    await new Promise((r) => setTimeout(r, 800))
    const perPage = 3
    const start = (p - 1) * perPage
    const slice = MOCK_POSTS.slice(start, start + perPage)
    return { data: slice, hasMore: start + perPage < MOCK_POSTS.length }
  }

  useEffect(() => {
    fetchPosts(1).then(({ data, hasMore }) => {
      setPosts(data)
      setHasMore(hasMore)
      setLoading(false)
    })
  }, [])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true)
          const nextPage = page + 1
          fetchPosts(nextPage).then(({ data, hasMore: more }) => {
            setPosts((prev) => [...prev, ...data])
            setPage(nextPage)
            setHasMore(more)
            setLoadingMore(false)
          })
        }
      },
      { threshold: 0.1 }
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, page])

  return (
    <AnimatedPage className="space-y-6">
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-amber-gradient p-6 text-white shadow-warm"
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Good memories,</p>
              <h1 className="font-display text-2xl font-bold mt-0.5">Class 3E ✨</h1>
              <p className="text-white/80 text-sm mt-2 max-w-xs">
                Every moment you shared, every laugh, every tear — it all lives here.
              </p>
            </div>
            <div className="text-5xl select-none">📸</div>
          </div>
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-white font-bold text-xl">{MOCK_POSTS.length}</p>
              <p className="text-white/70 text-xs">Memories</p>
            </div>
            <div>
              <p className="text-white font-bold text-xl">8</p>
              <p className="text-white/70 text-xs">Classmates</p>
            </div>
            <div>
              <p className="text-white font-bold text-xl">7</p>
              <p className="text-white/70 text-xs">Milestones</p>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -right-4 w-32 h-32 rounded-full bg-white/5" />
      </motion.div>

      {/* Quick post box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} src={user?.avatar} size="md" />
          <button
            onClick={() => navigate('/create')}
            className="flex-1 text-left px-4 py-2.5 bg-cream-100 rounded-xl text-sm text-memory-muted
                       hover:bg-cream-200 transition-all cursor-text"
          >
            What memory do you want to share? ✨
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="p-2.5 rounded-xl bg-amber-gradient text-white shadow-warm"
          >
            <RiAddCircleLine size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Feed */}
      <div className="space-y-4">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <EmptyState
            emoji="📭"
            title="No memories yet"
            description="Be the first to share a memory with your classmates!"
            action={
              <button onClick={() => navigate('/create')} className="btn-primary">
                Share First Memory
              </button>
            }
          />
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            {posts.map((post) => (
              <motion.div key={post.id} variants={staggerItem}>
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={loaderRef} className="h-4">
          {loadingMore && (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 rounded-full border-2 border-amber-warm border-t-transparent animate-spin" />
            </div>
          )}
        </div>

        {!hasMore && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-memory-muted text-sm">
              🌟 You've reached the beginning of your memories
            </p>
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  )
}
