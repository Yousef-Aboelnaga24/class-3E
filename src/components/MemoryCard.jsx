import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiEdit3, FiHeart, FiMessageCircle, FiMoreHorizontal, FiSend, FiShare2, FiTrash2, FiX } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import reactionService from '../services/reactionService';
import commentService from '../services/commentService';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useDeletePost, useUpdatePost } from '../hooks/usePosts';

function isVideoFile(item) {
  return item.file_path?.toLowerCase().endsWith('.mp4');
}

function mediaGridClass(count) {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  return 'grid-cols-2 grid-rows-2';
}

function mediaTileClass(count, index) {
  if (count === 1) return 'aspect-[16/10]';
  if (count === 2) return 'aspect-[4/5]';
  if (count === 3 && index === 0) return 'row-span-2 aspect-auto';
  if (count >= 4 && index === 0) return 'row-span-2 aspect-auto';
  return 'aspect-square';
}

export default function MemoryCard({ post }) {
  const { user: currentUser } = useAuth();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  const [content, setContent] = useState(post.content || '');
  const [draftContent, setDraftContent] = useState(post.content || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [myReaction, setMyReaction] = useState(post.my_reaction);
  const [reactionsCount, setReactionsCount] = useState(post.reactions_count);
  const [heartBurst, setHeartBurst] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const currentRole = String(currentUser?.role || 'user').toLowerCase();
  const isOwner = currentUser?.id && String(currentUser.id) === String(post.user?.id);
  const isAdmin = currentRole === 'admin';
  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;

  useEffect(() => {
    setContent(post.content || '');
    setDraftContent(post.content || '');
    setIsEditing(false);
    setShowMenu(false);
  }, [post.id, post.content]);

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
    } catch {
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
    } catch {
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
      id: `temp-${post.id}-${comments.length + 1}`,
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
    } catch {
      setComments(prev => prev.filter(c => c.id !== tempComment.id));
      toast.error('Failed to post comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleStartEdit = () => {
    setDraftContent(content);
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleCancelEdit = () => {
    setDraftContent(content);
    setIsEditing(false);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    const nextContent = draftContent.trim();
    if (!nextContent) {
      toast.error('Memory content cannot be empty.');
      return;
    }

    try {
      await updatePost.mutateAsync({
        id: post.id,
        data: { content: nextContent },
      });
      setContent(nextContent);
      setIsEditing(false);
    } catch {
      // Mutation hook already shows the API error.
    }
  };

  const handleDeletePost = () => {
    setShowMenu(false);
    if (!window.confirm('Delete this memory?')) return;
    deletePost.mutate(post.id);
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

        {(canEdit || canDelete) && (
          <div className="relative">
            <motion.button
              type="button"
              onClick={() => setShowMenu((value) => !value)}
              whileHover={{ rotate: 90, scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-500 rounded-full hover:bg-white"
              aria-label="Post actions"
            >
              <FiMoreHorizontal />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="absolute right-0 z-20 mt-2 w-36 overflow-hidden rounded-2xl border border-memory-border bg-white shadow-card"
                >
                  {canEdit && (
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-memory-text hover:bg-cream-50"
                    >
                      <FiEdit3 />
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={handleDeletePost}
                      disabled={deletePost.isPending}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-memory-danger hover:bg-red-50"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="mb-4 space-y-3">
          <textarea
            value={draftContent}
            onChange={(event) => setDraftContent(event.target.value)}
            className="min-h-28 w-full resize-none rounded-2xl border border-memory-border bg-white/70 p-4 text-memory-text outline-none transition focus:border-amber-warm focus:ring-2 focus:ring-amber-warm/40"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-2 rounded-full border border-memory-border bg-white px-4 py-2 text-sm font-semibold text-memory-muted"
            >
              <FiX />
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatePost.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-amber-gradient px-4 py-2 text-sm font-semibold text-white shadow-warm"
            >
              {updatePost.isPending ? (
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <FiCheck />
              )}
              Save
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-4 whitespace-pre-wrap">{content}</p>
      )}

      {/* Media */}
      {post.media?.length > 0 && (
        <div className={`mb-4 grid h-[360px] gap-2 overflow-hidden rounded-[1.35rem] ${mediaGridClass(Math.min(post.media.length, 5))}`}>
          {post.media.slice(0, 5).map((item, index) => {
            const isVideo = isVideoFile(item);
            const hiddenCount = post.media.length - 5;

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.025 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className={`group relative min-h-0 overflow-hidden rounded-2xl bg-[#101632] ${mediaTileClass(Math.min(post.media.length, 5), index)}`}
              >
                {isVideo ? (
                  <video controls className="h-full w-full object-cover">
                    <source src={item.file_path} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={item.file_path}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt="post media"
                  />
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101632]/42 via-transparent to-white/10 opacity-70" />

                {index === 4 && hiddenCount > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#101632]/72 text-3xl font-black text-white backdrop-blur-sm">
                    +{hiddenCount}
                  </div>
                )}
              </motion.div>
            );
          })}
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
