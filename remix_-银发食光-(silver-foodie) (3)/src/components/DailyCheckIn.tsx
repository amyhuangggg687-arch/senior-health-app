import { useState } from 'react';
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
  Utensils
} from 'lucide-react';
import { cn } from '../lib/utils';

const CHECK_IN_ITEMS = [
  { id: 'water', label: '喝足水', icon: Droplets, color: 'text-blue-500' },
  { id: 'medicine', label: '吃过药', icon: Pill, color: 'text-red-500' },
  { id: 'exercise', label: '动一动', icon: Dumbbell, color: 'text-green-500' },
  { id: 'fruit', label: '吃水果', icon: Utensils, color: 'text-orange-500' },
  { id: 'sleep', label: '睡得香', icon: Moon, color: 'text-indigo-500' },
];

const MOODS = [
  { id: 'happy', label: '开心', icon: Smile, color: 'text-yellow-500' },
  { id: 'neutral', label: '一般', icon: Meh, color: 'text-zinc-500' },
  { id: 'sad', label: '不太好', icon: Frown, color: 'text-blue-400' },
];

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
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (alreadyCheckedIn && !showSuccess) {
    return (
      <div className="min-h-screen bg-vintage-texture p-6 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-sm shadow-2xl border-[10px] border-white text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-hand font-bold text-vintage-brown mb-4">今天已经打过卡啦！</h2>
          <p className="text-xl font-hand text-vintage-brown/60">孩子们已经收到您的平安信了。明天继续加油哦！</p>
        </motion.div>
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              className="bg-white p-10 rounded-sm shadow-2xl border-[15px] border-white text-center relative overflow-hidden"
              animate={{ rotate: [0, -1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-4xl font-hand font-bold text-vintage-brown mb-4">打卡成功！</h2>
              <p className="text-xl font-hand text-vintage-brown/60">孩子们已经看到您的努力啦 ❤️</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
