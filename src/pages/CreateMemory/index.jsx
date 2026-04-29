import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import EmojiPicker from 'emoji-picker-react'
import { RiSmileLine, RiCloseLine, RiImageLine } from 'react-icons/ri'
import { postSchema } from '../../lib/schemas'
import DropzoneUpload from '../../components/media/DropzoneUpload'
import { AnimatedPage } from '../../lib/motionVariants'
import { useAuth } from '../../auth/AuthContext'
import Avatar from '../../components/ui/Avatar'
import toast from 'react-hot-toast'
import { MOCK_POSTS } from '../../api/mockData'

export default function CreateMemory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showEmoji, setShowEmoji] = useState(false)
  const [files, setFiles] = useState([])
  const [showDropzone, setShowDropzone] = useState(false)
  const textareaRef = useRef(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: { content: '' },
  })

  const content = watch('content')
  const MAX = 2000
  const remaining = MAX - (content?.length || 0)

  const onEmojiClick = (emojiData) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newVal = content.slice(0, start) + emojiData.emoji + content.slice(end)
    setValue('content', newVal)
    setShowEmoji(false)
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emojiData.emoji.length
      textarea.focus()
    }, 0)
  }

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Memory shared! 🎉', { icon: '📸' })
    navigate('/')
  }

  return (
    <AnimatedPage>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-memory-text">Share a Memory</h1>
          <p className="text-memory-muted text-sm mt-1">Every moment is worth preserving ✨</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          {/* User row */}
          <div className="flex items-center gap-3 mb-5">
            <Avatar name={user?.name} src={user?.avatar} size="md" />
            <div>
              <p className="font-semibold text-sm text-memory-text">{user?.name}</p>
              <p className="text-xs text-memory-muted">Sharing to Class 3E</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Content textarea */}
            <div className="relative">
              <textarea
                {...register('content')}
                ref={(el) => {
                  register('content').ref(el)
                  textareaRef.current = el
                }}
                placeholder="What memory do you want to share? Tell us the story... 💭"
                rows={5}
                className="input resize-none text-sm leading-relaxed"
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
              )}

              {/* Character counter */}
              <div className={`absolute bottom-3 right-3 text-xs font-medium transition-colors
                ${remaining < 100 ? 'text-red-500' : 'text-memory-muted'}`}>
                {remaining}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 pb-1">
              <button
                type="button"
                onClick={() => setShowDropzone(!showDropzone)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${showDropzone ? 'bg-amber-warm/10 text-amber-warm' : 'btn-ghost'}`}
              >
                <RiImageLine size={18} />
                Photos & Videos
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmoji(!showEmoji)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${showEmoji ? 'bg-amber-warm/10 text-amber-warm' : 'btn-ghost'}`}
                >
                  <RiSmileLine size={18} />
                  Emoji
                </button>
                <AnimatePresence>
                  {showEmoji && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute bottom-full mb-2 left-0 z-30"
                    >
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        width={320}
                        height={380}
                        searchPlaceholder="Search emoji..."
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Dropzone */}
            <AnimatePresence>
              {showDropzone && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <DropzoneUpload onFilesChange={setFiles} maxFiles={10} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="border-t border-memory-border" />

            {/* Submit */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-memory-muted">
                {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} attached` : 'No files attached'}
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                >
                  Share Memory 📸
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Tips card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 p-4 bg-sky-soft/20 rounded-2xl border border-sky-soft/30"
        >
          <p className="text-xs font-semibold text-memory-text mb-2">💡 Memory Tips</p>
          <ul className="text-xs text-memory-muted space-y-1 list-disc list-inside">
            <li>Be specific — mention names, places, feelings</li>
            <li>Add photos to make it more vivid</li>
            <li>Use emojis to set the mood 😊</li>
            <li>Tag the moment that made it special</li>
          </ul>
        </motion.div>
      </div>
    </AnimatedPage>
  )
}
