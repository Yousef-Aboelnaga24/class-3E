import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RiHeart3Line, RiHeart3Fill, RiUserLine, RiEyeOffLine, RiSendPlane2Line, RiLockLine } from 'react-icons/ri'
import { confessionSchema } from '../../lib/schemas'
import { AnimatedPage, staggerContainer, staggerItem } from '../../lib/motionVariants'
import { MOCK_CONFESSIONS, MOCK_USERS } from '../../api/mockData'
import Avatar from '../../components/ui/Avatar'
import { timeAgo } from '../../lib/utils'
import { useAuth } from '../../auth/AuthContext'
import toast from 'react-hot-toast'
import EmptyState from '../../components/common/EmptyState'

function ConfessionCard({ confession, index }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(confession.reactions)
  const gradientClass = confession.gradient || `confession-card-${(index % 6) + 1}`

  const handleLike = () => {
    setLiked(!liked)
    setCount((c) => c + (liked ? -1 : 1))
    if (!liked) toast.success('💝')
  }

  return (
    <motion.div variants={staggerItem}>
      <div className={`${gradientClass} rounded-3xl p-5 relative overflow-hidden group`}>
        {/* Decorative blob */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />

        {confession.is_anonymous ? (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
              <RiEyeOffLine size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white/80">Anonymous</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-3">
            <Avatar name={confession.author?.name} size="xs" ring />
            <span className="text-sm font-semibold text-white/90">{confession.author?.name}</span>
          </div>
        )}

        <p className="text-sm text-white/90 leading-relaxed font-medium relative z-10">
          {confession.content}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-white/60">{timeAgo(confession.created_at)}</span>
          <motion.button
            whileTap={{ scale: 1.4 }}
            onClick={handleLike}
            className="flex items-center gap-1.5 bg-white/30 hover:bg-white/40 rounded-full px-3 py-1.5 transition-all"
          >
            {liked
              ? <RiHeart3Fill size={15} className="text-red-400" />
              : <RiHeart3Line size={15} className="text-white" />
            }
            <span className="text-xs font-semibold text-white">{count}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Confessions() {
  const { user } = useAuth()
  const [confessions, setConfessions] = useState(MOCK_CONFESSIONS)
  const [submitting, setSubmitting] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(true)

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
    resolver: zodResolver(confessionSchema),
    defaultValues: { content: '', is_anonymous: true },
  })

  const content = watch('content')

  const onSubmit = async (data) => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    const newConf = {
      id: Date.now(),
      content: data.content,
      is_anonymous: isAnonymous,
      author: isAnonymous ? null : user,
      reactions: 0,
      created_at: new Date().toISOString(),
      gradient: `confession-card-${((confessions.length) % 6) + 1}`,
    }
    setConfessions((prev) => [newConf, ...prev])
    reset()
    setSubmitting(false)
    toast.success(isAnonymous ? 'Confession posted anonymously 🎭' : 'Confession posted! 💬')
  }

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-memory-text">Confession Wall</h1>
        <p className="text-memory-muted text-sm mt-1">
          The things we never said — but always meant 🎭
        </p>
      </div>

      {/* Submit form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-memory-text">Share a Confession</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-memory-muted">
              {isAnonymous ? '🎭 Anonymous' : '👤 Named'}
            </span>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300
                ${isAnonymous ? 'bg-amber-warm' : 'bg-cream-200 border border-memory-border'}`}
            >
              <motion.div
                layout
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all
                  ${isAnonymous ? 'left-7' : 'left-1'}`}
              />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {!isAnonymous && (
            <div className="flex items-center gap-2 text-xs text-memory-muted">
              <Avatar name={user?.name} size="xs" />
              Posting as <span className="font-semibold text-memory-text">{user?.name}</span>
            </div>
          )}

          <div className="relative">
            <textarea
              {...register('content')}
              placeholder={isAnonymous
                ? "Share something you've always wanted to say... 🎭"
                : "Share a heartfelt message with your classmates 💬"
              }
              rows={3}
              className="input resize-none text-sm"
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            <div className="absolute bottom-3 right-3 text-xs text-memory-muted">
              {500 - (content?.length || 0)}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <RiSendPlane2Line size={16} />
            {submitting ? 'Posting...' : isAnonymous ? 'Post Anonymously 🎭' : 'Post Confession 💬'}
          </motion.button>
        </form>
      </motion.div>

      {/* Confessions wall */}
      {confessions.length === 0 ? (
        <EmptyState emoji="🎭" title="No confessions yet" description="Be the first to share something!" />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {confessions.map((c, idx) => (
            <ConfessionCard key={c.id} confession={c} index={idx} />
          ))}
        </motion.div>
      )}
    </AnimatedPage>
  )
}
