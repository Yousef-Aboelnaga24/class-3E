import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiSmile, FiX, FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';
import { useCreatePost } from '../hooks/usePosts';
import PageTransition from '../components/layout/PageTransition';

const createMemorySchema = z.object({
  content: z.string().min(1, 'Memory content cannot be empty'),
});

export default function CreateMemory() {
  const [files, setFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createPost } = useCreatePost();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createMemorySchema),
    defaultValues: { content: '' }
  });

  const contentValue = watch('content');

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
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      
      files.forEach((file) => {
        formData.append('media[]', file);
      });

      await createPost(formData);
      navigate('/');
    } catch (error) {
      // toast is handled by useCreatePost
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold font-display text-memory-text">New Memory</h1>
          <p className="text-memory-muted mt-1">Share a special moment with the class.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-3xl p-6"
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
              
              <div className="absolute bottom-4 right-4 relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-memory-muted hover:text-amber-warm transition-colors rounded-full hover:bg-white"
                >
                  <FiSmile className="w-6 h-6" />
                </button>
                
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 bottom-12 z-50 shadow-card rounded-2xl overflow-hidden"
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
              <p className="text-sm text-memory-danger mt-1">{errors.content.message}</p>
            )}

            {/* Media Upload (Dropzone) */}
            <div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-amber-warm bg-amber-warm/5 scale-[1.02]' 
                    : 'border-memory-border hover:border-amber-warm/50 hover:bg-white/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 mx-auto bg-amber-warm/10 rounded-full flex items-center justify-center mb-4 text-amber-warm">
                  <FiImage className="w-8 h-8" />
                </div>
                <p className="text-memory-text font-medium mb-1">
                  {isDragActive ? "Drop the files here..." : "Drag & drop photos/videos here"}
                </p>
                <p className="text-sm text-memory-muted">or click to browse your files (max 10MB)</p>
              </div>

              {/* Previews */}
              {files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-xl overflow-hidden aspect-square shadow-sm group"
                    >
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.preview}
                          className="w-full h-full object-cover"
                          alt="preview"
                          onLoad={() => { URL.revokeObjectURL(file.preview) }}
                        />
                      ) : (
                        <video src={file.preview} className="w-full h-full object-cover" />
                      )}
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file);
                          }}
                          className="bg-white/20 hover:bg-memory-danger text-white p-2 rounded-full backdrop-blur-sm transition-colors"
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
            <div className="pt-4 border-t border-memory-border flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2 py-3 px-8 text-lg"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
