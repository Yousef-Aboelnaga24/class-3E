import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiMail } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import MemoryCard from '../components/MemoryCard';

const mockUser = {
  id: 1,
  name: 'Sarah Jenkins',
  role: 'Class President',
  avatar: 'https://i.pravatar.cc/150?u=sarah',
  coverPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
  bio: 'Always organizing something. Loves photography and collecting memories.',
  joinedAt: 'September 2021',
  location: 'New York, NY',
  email: 'sarah.j@example.com',
  stats: {
    memories: 45,
    photos: 128,
    comments: 342
  }
};

const mockUserPosts = [
  {
    id: 1,
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    timestamp: '2 hours ago',
    content: 'Still thinking about our graduation trip to the mountains. The campfire stories, the stargazing... such beautiful memories! ✨⛺',
    media: [
      { url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800' }
    ],
    likes: 24,
    isLikedByMe: true,
    comments: [
      { id: 1, author: { name: 'Mike Ross', avatar: 'https://i.pravatar.cc/150?u=mike' }, content: 'That was the best trip ever!' }
    ]
  }
];

export default function Profile() {
  const { id } = useParams(); // Use ID to fetch real user data later

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto pb-12">
        {/* Cover Photo */}
        <div className="relative h-64 md:h-80 rounded-b-[3rem] md:rounded-3xl overflow-hidden shadow-card -mt-8 md:mt-0 mb-20">
          <img 
            src={mockUser.coverPhoto} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Profile Info Container */}
        <div className="px-6 md:px-12 relative">
          <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-32 md:-mt-24 mb-8 relative z-10">
            {/* Avatar */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-cream-50 shadow-xl overflow-hidden bg-white"
            >
              <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full object-cover" />
            </motion.div>

            {/* Basic Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-3xl md:text-4xl font-bold font-display text-memory-text mb-1">{mockUser.name}</h1>
              <p className="text-amber-deep font-medium mb-4">{mockUser.role}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-memory-muted">
                <div className="flex items-center gap-1.5">
                  <FiMapPin className="w-4 h-4" />
                  <span>{mockUser.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="w-4 h-4" />
                  <span>Joined {mockUser.joinedAt}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiMail className="w-4 h-4" />
                  <span>{mockUser.email}</span>
                </div>
              </div>
            </div>

            {/* Edit Button / Action Button */}
            <div className="pb-2">
              <button className="btn-secondary w-full md:w-auto px-8">Message</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar / Stats */}
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="font-bold text-memory-text mb-2">About</h3>
                <p className="text-memory-muted text-sm leading-relaxed">{mockUser.bio}</p>
              </div>

              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="font-bold text-memory-text mb-4">Stats</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-amber-warm font-display">{mockUser.stats.memories}</div>
                    <div className="text-xs text-memory-muted uppercase tracking-wider mt-1">Memories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-sky-soft font-display">{mockUser.stats.photos}</div>
                    <div className="text-xs text-memory-muted uppercase tracking-wider mt-1">Photos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-sage-soft font-display">{mockUser.stats.comments}</div>
                    <div className="text-xs text-memory-muted uppercase tracking-wider mt-1">Comments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content / Posts */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold font-display text-memory-text">Recent Memories</h2>
                <button className="text-sm text-amber-deep hover:text-amber-warm transition-colors font-medium">View All</button>
              </div>

              {mockUserPosts.map(post => (
                <MemoryCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
