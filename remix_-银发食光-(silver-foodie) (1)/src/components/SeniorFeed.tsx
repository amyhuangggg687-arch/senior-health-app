import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { MOCK_VIDEOS } from '../data/mockData';
import { useFamily } from '../FamilyContext';

export default function SeniorFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { shareVideo } = useFamily();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  const currentVideo = MOCK_VIDEOS[currentIndex];

  const handleShare = () => {
    shareVideo(currentVideo.id, shareMessage);
    setShowShareModal(false);
    setShareMessage('');
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 2000);
  };

  return (
    <div className="relative h-screen w-full bg-vintage-texture flex flex-col overflow-hidden p-4">
      {/* Album Frame */}
      <div className="relative flex-1 flex items-center justify-center bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)] rounded-sm border-[12px] border-white">
        <div className="relative w-full h-full bg-zinc-900 overflow-hidden rounded-sm">
          <video 
            key={currentVideo.id}
            src={currentVideo.videoUrl} 
            className="h-full w-full object-cover opacity-90 sepia-[0.2]"
            autoPlay 
            loop 
            muted 
            playsInline
          />
          
          {/* Overlay Info - Retro Newspaper Style */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed className="w-5 h-5 text-vintage-yellow" />
              <h3 className="text-xl font-retro text-vintage-yellow tracking-wider">@{currentVideo.author}</h3>
            </div>
            <p className="text-2xl font-hand leading-tight mb-2">{currentVideo.title}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {currentVideo.ingredients.map(ing => (
                <span key={ing} className="px-3 py-1 bg-white/10 border border-white/30 rounded-full text-sm font-retro">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons - Old Enamel Style */}
        <div className="absolute right-4 bottom-28 flex flex-col gap-4 items-center z-20">
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-3 bg-white rounded-full shadow-md border-2 border-zinc-200 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
            <span className="text-zinc-800 font-retro text-xs">{currentVideo.likes}</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-3 bg-white rounded-full shadow-md border-2 border-zinc-200 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-zinc-800 font-retro text-xs">留言</span>
          </button>

          <button 
            onClick={() => setShowShareModal(true)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-4 bg-vintage-orange rounded-full shadow-[0_3px_0_rgb(184,84,19)] active:translate-y-1 active:shadow-none transition-all">
              <Share2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-vintage-brown font-hand text-base font-bold mt-1">寄给孩子</span>
          </button>
        </div>

        {/* Share Modal - Retro Letter Style */}
        <AnimatePresence>
          {showShareModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                onClick={() => setShowShareModal(false)}
              />
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-20 left-4 right-4 bg-white p-8 rounded-sm shadow-2xl border-[10px] border-white z-[70] bg-vintage-texture"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 washi-tape w-32 h-8 bg-vintage-yellow/40 z-20"></div>
                
                <h3 className="text-3xl font-hand font-bold text-vintage-brown mb-6 text-center">捎个口信</h3>
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="孩子们，看看这个菜行吗？"
                  className="w-full h-32 p-4 bg-white border-2 border-vintage-brown/10 rounded-xl font-hand text-2xl focus:outline-none focus:border-vintage-orange/30 resize-none"
                />
                
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="vintage-btn-secondary flex-1"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleShare}
                    className="vintage-btn-primary flex-1"
                  >
                    寄出去 📮
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Navigation - Retro Arrows */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <button 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white disabled:opacity-0 transition-all"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-8 h-8 text-vintage-brown" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center">
          <button 
            onClick={() => setCurrentIndex(prev => Math.min(MOCK_VIDEOS.length - 1, prev + 1))}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white disabled:opacity-0 transition-all"
            disabled={currentIndex === MOCK_VIDEOS.length - 1}
          >
            <ChevronRight className="w-8 h-8 text-vintage-brown" />
          </button>
        </div>
      </div>

      {/* Share Success Toast - Old Postcard Style */}
      <AnimatePresence>
        {showShareSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-vintage-cream p-8 rounded-sm shadow-2xl border-2 border-vintage-brown z-50 flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 bg-vintage-orange/20 rounded-full flex items-center justify-center">
              <Share2 className="w-8 h-8 text-vintage-orange" />
            </div>
            <p className="text-2xl font-hand text-vintage-brown font-bold">已寄出！孩子们很快就能看到啦</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
