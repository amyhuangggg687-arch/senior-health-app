import { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Utensils, History, Loader2, CheckCircle2, Paperclip, StickyNote, Brain, Trophy, Heart, Ban, Smile, Sparkles } from 'lucide-react';
import { useFamily } from '../FamilyContext';
import { MOCK_VIDEOS } from '../data/mockData';
import { analyzeRecipe } from '../services/geminiService';

export default function ChildDashboard() {
  const { familyGroup, sharedItems, updateSharedItem, gameScores, learnedKnowledgeIds } = useFamily();
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});

  const latestDailyScore = gameScores.find(s => s.type === 'daily');
  const totalKnowledge = learnedKnowledgeIds.length;

  const handleAnalyze = async (item: any) => {
    const video = MOCK_VIDEOS.find(v => v.id === item.videoId);
    if (!video || !familyGroup) return;

    setAnalyzingId(item.id);
    try {
      const result = await analyzeRecipe(video, familyGroup.healthProfile);
      updateSharedItem(item.id, { 
        status: 'analyzed', 
        analysis: JSON.stringify(result) 
      });
    } catch (error) {
      alert('分析失败，请重试');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handlePushToSenior = (id: string) => {
    updateSharedItem(id, { 
      status: 'recommended',
      reply: replies[id] || '这个看起来很棒，帮您改良了一下做法，更适合您的身体健康！'
    });
  };

  return (
    <div className="min-h-screen bg-vintage-texture pb-24 font-retro">
      {/* Header - Album Title Style */}
      <header className="px-6 pt-10 pb-6 relative text-center">
        <div className="absolute top-4 left-4 rotate-[-12deg]">
          <div className="w-12 h-12 bg-white p-1 shadow-md border-2 border-vintage-cream rotate-[-5deg]">
            <img src={familyGroup?.senior.avatar} className="w-full h-full object-cover" alt="Senior" />
          </div>
        </div>
        <div className="absolute top-4 right-4 rotate-[12deg]">
          <div className="w-10 h-10 bg-white p-1 shadow-md border-2 border-vintage-cream rotate-[5deg]">
            <img src={familyGroup?.children[0]?.avatar} className="w-full h-full object-cover" alt="Child" />
          </div>
        </div>

        <div className="inline-block relative">
          <div className="washi-tape -top-4 -left-8 bg-vintage-yellow/40"></div>
          <h1 className="text-5xl font-hand font-bold text-vintage-brown drop-shadow-sm">家园健康本</h1>
          <div className="washi-tape -bottom-2 -right-6 bg-vintage-orange/30 rotate-[5deg]"></div>
        </div>
        <p className="mt-4 text-vintage-brown/60 font-retro italic">记录属于我们的每一份关怀</p>
      </header>

      <main className="px-6 space-y-10">
        {/* Health Summary - Polaroid/Sticky Note Mix */}
        <section>
          <div className="vintage-card p-6 rotate-[-0.5deg]">
            <Paperclip className="absolute -top-3 right-4 w-8 h-8 text-vintage-brown/20 rotate-[15deg] z-20" />
            <div className="flex items-center gap-3 mb-6 border-b-2 border-dashed border-vintage-brown/10 pb-2">
              <Activity className="w-6 h-6 text-vintage-orange" />
              <h2 className="text-2xl font-hand font-bold text-vintage-brown">父母健康备忘</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Conditions */}
                <div className="space-y-3">
                  <p className="font-hand font-bold text-lg text-vintage-orange flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>基础状况</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {familyGroup?.healthProfile.conditions.map(c => (
                      <span key={c} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-retro font-bold border border-red-200 shadow-sm flex items-center gap-1.5">
                        <Activity className="w-3 h-3" />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Restrictions */}
                <div className="space-y-3">
                  <p className="font-hand font-bold text-lg text-vintage-yellow flex items-center gap-2">
                    <Ban className="w-4 h-4" />
                    <span>饮食禁忌</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {familyGroup?.healthProfile.restrictions.map(r => (
                      <span key={r} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-retro font-bold border border-amber-200 shadow-sm flex items-center gap-1.5">
                        <Ban className="w-3 h-3 opacity-50" />
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preferences & Dental */}
              <div className="pt-4 border-t border-dashed border-vintage-brown/10 grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="font-hand font-bold text-lg text-green-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>口味偏好</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {familyGroup?.healthProfile.preferences.map(p => (
                      <span key={p} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-retro font-bold border border-green-100 italic">
                        #{p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-hand font-bold text-lg text-blue-600 flex items-center gap-2">
                    <Smile className="w-4 h-4" />
                    <span>牙口状况</span>
                  </p>
                  <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border-2 border-blue-100 font-retro font-bold text-lg rotate-2 shadow-sm">
                    {familyGroup?.healthProfile.dentalStatus === 'good' ? '非常健康' : 
                     familyGroup?.healthProfile.dentalStatus === 'fair' ? '一般（偏软）' : '牙力受限'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Game Stats Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-vintage-orange/5 rounded-3xl -rotate-2"></div>
          <div className="vintage-card p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Brain className="w-7 h-7 text-vintage-orange" />
                <h2 className="text-2xl font-hand font-bold text-vintage-brown">近期健脑简报</h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-retro opacity-40 uppercase tracking-widest leading-none">Weekly Report</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-vintage-cream/30 p-4 rounded-xl border border-vintage-brown/5 text-center">
                <p className="text-xs text-zinc-400 mb-1">今日最高分</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-retro font-bold text-vintage-orange">{latestDailyScore?.score || 0}</span>
                  <Trophy className="w-4 h-4 text-vintage-yellow" />
                </div>
              </div>
              <div className="bg-vintage-cream/30 p-4 rounded-xl border border-vintage-brown/5 text-center">
                <p className="text-xs text-zinc-400 mb-1">解锁健康经</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-retro font-bold text-green-600">{totalKnowledge}</span>
                  <Activity className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between p-3 bg-vintage-orange/5 rounded-xl border-2 border-dashed border-vintage-orange/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-vintage-yellow/20 rounded-full flex items-center justify-center text-vintage-yellow">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-retro font-bold">老爸老妈表现得特别棒！</p>
              </div>
              <button className="text-vintage-orange text-sm font-hand font-bold hover:underline">去点个赞</button>
            </div>
          </div>
        </section>

        {/* Feed Header */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-vintage-brown rounded-full"></div>
            <h2 className="text-3xl font-hand font-bold text-vintage-brown">待处理的消息</h2>
          </div>
          <History className="w-6 h-6 text-vintage-brown/20" />
        </div>

        {/* Shared Items */}
        <div className="space-y-12">
          {sharedItems.length === 0 ? (
            <div className="vintage-card py-20 text-center opacity-60">
              <StickyNote className="w-16 h-16 text-vintage-brown/20 mx-auto mb-4" />
              <p className="font-hand text-2xl">暂时没有新消息寄过来呢</p>
            </div>
          ) : (
            sharedItems.map(item => {
              const video = MOCK_VIDEOS.find(v => v.id === item.videoId);
              if (!video) return null;
              const analysis = item.analysis ? JSON.parse(item.analysis) : null;

              return (
                <motion.div 
                  key={item.id}
                  layout
                  className="vintage-card p-6 rotate-[0.2deg]"
                >
                  <div className="absolute -top-4 -left-2 washi-tape w-20 h-6 bg-vintage-yellow/40 rotate-[-5deg] z-20"></div>
                  
                  <div className="flex gap-6 mb-8">
                    <div className="relative shrink-0">
                      <div className="w-32 h-32 bg-white p-2 shadow-xl border-2 border-vintage-cream rotate-[-3deg]">
                        <img src={video.thumbnail} className="w-full h-full object-cover" alt="Thumbnail" />
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-2xl font-hand font-bold mb-2 leading-tight text-vintage-brown drop-shadow-sm">{video.title}</h3>
                      <div className="flex items-center gap-2 text-vintage-brown/50">
                        <img src={familyGroup?.senior.avatar} className="w-5 h-5 rounded-full" alt="Sender" />
                        <span className="text-sm italic font-retro font-bold">由老爸分享给您</span>
                      </div>
                      {item.message && (
                        <div className="mt-3 p-3 bg-vintage-yellow/5 border-l-4 border-vintage-yellow rounded-r-lg italic text-vintage-brown font-hand text-xl">
                          “{item.message}”
                        </div>
                      )}
                    </div>
                  </div>

                  {item.status === 'pending' && (
                    <button 
                      onClick={() => handleAnalyze(item)}
                      disabled={analyzingId === item.id}
                      className="vintage-btn-secondary w-full border-vintage-yellow text-vintage-yellow shadow-[0_4px_0_rgb(243,156,18)]"
                    >
                      {analyzingId === item.id ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin text-vintage-yellow" />
                          正在用心分析中...
                        </>
                      ) : (
                        <>
                          <Brain className="w-6 h-6" />
                          AI 营养改良分析
                        </>
                      )}
                    </button>
                  )}

                  {analysis && (
                    <div className="mt-8 space-y-6">
                      <div className="p-5 bg-vintage-cream rounded-2xl border-2 border-dashed border-vintage-brown/10 relative">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                          <h4 className="text-2xl font-hand font-bold text-vintage-brown">健康改良：{analysis.modifiedTitle}</h4>
                        </div>
                        
                        <div className="space-y-4 font-retro text-lg text-vintage-brown/80 leading-relaxed italic">
                          <div className="pl-4 border-l-4 border-vintage-orange/30">
                            <p>{analysis.healthReason}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            {analysis.ingredients.map((ing: string) => (
                              <div key={ing} className="flex items-center gap-2 text-sm bg-white/40 p-2 rounded-lg border border-vintage-brown/5">
                                <Utensils className="w-3 h-3 text-vintage-yellow" />
                                <span>{ing}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {item.status === 'analyzed' && (
                          <div className="mt-8 space-y-4">
                            <div className="relative">
                              <StickyNote className="absolute -top-3 -right-3 w-8 h-8 text-vintage-yellow/40 rotate-12" />
                              <textarea
                                value={replies[item.id] || ''}
                                onChange={(e) => setReplies({ ...replies, [item.id]: e.target.value })}
                                placeholder="给父母回封信（例如：这道菜稍微减点盐，对血压好...）"
                                className="w-full h-24 p-4 bg-white border-2 border-vintage-brown/10 rounded-xl font-hand text-xl focus:outline-none focus:border-vintage-orange/30 resize-none shadow-inner"
                              />
                            </div>
                            <button 
                              onClick={() => handlePushToSenior(item.id)}
                              className="vintage-btn-primary w-full"
                            >
                              寄回给父母 📮
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
