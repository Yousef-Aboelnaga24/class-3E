import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiSend } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import reactionService from '../services/reactionService';
import commentService from '../services/commentService';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function MemoryCard({ post }) {
  const { user: currentUser } = useAuth();

  const [myReaction, setMyReaction] = useState(post.my_reaction);
  const [reactionsCount, setReactionsCount] = useState(post.reactions_count);
  const [heartBurst, setHeartBurst] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // ❤️ Reaction Toggle
  const handleToggleReaction = async () => {
    const previousReaction = myReaction;
    const previousCount = reactionsCount;

    // optimistic update
    const nextReaction = myReaction ? null : 'like';

    setMyReaction(nextReaction);
    setReactionsCount(prev =>
      nextReaction ? prev + 1 : prev - 1
    );
    if (nextReaction) {
      setHeartBurst(true);
      window.setTimeout(() => setHeartBurst(false), 520);
    }

    try {
      await reactionService.toggleReaction(post.id, 'like');
    } catch (error) {
      setMyReaction(previousReaction);
      setReactionsCount(previousCount);
      toast.error('Failed to update reaction.');
    }
  };

  // 💬 Fetch comments
  const fetchComments = async () => {
    setIsLoadingComments(true);

    try {
      const response = await commentService.getComments(post.id);

      // normalize response (important 🔥)
      const data =
        response?.data?.data ||
        response?.data ||
        response?.comments ||
        response;

      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load comments.');
      setComments([]); // safety fallback
    } finally {
      setIsLoadingComments(false);
    }
  };

  // 💬 Toggle comments
  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);

    if (comments.length === 0) {
      await fetchComments();
    }
  };

  // ✍️ Post comment
  const handlePostComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);

    // optimistic comment
    const tempComment = {
      id: Date.now(),
      content: newComment,
      user: currentUser,
    };

    setComments(prev => [tempComment, ...prev]);
    setNewComment('');

    try {
      const response = await commentService.createComment(post.id, newComment);

      const realComment = response;

      setComments(prev =>
        prev.map(c => (c.id === tempComment.id ? realComment : c))
      );

      toast.success('Comment posted!');
    } catch (error) {
      setComments(prev => prev.filter(c => c.id !== tempComment.id));
      toast.error('Failed to post comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: '0 18px 50px rgba(61, 43, 31, 0.13)' }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      className="p-5 mb-6 glass-panel rounded-3xl"
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={
              post.user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.name || '')}`
            }
            className="object-cover w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{post.user?.name}</h3>
            <p className="text-xs text-gray-500">
              {post.created_at &&
                formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        <motion.button whileHover={{ rotate: 90, scale: 1.08 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-500 rounded-full hover:bg-white">
          <FiMoreHorizontal />
        </motion.button>
      </div>

      {/* Content */}
      <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Media */}
      {post.media?.length > 0 && (
        <div className="grid gap-2 mb-4">
          {post.media.map((item) => (
            <img
              key={item.id}
              src={item.file_path}
              className="object-cover w-full rounded-xl"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t">

        {/* Reaction */}
        <motion.button
          onClick={handleToggleReaction}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className={`flex items-center gap-2 ${myReaction ? 'text-red-500' : 'text-gray-500'
            } relative`}
        >
          <motion.span animate={myReaction ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.35 }} className="relative">
            <FiHeart className={myReaction ? 'fill-current' : ''} />
            <AnimatePresence>
              {heartBurst && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-red-400/30"
                  initial={{ scale: 0.4, opacity: 0.9 }}
                  animate={{ scale: 2.6, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>
          </motion.span>
          <motion.span key={reactionsCount} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            {reactionsCount}
          </motion.span>
        </motion.button>

        {/* Comments */}
        <motion.button
          onClick={loadComments}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 text-gray-500"
        >
          <FiMessageCircle />
          {post.comments_count}
        </motion.button>

        <motion.button whileHover={{ x: 4, y: -2, scale: 1.08 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-500 rounded-full hover:bg-white">
          <FiShare2 />
        </motion.button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4"
          >

            {isLoadingComments ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-60">

                {comments.map(comment => (
                  <motion.div key={comment.id} className="flex gap-2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                    <img
                      src={
                        comment.user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || '')}`
                      }
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="p-2 text-sm bg-gray-100 rounded-xl">
                      <b>{comment.user?.name}</b>
                      <p>{comment.content}</p>
                    </div>
                  </motion.div>
                ))}

              </div>
            )}

            {/* Add comment */}
            <form onSubmit={handlePostComment} className="flex gap-2 mt-3">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 text-sm border rounded-full"
              />

              <motion.button
                disabled={isSubmittingComment}
                className="text-amber-600"
                whileHover={{ scale: 1.12, x: 2 }}
                whileTap={{ scale: 0.9 }}
              >
                {isSubmittingComment ? '...' : <FiSend />}
              </motion.button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
