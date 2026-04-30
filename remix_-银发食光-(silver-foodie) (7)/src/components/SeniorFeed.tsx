import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, ChevronUp, ChevronDown, Star, UtensilsCrossed } from 'lucide-react';
import { MOCK_VIDEOS } from '../data/mockData';
import { useFamily } from '../FamilyContext';
import { cn } from '../lib/utils';

export default function SeniorFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for down, -1 for up
  const { shareVideo, toggleFavorite, favoriteIds } = useFamily();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentVideo = MOCK_VIDEOS[currentIndex];
  const isFavorited = favoriteIds.includes(currentVideo.id);

  const handleNext = () => {
    if (currentIndex < MOCK_VIDEOS.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Handle keys and wheel for vertical navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
    };

    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 30) return;
      const now = Date.now();
      if (now - lastWheelTime > 800) {
        if (e.deltaY > 0) handleNext();
        else handlePrev();
        lastWheelTime = now;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex]);

  const handleShare = () => {
    shareVideo(currentVideo.id, shareMessage);
    setShowShareModal(false);
    setShareMessage('');
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 2000);
  };

  const variants = {
    initial: (direction: number) => ({
      y: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring' as const,
        stiffness: 260,
        damping: 26
      }
    },
    exit: (direction: number) => ({
      y: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 }
    })
  };

  return (
    <div className="relative h-screen w-full bg-vintage-texture flex flex-col overflow-hidden p-3" ref={containerRef}>
      {/* Navigation Indicators (Floating Arrows) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col justify-between h-3/4 z-50 pointer-events-none">
        <button 
          onClick={handlePrev}
          className={cn(
            "p-3 bg-white/60 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all pointer-events-auto group animate-bounce",
            currentIndex === 0 && "opacity-0 pointer-events-none"
          )}
        >
          <ChevronUp className="w-8 h-8 text-vintage-brown" />
        </button>
        <button 
          onClick={handleNext}
          className={cn(
            "p-3 bg-white/60 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all pointer-events-auto group animate-bounce",
            currentIndex === MOCK_VIDEOS.length - 1 && "opacity-0 pointer-events-none"
          )}
        >
          <ChevronDown className="w-8 h-8 text-vintage-brown" />
        </button>
      </div>

      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div 
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="vintage-card p-3 h-full flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
        >
          {/* Main Content Area */}
          <div className="relative flex-1 bg-zinc-900 overflow-hidden rounded-[2rem] group shadow-inner flex flex-col h-full border border-white/20">
            <img 
              src={currentVideo.thumbnail} 
              className="h-full w-full object-cover opacity-90 sepia-[0.1]"
              alt={currentVideo.title}
            />
            
            {/* Top Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-vintage-yellow px-4 py-1.5 font-hand text-xl text-vintage-brown shadow-lg -rotate-2 border-2 border-white">
                今日健康推荐
              </div>
            </div>

            {/* Right Action Sidebar - Douyin Style */}
            <div className="absolute right-3 bottom-24 flex flex-col gap-6 items-center z-20">
              {/* Author Avatar */}
              <div className="relative mb-2">
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-xl overflow-hidden bg-white">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentVideo.author}`} alt={currentVideo.author} />
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white border-2 border-white shadow-sm font-bold text-[10px]">
                  +
                </div>
              </div>

              {/* Like */}
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl group-active:scale-90 transition-all hover:bg-white/30">
                  <Heart className="w-8 h-8 text-white fill-none group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
                </div>
                <span className="text-white text-xs font-retro font-bold drop-shadow-md">{currentVideo.likes}</span>
              </button>

              {/* Comment */}
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl group-active:scale-90 transition-all hover:bg-white/30">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <span className="text-white text-xs font-retro font-bold drop-shadow-md">留言</span>
              </button>

              {/* Favorite */}
              <button 
                onClick={() => toggleFavorite(currentVideo.id)} 
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl group-active:scale-90 transition-all hover:bg-white/30">
                  <Star className={cn("w-8 h-8 transition-colors", isFavorited ? "text-vintage-yellow fill-vintage-yellow" : "text-white")} />
                </div>
                <span className={cn("text-xs font-retro font-bold drop-shadow-md", isFavorited ? "text-vintage-yellow" : "text-white")}>
                  {isFavorited ? '已收' : '收藏'}
                </span>
              </button>

              {/* Share/Send to Kids */}
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex flex-col items-center gap-2 group mt-2"
              >
                <div className="vintage-btn-primary !p-0 !w-16 !h-16 flex items-center justify-center !rounded-full shadow-2xl scale-110">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <span className="text-white text-xs font-retro font-bold drop-shadow-md mt-1 italic">寄回家</span>
              </button>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6 pt-20 bg-gradient-to-t from-black/90 via-black/30 to-transparent text-white pointer-events-none">
              <h3 className="text-xl font-hand text-vintage-yellow tracking-widest mb-1">@{currentVideo.author}</h3>
              <h2 className="text-3xl font-hand leading-tight mb-3 text-white/95">{currentVideo.title}</h2>
              
              <div className="flex flex-wrap gap-2">
                {currentVideo.ingredients.map(ing => (
                  <span key={ing} className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm text-base font-hand text-white/90">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

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

        {/* Navigation - Hidden but functional via wheel/swipe */}

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
