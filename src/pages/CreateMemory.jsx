import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiSmile, FiX, FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';
import { useCreatePost } from '../hooks/usePosts';
import { PageTransition } from '../components/layout/PageTransition';
import { useAuth } from '../auth/AuthContext';

const createMemorySchema = z.object({
  content: z.string().min(1, 'Memory content cannot be empty'),
});

export default function CreateMemory() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createPost } = useCreatePost();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createMemorySchema),
    defaultValues: { content: '' }
  });

  const contentValue = useWatch({ control, name: 'content' }) || '';
  const role = String(user?.role || 'user').toLowerCase();
  const canCreate = role === 'student' || role === 'admin';

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm']
    },
    maxSize: 10485760, // 10MB
  });

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
    // URL.revokeObjectURL(fileToRemove.preview); // Don't revoke here if we might still need it for rendering before it's removed
  };

  const onEmojiClick = (emojiObject) => {
    setValue('content', contentValue + emojiObject.emoji, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    if (!canCreate) {
      toast.error('Only students can share memories.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', data.content);

      files.forEach((file) => {
        formData.append('media[]', file);
      });

      await createPost(formData);
      navigate('/');
    } catch {
      // toast is handled by useCreatePost
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canCreate) {
    return (
      <PageTransition>
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="p-8 text-center glass-panel rounded-3xl"
          >
            <motion.div
              animate={{ rotate: [0, -4, 4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="flex items-center justify-center w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 text-memory-muted"
            >
              <FiX className="w-7 h-7" />
            </motion.div>
            <h1 className="mb-2 text-2xl font-bold font-display text-memory-text">Only students can share memories</h1>
            <p className="text-memory-muted">Your account can read and react to the wall, but posting is reserved for students.</p>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold font-display text-memory-text">New Memory</h1>
          <p className="mt-1 text-memory-muted">Share a special moment with the class.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 glass-panel rounded-3xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Text Input */}
            <div className="relative">
              <textarea
                {...register('content')}
                rows={5}
                placeholder="What's on your mind? Share a story, a joke, or a feeling..."
                className={`w-full bg-white/50 border ${errors.content ? 'border-memory-danger focus:ring-memory-danger' : 'border-memory-border focus:ring-amber-warm focus:border-amber-warm'} rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 transition-all text-memory-text placeholder:text-memory-muted/70 text-lg`}
              />

              <div className="absolute bottom-4 right-4">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 transition-colors rounded-full text-memory-muted hover:text-amber-warm hover:bg-white"
                >
                  <FiSmile className="w-6 h-6" />
                </button>

                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 z-50 overflow-hidden bottom-12 shadow-card rounded-2xl"
                    >
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        theme="light"
                        searchDisabled={true}
                        skinTonesDisabled={true}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {errors.content && (
              <p className="mt-1 text-sm text-memory-danger">{errors.content.message}</p>
            )}

            {/* Media Upload (Dropzone) */}
            <div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive
                    ? 'border-amber-warm bg-amber-warm/5 scale-[1.02]'
                    : 'border-memory-border hover:border-amber-warm/50 hover:bg-white/50'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-warm/10 text-amber-warm">
                  <FiImage className="w-8 h-8" />
                </div>
                <p className="mb-1 font-medium text-memory-text">
                  {isDragActive ? "Drop the files here..." : "Drag & drop photos/videos here"}
                </p>
                <p className="text-sm text-memory-muted">or click to browse your files (max 10MB)</p>
              </div>

              {/* Previews */}
              {files.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 md:grid-cols-4">
                  {files.map((file) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative overflow-hidden shadow-sm rounded-xl aspect-square group"
                    >
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.preview}
                          className="object-cover w-full h-full"
                          alt="preview"
                          onLoad={() => { URL.revokeObjectURL(file.preview) }}
                        />
                      ) : (
                        <video src={file.preview} className="object-cover w-full h-full" />
                      )}

                      <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/40 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file);
                          }}
                          className="p-2 text-white transition-colors rounded-full bg-white/20 hover:bg-memory-danger backdrop-blur-sm"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t border-memory-border">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 text-lg btn-primary"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    <span>Share Memory</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
}
