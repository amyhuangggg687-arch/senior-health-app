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
    <div className="relative h-screen w-full bg-vintage-texture flex flex-col overflow-hidden p-3">
      {/* Polaroid Style Album Frame */}
      <div className="relative flex-1 flex flex-col bg-white p-3 shadow-[0_12px_50px_rgba(0,0,0,0.2)] rounded-sm border-[6px] border-zinc-50 overflow-hidden">
        
        {/* Main Content Area */}
        <div className="relative flex-1 bg-zinc-100 overflow-hidden rounded-sm group shadow-inner">
          <img 
            key={currentVideo.id}
            src={currentVideo.thumbnail} 
            className="h-full w-full object-cover opacity-95 grayscale-[0.1] sepia-[0.15]"
            alt={currentVideo.title}
          />
          
          {/* Top Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-vintage-yellow px-4 py-2 font-hand text-2xl text-vintage-brown shadow-lg -rotate-3 border-2 border-white">
              健康主推
            </div>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 pt-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-full border-2 border-white/50 overflow-hidden shadow-lg p-0.5 bg-white">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentVideo.author}`} alt={currentVideo.author} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-hand text-vintage-yellow tracking-wider">@{currentVideo.author}</h3>
                <div className="flex items-center gap-1.5 opacity-80">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span className="text-xs font-retro uppercase tracking-tighter">家政美食家</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl font-hand leading-relaxed mb-4 drop-shadow-md text-white/95">{currentVideo.title}</h2>
            
            <div className="flex flex-wrap gap-2.5">
              {currentVideo.ingredients.map(ing => (
                <span key={ing} className="px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/40 rounded-sm text-lg font-hand text-white/90">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Polaroid Footer Section - Balanced Layout */}
        <div className="h-28 mt-4 flex items-center justify-between px-2">
          {/* Left: Like & Comment */}
          <div className="flex gap-4">
            <button className="flex flex-col items-center group">
              <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              </div>
              <span className="text-zinc-500 font-retro text-[10px] uppercase font-bold mt-1.5 tracking-tighter">{currentVideo.likes} 赞</span>
            </button>
            <button className="flex flex-col items-center group">
              <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-zinc-500 font-retro text-[10px] uppercase font-bold mt-1.5 tracking-tighter">说两名</span>
            </button>
          </div>

          {/* Right: Main CTA Sharing */}
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-4 bg-vintage-orange px-8 py-3.5 rounded-xl shadow-[0_5px_0_rgb(184,84,19)] active:translate-y-1 active:shadow-none transition-all group"
          >
            <Share2 className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
            <div className="text-left">
              <span className="block text-2xl font-hand font-bold text-white leading-none">寄给家里人</span>
              <span className="text-[10px] text-white/60 font-retro font-bold uppercase tracking-widest mt-0.5">Share with Family</span>
            </div>
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

        {/* Navigation - Centered Vertical Position */}
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <button 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white disabled:opacity-0 transition-all pointer-events-auto -translate-x-3 hover:translate-x-0 group"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-7 h-7 text-vintage-brown group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
          <button 
            onClick={() => setCurrentIndex(prev => Math.min(MOCK_VIDEOS.length - 1, prev + 1))}
            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white disabled:opacity-0 transition-all pointer-events-auto translate-x-3 hover:translate-x-0 group"
            disabled={currentIndex === MOCK_VIDEOS.length - 1}
          >
            <ChevronRight className="w-7 h-7 text-vintage-brown group-hover:translate-x-0.5 transition-transform" />
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
