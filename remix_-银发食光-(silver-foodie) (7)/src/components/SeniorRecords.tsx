import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Star, ChevronRight, Heart, Calendar } from 'lucide-react';

export default function SeniorRecords() {
  return (
    <div className="min-h-screen bg-vintage-texture p-6 pb-20">
      <header className="mb-10 text-center pt-4">
        <h1 className="text-4xl font-hand font-bold text-vintage-brown flex items-center justify-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          我的夕阳生活
        </h1>
        <p className="text-lg font-hand text-vintage-brown/60 mt-1 italic">记录点点滴滴，享受健康快乐</p>
      </header>

      <div className="max-w-md mx-auto space-y-8">
        {/* Daily Check-in Card */}
        <Link to="/checkin" className="block group">
          <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="vintage-card p-6 flex items-center gap-5 border-t-[10px] border-vintage-orange"
          >
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center border-2 border-vintage-orange/20 shadow-inner">
              <ClipboardCheck className="w-10 h-10 text-vintage-orange" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-hand font-bold text-vintage-brown mb-1">每日打卡</h3>
              <p className="text-sm font-retro text-vintage-brown/50 uppercase tracking-tighter">Daily Health Log</p>
              <p className="text-base font-hand text-vintage-brown/70 mt-2">告诉孩子们：我今天很好 ❤️</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-vintage-orange group-hover:text-white transition-all shadow-sm">
              <ChevronRight className="w-6 h-6" />
            </div>
          </motion.div>
        </Link>

        {/* Favorites Card */}
        <Link to="/favorites" className="block group">
          <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="vintage-card p-6 flex items-center gap-5 border-t-[10px] border-vintage-yellow"
          >
            <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center border-2 border-vintage-yellow/30 shadow-inner">
              <Star className="w-10 h-10 text-vintage-yellow fill-vintage-yellow" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-hand font-bold text-vintage-brown mb-1">我的收藏</h3>
              <p className="text-sm font-retro text-vintage-brown/50 uppercase tracking-tighter">My Favorites</p>
              <p className="text-base font-hand text-vintage-brown/70 mt-2">喜欢的菜，以后慢慢做 🥘</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-vintage-yellow group-hover:text-white transition-all shadow-sm">
              <ChevronRight className="w-6 h-6" />
            </div>
          </motion.div>
        </Link>

        <div className="mt-12 text-center">
          <div className="inline-block p-4 bg-white/40 border border-dashed border-vintage-brown/10 rounded-xl">
             <Calendar className="w-6 h-6 text-vintage-brown/30 mx-auto mb-2" />
             <p className="font-hand text-sm text-vintage-brown/40">生活不在于快慢，而在于点滴的喜悦</p>
          </div>
        </div>
      </div>
    </div>
  );
}
