import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Star, Heart, Share2 } from 'lucide-react';
import { useFamily } from '../FamilyContext';
import { MOCK_FRIENDS_SCORES } from '../data/gameData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const { gameScores, currentUser } = useFamily();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'friends'>('daily');

  const today = new Date().toISOString().split('T')[0];
  const myTodayScore = gameScores.find(s => s.date === today && s.type === 'daily');

  const allScores = [
    ...MOCK_FRIENDS_SCORES,
    { name: currentUser?.name || '我', score: myTodayScore?.score || 0, avatar: currentUser?.avatar || '', isMe: true }
  ].sort((a, b) => b.score - a.score);

  const myRank = allScores.findIndex(s => (s as any).isMe) + 1;

  return (
    <div className="min-h-screen bg-vintage-texture pb-24">
      <header className="bg-white/80 backdrop-blur-sm px-6 py-6 shadow-sm border-b-4 border-vintage-brown/10 flex items-center justify-between">
        <button onClick={() => navigate('/game-home')} className="p-2 text-vintage-brown">
          <ArrowLeft className="w-8 h-8" />
        </button>
        <h1 className="text-3xl font-hand font-bold text-vintage-brown">健康达人榜</h1>
        <div className="w-12"></div>
      </header>

      <div className="px-6 py-6">
        <div className="flex bg-white/50 p-2 rounded-2xl border-2 border-vintage-brown/10 mb-8">
          {(['daily', 'weekly', 'friends'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 rounded-xl font-hand font-bold text-xl transition-all",
                activeTab === tab ? "bg-vintage-orange text-white shadow-lg" : "text-vintage-brown/60"
              )}
            >
              {tab === 'daily' ? '日榜' : tab === 'weekly' ? '周榜' : '好友榜'}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {allScores.map((score, idx) => (
            <motion.div
              key={score.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "vintage-card p-4 transition-all flex items-center justify-between",
                (score as any).isMe 
                  ? "border-vintage-yellow shadow-xl scale-[1.02] bg-vintage-yellow/5" 
                  : "bg-white/60"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-retro font-bold text-xl",
                  idx === 0 ? "bg-vintage-yellow text-white" : 
                  idx === 1 ? "bg-zinc-300 text-white" :
                  idx === 2 ? "bg-orange-300 text-white" : "text-vintage-brown/40"
                )}>
                  {idx + 1}
                </div>
                <div className="w-14 h-14 bg-white p-1 shadow-md border-2 border-vintage-cream rotate-[-3deg]">
                  <img src={score.avatar} className="w-full h-full object-cover" alt={score.name} />
                </div>
                <div>
                  <span className="block font-hand font-bold text-vintage-brown text-2xl">
                    {score.name} {(score as any).isMe && "(我)"}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map(i => (
                      <Star key={i} className={cn("w-3 h-3", idx === 0 ? "text-vintage-yellow fill-vintage-yellow" : "text-zinc-200")} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-retro font-bold text-vintage-orange text-3xl leading-none">{score.score}</span>
                <span className="text-xs text-zinc-400 font-retro uppercase tracking-tighter">Points Today</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* My Rank Sticky */}
        <div className="fixed bottom-24 left-6 right-6 bg-vintage-brown p-6 rounded-3xl text-white shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-retro font-bold text-xl">
              {myRank}
            </div>
            <div>
              <p className="text-xs text-white/60 font-retro">我的当前排名</p>
              <h3 className="text-2xl font-hand font-bold">超越了 {Math.max(0, allScores.length - myRank)} 位好友</h3>
            </div>
          </div>
          <button className="p-3 bg-vintage-yellow rounded-2xl shadow-lg active:scale-95 transition-all">
            <Share2 className="w-6 h-6 text-white" />
          </button>
        </div>

        <button className="w-full mt-32 py-5 bg-white border-2 border-dashed border-vintage-brown/20 text-vintage-brown/60 rounded-3xl font-hand text-2xl font-bold flex items-center justify-center gap-3">
          <Users className="w-7 h-7" />
          邀请好友一起健脑
        </button>
      </div>
    </div>
  );
}
