import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFamily } from '../FamilyContext';
import { 
  Droplets, 
  Pill, 
  Dumbbell, 
  Moon, 
  Smile, 
  Meh, 
  Frown, 
  CheckCircle2, 
  Calendar,
  Utensils,
  BarChart2,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const CHECK_IN_ITEMS = [
  { id: 'water', label: '喝足水', icon: Droplets, color: 'text-blue-500' },
  { id: 'medicine', label: '吃过药', icon: Pill, color: 'text-red-500' },
  { id: 'exercise', label: '动一动', icon: Dumbbell, color: 'text-green-500' },
  { id: 'fruit', label: '吃水果', icon: Utensils, color: 'text-orange-500' },
  { id: 'sleep', label: '睡得香', icon: Moon, color: 'text-indigo-500' },
];

const MOODS = [
  { id: 'happy', label: '开心', icon: Smile, color: 'text-yellow-500', bgColor: '#EAB308' },
  { id: 'neutral', label: '一般', icon: Meh, color: 'text-zinc-500', bgColor: '#71717A' },
  { id: 'sad', label: '不太好', icon: Frown, color: 'text-blue-400', bgColor: '#60A5FA' },
];

function MoodStats({ checkIns }: { checkIns: any[] }) {
  const stats = useMemo(() => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const relevant = checkIns.filter(c => new Date(c.date) >= last30Days);
    
    const counts = {
      happy: relevant.filter(c => c.mood === 'happy').length,
      neutral: relevant.filter(c => c.mood === 'neutral').length,
      sad: relevant.filter(c => c.mood === 'sad').length,
    };

    return [
      { name: '开心', value: counts.happy, color: '#FCD34D' },
      { name: '一般', value: counts.neutral, color: '#D4D4D8' },
      { name: '不佳', value: counts.sad, color: '#93C5FD' },
    ].filter(item => item.value > 0);
  }, [checkIns]);

  if (stats.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-sm shadow-xl border-t-[8px] border-emerald-500 relative mt-8">
      <div className="absolute -top-4 left-6 washi-tape w-24 h-6 bg-emerald-500/20 rotate-1"></div>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-hand font-bold text-vintage-brown">最近30天心情统计</h2>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} stroke="#fff" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'inherit' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-2">
        {stats.map(item => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="font-hand font-bold text-vintage-brown/70">{item.name}: {item.value}天</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DailyCheckIn() {
  const { currentUser, recordCheckIn, dailyCheckIns } = useFamily();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<'happy' | 'neutral' | 'sad'>('happy');
  const [showSuccess, setShowSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const alreadyCheckedIn = dailyCheckIns.some(c => c.date === today && c.userId === currentUser?.id);

  const handleToggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!currentUser) return;
    
    recordCheckIn({
      userId: currentUser.id,
      date: today,
      completedItems: selectedItems,
      mood: selectedMood,
    });
    
    setShowSuccess(true);
    // Modal will stay visible for 5s to allow viewing the chart/stats
    setTimeout(() => setShowSuccess(false), 5000);
  };

  if (alreadyCheckedIn && !showSuccess) {
    return (
      <div className="min-h-screen bg-vintage-texture p-6 pb-24">
        <header className="mb-8 text-center pt-4">
          <h1 className="text-4xl font-hand font-bold text-vintage-brown flex items-center justify-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            今天已经打过卡啦
          </h1>
          <p className="text-lg font-hand text-vintage-brown/60 mt-1">孩子们已经收到您的平安信了 ❤️</p>
        </header>

        <div className="max-w-md mx-auto">
          <MoodStats checkIns={dailyCheckIns} />
          
          <div className="mt-12 text-center p-6 bg-white/40 border border-dashed border-vintage-brown/20 rounded-sm">
             <Smile className="w-10 h-10 text-vintage-orange mx-auto mb-4" />
             <p className="font-hand text-xl text-vintage-brown">好心态是长寿的秘诀，明天继续加油！</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-texture p-6 pb-24">
      <header className="mb-8 text-center pt-4">
        <h1 className="text-4xl font-hand font-bold text-vintage-brown flex items-center justify-center gap-3">
          <Calendar className="w-8 h-8 text-vintage-orange" />
          每日健康打卡
        </h1>
        <p className="text-lg font-hand text-vintage-brown/60 mt-1">{today} 宜：身体健康，心情愉快</p>
      </header>

      <div className="max-w-md mx-auto space-y-8">
        {/* Mood Selection */}
        <section className="bg-white p-6 rounded-sm shadow-xl border-t-[8px] border-vintage-yellow relative">
          <div className="absolute -top-4 left-6 washi-tape w-20 h-6 bg-vintage-orange/20"></div>
          <h2 className="text-2xl font-hand font-bold text-vintage-brown mb-6">您今天心情怎么样？</h2>
          <div className="flex justify-around">
            {MOODS.map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id as any)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl transition-all",
                  selectedMood === mood.id ? "bg-vintage-cream ring-2 ring-vintage-orange scale-110" : "grayscale opacity-50"
                )}
              >
                <mood.icon className={cn("w-12 h-12", mood.color)} />
                <span className="font-hand font-bold text-lg">{mood.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Task Selection */}
        <section className="bg-white p-6 rounded-sm shadow-xl border-t-[8px] border-vintage-orange relative">
          <div className="absolute -top-4 right-6 washi-tape w-24 h-6 bg-vintage-yellow/30"></div>
          <h2 className="text-2xl font-hand font-bold text-vintage-brown mb-6">完成了哪些健康小事？</h2>
          <div className="grid grid-cols-1 gap-4">
            {CHECK_IN_ITEMS.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleToggleItem(item.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                  selectedItems.includes(item.id) 
                    ? "bg-vintage-cream border-vintage-orange shadow-inner translate-x-2" 
                    : "bg-white border-vintage-brown/5 text-vintage-brown/40"
                )}
              >
                <div className={cn(
                  "p-3 rounded-full transition-colors",
                  selectedItems.includes(item.id) ? "bg-white" : "bg-zinc-50"
                )}>
                  <item.icon className={cn("w-6 h-6", item.color)} />
                </div>
                <span className="flex-1 font-hand font-bold text-xl">{item.label}</span>
                {selectedItems.includes(item.id) && (
                  <CheckCircle2 className="w-6 h-6 text-vintage-orange" />
                )}
              </motion.button>
            ))}
          </div>
        </section>

        <button
          onClick={handleSubmit}
          disabled={selectedItems.length === 0}
          className={cn(
            "w-full py-6 rounded-xl font-hand font-bold text-2xl shadow-xl transition-all active:scale-95 disabled:grayscale disabled:opacity-50",
            "bg-vintage-orange text-white shadow-[0_6px_0_rgb(184,84,19)] active:shadow-none translate-y-[-2px] active:translate-y-[4px]"
          )}
        >
          打卡完毕 📮
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-8 rounded-sm shadow-2xl border-[15px] border-white text-center relative overflow-hidden max-w-md w-full"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-4xl font-hand font-bold text-vintage-brown mb-4">打卡成功！</h2>
              <p className="text-xl font-hand text-vintage-brown/60 mb-8">孩子们已经看到您的努力啦 ❤️</p>
              
              <div className="border-t border-dashed border-vintage-brown/20 pt-6">
                <MoodStats checkIns={[...dailyCheckIns, { date: today, mood: selectedMood }]} />
              </div>

              <button 
                onClick={() => setShowSuccess(false)}
                className="mt-8 font-hand text-xl text-vintage-orange font-bold hover:underline"
              >
                我知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
