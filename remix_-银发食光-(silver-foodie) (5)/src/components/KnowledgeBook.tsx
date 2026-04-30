import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Search, Star, Heart, Play, Utensils, Info } from 'lucide-react';
import { useFamily } from '../FamilyContext';
import { HEALTH_KNOWLEDGE } from '../data/gameData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function KnowledgeBook() {
  const navigate = useNavigate();
  const { learnedKnowledgeIds } = useFamily();
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const categories = ['全部', '控糖', '补钙', '护心', '护眼', '通用'];

  const filteredKnowledge = HEALTH_KNOWLEDGE.filter(k => 
    (activeCategory === '全部' || k.category === activeCategory)
  );

  return (
    <div className="min-h-screen bg-vintage-texture pb-24">
      <header className="bg-white/80 backdrop-blur-sm px-6 py-6 shadow-sm border-b-4 border-vintage-brown/10 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => navigate('/game-home')} className="p-2 text-vintage-brown">
          <ArrowLeft className="w-8 h-8" />
        </button>
        <h1 className="text-3xl font-hand font-bold text-vintage-brown">健康宝典</h1>
        <div className="w-12"></div>
      </header>

      <div className="px-6 py-6">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
          <input 
            type="text" 
            placeholder="搜索食材或功效..."
            className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border-2 border-vintage-brown/10 font-retro text-xl shadow-inner focus:outline-none focus:border-vintage-orange transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full font-hand font-bold text-xl whitespace-nowrap transition-all border-2",
                activeCategory === cat 
                  ? "bg-vintage-orange text-white border-vintage-orange shadow-lg" 
                  : "bg-white text-vintage-brown/60 border-vintage-brown/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Knowledge List */}
        <div className="space-y-10">
          {filteredKnowledge.map((k, idx) => {
            const isLearned = learnedKnowledgeIds.includes(k.id);
            return (
              <motion.div
                key={k.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "vintage-card p-6 rotate-[-0.5deg]",
                  !isLearned && "opacity-60 grayscale scale-[0.98]"
                )}
              >
                {!isLearned && (
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <div className="bg-vintage-brown/80 text-white px-6 py-3 rounded-full font-hand font-bold text-xl flex items-center gap-3 shadow-2xl">
                      <Play className="w-6 h-6 fill-white" />
                      游戏中解锁
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-white p-2 shadow-xl border-2 border-vintage-cream rotate-[-3deg] flex-shrink-0">
                    <img src={k.imageUrl} alt={k.ingredient} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-hand font-bold text-vintage-brown leading-none mb-2">{k.ingredient}</h3>
                    <span className="px-3 py-1 bg-vintage-orange/10 text-vintage-orange rounded-full text-sm font-retro font-bold border border-vintage-orange/10">
                      {k.category}
                    </span>
                  </div>
                </div>

                <div className="bg-vintage-cream/30 p-5 rounded-xl border-2 border-dashed border-vintage-brown/5 mb-6 shadow-inner">
                  <p className="text-2xl font-hand font-bold text-vintage-brown/80 leading-relaxed italic">
                    “{k.benefit}”
                  </p>
                </div>

                <div className="flex gap-4">
                  <button className="vintage-btn-primary flex-1 py-3 text-xl">
                    <Utensils className="w-5 h-5" />
                    查看菜谱
                  </button>
                  <button className="vintage-btn-secondary p-3 border-vintage-brown/10 text-vintage-brown/40">
                    <Heart className="w-7 h-7" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
