import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Brain, Clock, Hash, Zap, Paperclip } from 'lucide-react';
import { useFamily } from '../FamilyContext';
import { HEALTH_KNOWLEDGE } from '../data/gameData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GRID_SIZE = 6;
const TILE_TYPES = HEALTH_KNOWLEDGE.length;

interface Tile {
  id: string;
  knowledgeId: string;
  type: string;
  imageUrl: string;
  icon: string;
  x: number;
  y: number;
}

export default function FoodMatchGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const { recordGameScore, learnKnowledge, currentUser } = useFamily();
  const isDaily = location.state?.type === 'daily';

  const [grid, setGrid] = useState<Tile[][]>([]);
  const [selected, setSelected] = useState<{ x: number, y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'error' = 'light') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      switch (type) {
        case 'light': window.navigator.vibrate(10); break;
        case 'medium': window.navigator.vibrate(20); break;
        case 'success': window.navigator.vibrate([20, 50, 20]); break;
        case 'error': window.navigator.vibrate([50, 100, 50]); break;
      }
    }
  };

  const createTile = (x: number, y: number): Tile => {
    const k = HEALTH_KNOWLEDGE[Math.floor(Math.random() * TILE_TYPES)];
    return {
      id: Math.random().toString(36).substr(2, 9),
      knowledgeId: k.id,
      type: k.ingredient,
      imageUrl: k.imageUrl,
      icon: k.icon,
      x,
      y
    };
  };

  const initGrid = useCallback(() => {
    let newGrid: Tile[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      newGrid[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        // Prevent initial 3-in-a-row
        let tile: Tile;
        do {
          tile = createTile(x, y);
        } while (
          (x >= 2 && newGrid[y][x - 1].knowledgeId === tile.knowledgeId && newGrid[y][x - 2].knowledgeId === tile.knowledgeId) ||
          (y >= 2 && newGrid[y - 1][x].knowledgeId === tile.knowledgeId && newGrid[y - 2][x].knowledgeId === tile.knowledgeId)
        );
        newGrid[y][x] = tile;
      }
    }
    setGrid(newGrid);
    setScore(0);
    setTime(0);
    setIsActive(false);
    setShowResult(false);
    setIsProcessing(false);
    setCountdown(3);
  }, []);

  const findMatches = (currentGrid: Tile[][]) => {
    const matches: { x: number, y: number }[] = [];
    // Horizontal
    for (let y = 0; y < GRID_SIZE; y++) {
      let matchCount = 1;
      for (let x = 1; x < GRID_SIZE; x++) {
        if (currentGrid[y][x].knowledgeId === currentGrid[y][x - 1].knowledgeId) {
          matchCount++;
        } else {
          if (matchCount >= 3) {
            for (let i = 0; i < matchCount; i++) matches.push({ x: x - 1 - i, y });
          }
          matchCount = 1;
        }
      }
      if (matchCount >= 3) {
        for (let i = 0; i < matchCount; i++) matches.push({ x: GRID_SIZE - 1 - i, y });
      }
    }
    // Vertical
    for (let x = 0; x < GRID_SIZE; x++) {
      let matchCount = 1;
      for (let y = 1; y < GRID_SIZE; y++) {
        if (currentGrid[y][x].knowledgeId === currentGrid[y - 1][x].knowledgeId) {
          matchCount++;
        } else {
          if (matchCount >= 3) {
            for (let i = 0; i < matchCount; i++) matches.push({ x, y: y - 1 - i });
          }
          matchCount = 1;
        }
      }
      if (matchCount >= 3) {
        for (let i = 0; i < matchCount; i++) matches.push({ x, y: GRID_SIZE - 1 - i });
      }
    }
    // Deduplicate
    return Array.from(new Set(matches.map(m => `${m.x},${m.y}`))).map(s => {
      const [x, y] = s.split(',').map(Number);
      return { x, y };
    });
  };

  const processMatches = async (currentGrid: Tile[][]) => {
    const matches = findMatches(currentGrid);
    if (matches.length === 0) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    triggerHaptic('success');

    // Show knowledge for matched items
    const firstMatch = matches[0];
    const knowledge = HEALTH_KNOWLEDGE.find(k => k.id === currentGrid[firstMatch.y][firstMatch.x].knowledgeId);
    if (knowledge && Math.random() > 0.5) {
      setShowKnowledge(`${knowledge.icon} ${knowledge.ingredient}: ${knowledge.benefit}`);
      learnKnowledge(knowledge.id);
      setTimeout(() => setShowKnowledge(null), 2000);
    }

    setScore(s => s + matches.length * 10);

    // Remove logic
    const nextGrid = [...currentGrid.map(row => [...row])];
    matches.forEach(m => {
      nextGrid[m.y][m.x] = { ...nextGrid[m.y][m.x], id: '' }; // Marker for removal
    });

    // Drop
    for (let x = 0; x < GRID_SIZE; x++) {
      let emptyCount = 0;
      for (let y = GRID_SIZE - 1; y >= 0; y--) {
        if (nextGrid[y][x].id === '') {
          emptyCount++;
        } else if (emptyCount > 0) {
          nextGrid[y + emptyCount][x] = nextGrid[y][x];
          nextGrid[y + emptyCount][x].y = y + emptyCount;
          nextGrid[y][x] = { ...nextGrid[y][x], id: '' };
        }
      }
      // Fill new
      for (let y = 0; y < emptyCount; y++) {
        nextGrid[y][x] = createTile(x, y);
      }
    }

    setTimeout(() => {
      setGrid(nextGrid);
      processMatches(nextGrid);
    }, 300);
  };

  const handleTileClick = async (x: number, y: number) => {
    if (!isActive || isProcessing) return;

    if (!selected) {
      setSelected({ x, y });
      triggerHaptic('light');
      return;
    }

    // Check adjacency
    const isAdjacent = Math.abs(selected.x - x) + Math.abs(selected.y - y) === 1;

    if (isAdjacent) {
      setIsProcessing(true);
      const nextGrid = [...grid.map(row => [...row])];
      
      // Swap
      const temp = nextGrid[y][x];
      nextGrid[y][x] = { ...nextGrid[selected.y][selected.x], x, y };
      nextGrid[selected.y][selected.x] = { ...temp, x: selected.x, y: selected.y };
      
      setGrid(nextGrid);
      setSelected(null);

      // Check for matches
      const matches = findMatches(nextGrid);
      if (matches.length > 0) {
        setTimeout(() => processMatches(nextGrid), 200);
      } else {
        // Swap back
        triggerHaptic('error');
        setTimeout(() => {
          const revertedGrid = [...grid.map(row => [...row])];
          setGrid(revertedGrid);
          setIsProcessing(false);
        }, 400);
      }
    } else {
      setSelected({ x, y });
      triggerHaptic('light');
    }
  };

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCountdown(null);
        setIsActive(true);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
        if (time >= 60) {
          setIsActive(false);
          finishGame();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const finishGame = () => {
    recordGameScore({
      userId: currentUser?.id || '',
      score,
      time: 60,
      flips: 0,
      date: new Date().toISOString().split('T')[0],
      type: isDaily ? 'daily' : 'practice'
    });
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-vintage-texture pb-10 flex flex-col items-center select-none overflow-hidden">
      {/* High-end Dashboard Header */}
      <header className="w-full bg-white/90 backdrop-blur-md px-6 py-6 shadow-md border-b-2 border-vintage-brown/5 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => navigate('/game-home')} className="p-3 bg-white shadow-sm border border-vintage-brown/10 rounded-xl active:scale-95 transition-all text-vintage-brown">
          <ArrowLeft className="w-7 h-7" />
        </button>
        
        <div className="flex bg-vintage-cream/30 p-1.5 rounded-2xl border border-vintage-brown/5 shadow-inner">
          <div className="px-6 py-1 flex flex-col items-center border-r border-vintage-brown/10">
            <span className="text-[10px] font-retro text-zinc-400 uppercase tracking-widest mb-0.5">Time Left</span>
            <div className="flex items-center gap-2">
              <Clock className={cn("w-5 h-5", time > 50 ? "text-red-500 animate-bounce" : "text-vintage-brown")} />
              <span className={cn("text-2xl font-retro font-black tabular-nums", time > 50 ? "text-red-600" : "text-vintage-brown")}>
                {60 - time}
              </span>
            </div>
          </div>
          <div className="px-6 py-1 flex flex-col items-center">
            <span className="text-[10px] font-retro text-zinc-400 uppercase tracking-widest mb-0.5">Total Score</span>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-vintage-yellow fill-vintage-yellow" />
              <motion.span 
                key={score}
                initial={{ scale: 1.2, color: '#E67E22' }}
                animate={{ scale: 1, color: '#5D4037' }}
                className="text-2xl font-retro font-black tabular-nums text-vintage-brown"
              >
                {score}
              </motion.span>
            </div>
          </div>
        </div>

        <button onClick={initGrid} className="p-3 bg-white shadow-sm border border-vintage-brown/10 rounded-xl active:rotate-180 transition-all duration-500 text-vintage-brown">
          <RotateCcw className="w-7 h-7" />
        </button>
      </header>

      <main className="p-4 w-full max-w-md relative flex-1 flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="w-full bg-vintage-brown/5 h-2 rounded-full mb-8 overflow-hidden border border-vintage-brown/5 p-0.5">
          <motion.div 
            className="h-full bg-gradient-to-r from-vintage-yellow to-vintage-orange rounded-full shadow-[0_0_8px_rgba(230,126,34,0.3)]"
            initial={{ width: "100%" }}
            animate={{ width: `${((60 - time) / 60) * 100}%` }}
          />
        </div>

        {/* Countdown Overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex items-center justify-center bg-vintage-cream/80 backdrop-blur-md pointer-events-none"
            >
              <div className="relative">
                <motion.div
                  key={`ring-${countdown}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  className="absolute inset-0 rounded-full border-4 border-vintage-orange/20"
                />
                <motion.span
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                  exit={{ scale: 2, opacity: 0, rotate: 15 }}
                  className="text-9xl font-hand font-bold text-vintage-brown drop-shadow-2xl relative z-10 block"
                >
                  {countdown === 0 ? "开始！" : countdown}
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Game Board */}
        <div className="game-board aspect-square">
          <div className="grid grid-cols-6 gap-2 h-full w-full relative z-10">
            {grid.map((row, y) => row.map((tile, x) => {
              const isSelected = selected?.x === x && selected?.y === y;
              return (
                <motion.div
                  key={tile.id}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTileClick(x, y)}
                  className={cn(
                    "game-tile cursor-pointer group",
                    isSelected && "selected"
                  )}
                >
                  <div className="game-tile-inner">
                    <div className="game-tile-face shadow-inner">
                      <img 
                        src={tile.imageUrl} 
                        alt={tile.type} 
                        className="w-[85%] h-[85%] object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]" 
                        referrerPolicy="no-referrer"
                      />
                      {/* Selection Glow */}
                      {isSelected && (
                        <motion.div 
                          layoutId="selection-glow"
                          className="absolute inset-0 bg-vintage-yellow/10 rounded-xl"
                          animate={{ opacity: [0.1, 0.3, 0.1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                      )}
                      
                      {/* Tile Gloss */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none rounded-xl" />
                    </div>
                  </div>
                </motion.div>
              );
            }))}
          </div>

          {/* Board Background Details */}
          <div className="absolute top-4 right-4 text-vintage-brown/5 font-retro text-6xl select-none rotate-12">FOOD</div>
          <div className="absolute bottom-4 left-4 text-vintage-brown/5 font-retro text-6xl select-none -rotate-12">TIME</div>
        </div>

        <div className="mt-8 text-center p-6 vintage-card border-none bg-white/20 shadow-none ring-1 ring-vintage-brown/5">
          <Paperclip className="absolute -top-3 -left-2 w-8 h-8 text-vintage-brown/20 rotate-[-15deg]" />
          <p className="font-retro font-bold text-vintage-brown text-lg">连成 <span className="text-vintage-orange underline">3个</span> 或更多同款食材</p>
          <p className="font-retro text-vintage-brown/40 text-sm mt-1">滑动指尖，焕发大脑活力</p>
        </div>
      </main>

      {/* High-end Knowledge Note Popup */}
      <AnimatePresence>
        {showKnowledge && (
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed bottom-[15%] left-6 right-6 z-[100] preserve-3d"
          >
            <div className="vintage-card p-8 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-t-8 border-vintage-orange">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 washi-tape rotate-0 h-10 w-32 bg-vintage-orange/40" />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-vintage-cream/50 rounded-full flex items-center justify-center text-4xl shadow-inner border border-vintage-brown/5">
                  {showKnowledge.split(' ')[0]}
                </div>
                <p className="text-2xl font-hand font-bold text-vintage-brown text-center leading-relaxed">
                  {showKnowledge.split(': ')[1]}
                </p>
                <div className="h-0.5 w-12 bg-vintage-orange/20 rounded-full" />
                <span className="text-xs font-retro uppercase tracking-widest text-zinc-400">Knowledge Unlocked</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-end Result Modal */}
      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 bg-vintage-brown/40 backdrop-blur-xl flex items-center justify-center p-6 z-[200]">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, rotateY: -20 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              className="bg-white w-full max-w-sm rounded-[40px] p-10 text-center relative border-[16px] border-white shadow-[0_40px_80px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute top-0 right-10 washi-tape transform rotate-12 h-12 w-24 bg-vintage-yellow/60" />
              
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-vintage-yellow/20 rounded-full blur-2xl animate-pulse" />
                <Trophy className="w-24 h-24 text-vintage-yellow mx-auto relative z-10 drop-shadow-lg" />
              </div>

              <h2 className="text-5xl font-hand font-bold text-vintage-brown mb-4">今日成果集</h2>
              <p className="text-vintage-brown/60 font-retro italic mb-10 text-lg">每一份消除，都是给大脑的养分</p>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="bg-vintage-cream/30 p-5 rounded-3xl border border-vintage-brown/5">
                  <span className="block text-[10px] text-zinc-400 font-retro uppercase tracking-widest mb-1">Total Score</span>
                  <span className="text-4xl font-retro font-black text-vintage-orange">{score}</span>
                </div>
                <div className="bg-vintage-cream/30 p-5 rounded-3xl border border-vintage-brown/5">
                  <span className="block text-[10px] text-zinc-400 font-retro uppercase tracking-widest mb-1">Knowledge Gained</span>
                  <span className="text-4xl font-retro font-black text-vintage-brown">{Math.floor(score / 50)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/leaderboard')}
                  className="vintage-btn-primary w-full py-5 text-3xl"
                >
                  好友龙虎榜 🏆
                </button>
                <button 
                  onClick={() => navigate('/game-home')}
                  className="vintage-btn-secondary w-full py-5 border-none shadow-none opacity-60 hover:opacity-100"
                >
                  返回主页
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
