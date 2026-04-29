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
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleToggleReaction = async () => {
    const previousReaction = myReaction;
    const previousCount = reactionsCount;

    // Optimistic UI
    if (myReaction) {
      setMyReaction(null);
      setReactionsCount(prev => prev - 1);
    } else {
      setMyReaction('like');
      setReactionsCount(prev => prev + 1);
    }

    try {
      await reactionService.toggleReaction(post.id, 'like');
    } catch (error) {
      setMyReaction(previousReaction);
      setReactionsCount(previousCount);
      toast.error('Failed to update reaction.');
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      setShowComments(true);
      if (comments.length === 0) {
        setIsLoadingComments(true);
        try {
          const response = await commentService.getComments(post.id);
          setComments(response.data || response);
        } catch (error) {
          toast.error('Failed to load comments.');
        } finally {
          setIsLoadingComments(false);
        }
      }
    } else {
      setShowComments(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const response = await commentService.createComment(post.id, newComment);
      const addedComment = response.data || response;
      setComments([addedComment, ...comments]);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (error) {
      toast.error('Failed to post comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 mb-6 overflow-hidden glass-panel rounded-3xl"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={post.user?.avatar || 'https://ui-avatars.com/api/?name=' + post.user?.name} 
            alt={post.user?.name} 
            className="object-cover w-12 h-12 border-2 border-white rounded-full shadow-sm"
          />
          <div>
            <h3 className="font-semibold text-memory-text">{post.user?.name}</h3>
            <p className="text-xs text-memory-muted">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <button className="p-2 transition-colors text-memory-muted hover:text-memory-text">
          <FiMoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="whitespace-pre-wrap text-memory-text leading-relaxed">{post.content}</p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className={`grid gap-2 mb-4 ${post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.media.map((item, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl overflow-hidden shadow-sm ${post.media.length === 1 ? 'aspect-video' : 'aspect-square'}`}
            >
              <img 
                src={item.url} 
                alt="Memory media" 
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between py-3 border-t border-memory-border">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleToggleReaction}
            className={`flex items-center gap-2 transition-colors ${myReaction ? 'text-memory-danger' : 'text-memory-muted hover:text-memory-danger'}`}
          >
            <motion.div whileTap={{ scale: 0.8 }}>
              <FiHeart className={`w-5 h-5 ${myReaction ? 'fill-current' : ''}`} />
            </motion.div>
            <span className="text-sm font-medium">{reactionsCount}</span>
          </button>
          
          <button 
            onClick={loadComments}
            className="flex items-center gap-2 transition-colors text-memory-muted hover:text-memory-text"
          >
            <FiMessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments_count}</span>
          </button>
        </div>
        
        <button className="transition-colors text-memory-muted hover:text-amber-warm">
          <FiShare2 className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4 border-t border-memory-border">
              {isLoadingComments ? (
                <div className="py-4 text-center">
                  <div className="w-6 h-6 border-2 border-amber-warm border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <img 
                          src={comment.user?.avatar || 'https://ui-avatars.com/api/?name=' + comment.user?.name} 
                          alt="" 
                          className="object-cover w-8 h-8 rounded-full border border-memory-border" 
                        />
                        <div className="flex-1 p-3 bg-cream-50/50 rounded-2xl border border-memory-border/50">
                          <p className="text-xs font-bold text-memory-text">{comment.user?.name}</p>
                          <p className="mt-1 text-sm text-memory-text">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <p className="text-center text-xs text-memory-muted py-2">No comments yet. Be the first to reply!</p>
                    )}
                  </div>
                  
                  <form onSubmit={handlePostComment} className="flex items-center gap-3 mt-4">
                    <img 
                      src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=' + currentUser?.name} 
                      alt="" 
                      className="object-cover w-8 h-8 rounded-full border border-memory-border" 
                    />
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..." 
                        className="w-full py-2.5 pl-4 pr-10 text-sm transition-all bg-white border rounded-full border-memory-border focus:outline-none focus:ring-2 focus:ring-amber-warm/30 focus:border-amber-warm"
                      />
                      <button 
                        type="submit"
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="absolute -translate-y-1/2 right-3 top-1/2 text-amber-warm hover:text-amber-deep disabled:text-memory-muted transition-colors"
                      >
                        {isSubmittingComment ? (
                          <div className="w-4 h-4 border-2 border-amber-warm border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiSend className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
