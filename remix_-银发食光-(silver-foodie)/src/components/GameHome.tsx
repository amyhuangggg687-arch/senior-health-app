import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Brain, Play, BookOpen, Users, Share2, Info, Star } from 'lucide-react';
import { useFamily } from '../FamilyContext';
import { MOCK_FRIENDS_SCORES } from '../data/gameData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function GameHome() {
  const navigate = useNavigate();
  const { gameScores, currentUser } = useFamily();

  const today = new Date().toISOString().split('T')[0];
  const todayScore = gameScores.find(s => s.date === today && s.type === 'daily');
  const personalBest = [...gameScores].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="min-h-screen bg-vintage-texture pb-24">
      <header className="bg-white/80 backdrop-blur-sm px-6 py-10 shadow-sm border-b-4 border-vintage-brown/10 text-center">
        <div className="w-20 h-20 bg-vintage-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-vintage-orange/20">
          <Brain className="w-10 h-10 text-vintage-orange" />
        </div>
        <h1 className="text-4xl font-hand font-bold text-vintage-brown mb-2">食物消消乐</h1>
        <p className="text-vintage-brown/60 font-retro text-xl">今日主题：控糖小能手</p>
      </header>

      <main className="px-6 py-8 space-y-8">
        {/* Daily Challenge */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/game', { state: { type: 'daily' } })}
          className="bg-white p-6 rounded-3xl shadow-xl border-[10px] border-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-vintage-yellow/10 rounded-full -mr-8 -mt-8"></div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-vintage-yellow rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-2xl font-hand font-bold text-vintage-brown">每日挑战</h3>
                <p className="text-sm font-retro text-zinc-400">每天一次，赢取积分</p>
              </div>
            </div>
            {todayScore && (
              <div className="text-right">
                <span className="block text-xs text-zinc-400 font-retro">今日得分</span>
                <span className="text-2xl font-retro font-bold text-vintage-orange">{todayScore.score}</span>
              </div>
            )}
          </div>
          <button className="w-full py-4 bg-vintage-orange text-white rounded-xl font-hand text-2xl font-bold shadow-[0_4px_0_rgb(184,84,19)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
            <Play className="w-7 h-7 fill-white" />
            {todayScore ? "再练一次" : "开始挑战"}
          </button>
        </motion.div>

        {/* Practice Mode */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/game', { state: { type: 'practice' } })}
          className="bg-white p-6 rounded-3xl shadow-xl border-[10px] border-white relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-vintage-brown rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-hand font-bold text-vintage-brown">自由练习</h3>
                <p className="text-sm font-retro text-zinc-400">无限次数，轻松健脑</p>
              </div>
            </div>
          </div>
          <button className="w-full py-4 bg-white border-2 border-vintage-brown text-vintage-brown rounded-xl font-hand text-2xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-3">
            <Play className="w-7 h-7" />
            开始练习
          </button>
        </motion.div>

        {/* Mini Leaderboard */}
        <div className="bg-white/50 p-6 rounded-3xl border-2 border-dashed border-vintage-brown/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-hand font-bold text-vintage-brown flex items-center gap-2">
              <Users className="w-6 h-6 text-vintage-orange" />
              好友排行榜
            </h3>
            <button onClick={() => navigate('/leaderboard')} className="text-vintage-orange font-hand font-bold text-xl">
              查看更多
            </button>
          </div>
          <div className="space-y-4">
            {MOCK_FRIENDS_SCORES.slice(0, 3).map((friend, idx) => (
              <div key={friend.name} className="flex items-center justify-between bg-white/80 p-3 rounded-2xl border border-vintage-brown/5">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    idx === 0 ? "bg-vintage-yellow text-white" : "bg-vintage-cream text-vintage-brown"
                  )}>
                    {idx + 1}
                  </span>
                  <img src={friend.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={friend.name} />
                  <span className="font-retro font-bold text-vintage-brown">{friend.name}</span>
                </div>
                <span className="font-retro font-bold text-vintage-orange">{friend.score}分</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Best */}
        <div className="flex items-center justify-between bg-vintage-brown p-6 rounded-3xl text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-vintage-yellow" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-retro">我的历史最佳</p>
              <h3 className="text-2xl font-hand font-bold">{personalBest?.score || 0} 分</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60 font-retro">{personalBest?.date || '暂无记录'}</p>
            <Star className="w-6 h-6 text-vintage-yellow fill-vintage-yellow ml-auto mt-1" />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/knowledge-book')}
            className="p-4 bg-white rounded-2xl border-2 border-vintage-brown/10 flex flex-col items-center gap-2"
          >
            <BookOpen className="w-8 h-8 text-vintage-brown" />
            <span className="font-hand font-bold text-vintage-brown">健康宝典</span>
          </button>
          <button className="p-4 bg-white rounded-2xl border-2 border-vintage-brown/10 flex flex-col items-center gap-2">
            <Share2 className="w-8 h-8 text-vintage-brown" />
            <span className="font-hand font-bold text-vintage-brown">分享游戏</span>
          </button>
        </div>
      </main>
    </div>
  );
}
