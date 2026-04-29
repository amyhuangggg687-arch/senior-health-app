import { motion } from 'motion/react';
import { Bell, Heart, Star, Utensils, Bookmark } from 'lucide-react';
import { useFamily } from '../FamilyContext';
import { MOCK_VIDEOS } from '../data/mockData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SeniorNotifications() {
  const { sharedItems, familyGroup, favoriteIds, toggleFavorite } = useFamily();
  const recommendedItems = sharedItems.filter(item => item.status === 'recommended');

  return (
    <div className="min-h-screen bg-vintage-texture pb-24">
      <header className="bg-white/80 backdrop-blur-sm px-6 py-10 shadow-sm border-b-4 border-vintage-brown/10">
        <h1 className="text-3xl font-hand font-bold text-vintage-brown flex items-center gap-3">
          <Bell className="w-8 h-8 text-vintage-orange" />
          孩子们的叮嘱
        </h1>
      </header>

      <main className="px-6 py-8">
        {recommendedItems.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-sm border-2 border-dashed border-vintage-brown/20">
            <div className="w-24 h-24 bg-vintage-cream rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-vintage-brown/10">
              <Bookmark className="w-10 h-10 text-vintage-brown/30" />
            </div>
            <p className="text-vintage-brown/60 text-2xl font-hand">还没有收到孩子们的推荐呢</p>
          </div>
        ) : (
          <div className="space-y-12">
            {recommendedItems.map(item => {
              const video = MOCK_VIDEOS.find(v => v.id === item.videoId);
              const analysis = item.analysis ? JSON.parse(item.analysis) : null;
              if (!video || !analysis) return null;

              const isFav = favoriteIds.includes(item.id);

              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="vintage-card p-6 rotate-[0.5deg]"
                >
                  <div className="absolute top-0 right-0 washi-tape w-20 h-6 bg-vintage-yellow/40 rotate-[15deg] z-20"></div>

                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-dashed border-vintage-brown/10">
                    <div className="w-14 h-14 bg-white p-1 shadow-md border-2 border-vintage-cream rotate-[-3deg]">
                      <img src={familyGroup?.children[0].avatar} className="w-full h-full object-cover" alt="Child" />
                    </div>
                    <div>
                      <p className="font-hand font-bold text-vintage-brown text-2xl">{familyGroup?.children[0].name} 的贴心建议</p>
                      <p className="font-retro text-vintage-brown/40 text-sm italic">专门为您改良了做法</p>
                    </div>
                  </div>

                  <div className="bg-white/40 p-6 rounded-2xl mb-8 border-2 border-vintage-brown/5">
                    <h3 className="text-2xl font-hand font-bold text-vintage-orange mb-4 flex items-center gap-3 underline decoration-vintage-orange/10 decoration-4 underline-offset-8">
                      <Utensils className="w-7 h-7" />
                      {analysis.modifiedTitle}
                    </h3>
                    
                    <div className="bg-vintage-cream/60 p-4 rounded-xl mb-6 border-l-4 border-vintage-orange italic font-retro text-lg text-vintage-brown/80 leading-relaxed shadow-inner">
                      “{analysis.healthReason}”
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="font-hand font-bold text-vintage-brown text-xl mb-4">
                          烹饪小妙招：
                        </p>
                        <div className="space-y-4">
                          {analysis.steps.map((step: string, idx: number) => (
                            <div key={idx} className="flex gap-4 items-start">
                              <span className="flex-shrink-0 w-7 h-7 bg-vintage-brown text-vintage-cream rounded-full flex items-center justify-center text-sm font-retro font-bold mt-1">
                                {idx + 1}
                              </span>
                              <p className="text-vintage-brown font-retro text-lg leading-snug">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="vintage-btn-primary flex-1">
                      <Heart className="w-7 h-7 fill-white" />
                      想吃这个
                    </button>
                    <button 
                      onClick={() => toggleFavorite(item.id)}
                      className={cn(
                        "vintage-btn-secondary flex-1",
                        isFav && "bg-vintage-yellow text-white border-vintage-yellow shadow-[0_4px_0_rgb(184,116,19)]"
                      )}
                    >
                      <Star className={cn("w-7 h-7", isFav && "fill-white")} />
                      {isFav ? "已存好" : "先存起来"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
