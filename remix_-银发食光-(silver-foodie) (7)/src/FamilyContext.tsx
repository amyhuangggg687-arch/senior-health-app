import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, FamilyGroup, FamilyMember, SharedContent, HealthProfile, GameScore, DailyCheckIn } from './types';

interface FamilyContextType extends AppState {
  setCurrentUser: (user: FamilyMember) => void;
  updateHealthProfile: (profile: HealthProfile) => void;
  shareVideo: (videoId: string, message?: string) => void;
  updateSharedItem: (id: string, updates: Partial<SharedContent>) => void;
  toggleFavorite: (id: string) => void;
  recordGameScore: (score: Omit<GameScore, 'id'>) => void;
  learnKnowledge: (id: string) => void;
  recordCheckIn: (checkIn: Omit<DailyCheckIn, 'id' | 'timestamp'>) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

const DEFAULT_SENIOR: FamilyMember = {
  id: 'senior_1',
  name: '张大爷',
  role: 'senior',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
};

const DEFAULT_CHILD: FamilyMember = {
  id: 'child_1',
  name: '小张',
  role: 'child',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
};

const INITIAL_PROFILE: HealthProfile = {
  conditions: ['高血压'],
  restrictions: ['少盐', '少糖'],
  dentalStatus: 'fair',
  preferences: ['清淡', '面食']
};

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FamilyMember | null>(null);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>({
    id: 'fam_1',
    senior: DEFAULT_SENIOR,
    children: [DEFAULT_CHILD],
    healthProfile: INITIAL_PROFILE
  });
  const [sharedItems, setSharedItems] = useState<SharedContent[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [gameScores, setGameScores] = useState<GameScore[]>([]);
  const [learnedKnowledgeIds, setLearnedKnowledgeIds] = useState<string[]>([]);
  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>([]);

  // Generate some mock history if empty
  const generateMockCheckIns = () => {
    const mockData: DailyCheckIn[] = [];
    const moods: ('happy' | 'neutral' | 'sad')[] = ['happy', 'happy', 'happy', 'neutral', 'neutral', 'sad'];
    for (let i = 1; i <= 30; i++) {
       const date = new Date();
       date.setDate(date.getDate() - i);
       mockData.push({
         id: `mock_${i}`,
         userId: 'senior_1',
         date: date.toISOString().split('T')[0],
         completedItems: ['water', 'medicine'],
         mood: moods[Math.floor(Math.random() * moods.length)],
         timestamp: date.getTime()
       });
    }
    return mockData;
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('silver_foodie_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSharedItems(parsed.sharedItems || []);
      setFavoriteIds(parsed.favoriteIds || []);
      setGameScores(parsed.gameScores || []);
      setLearnedKnowledgeIds(parsed.learnedKnowledgeIds || []);
      
      const checkIns = parsed.dailyCheckIns || [];
      if (checkIns.length === 0) {
        setDailyCheckIns(generateMockCheckIns());
      } else {
        setDailyCheckIns(checkIns);
      }
      
      if (parsed.familyGroup) setFamilyGroup(parsed.familyGroup);
    } else {
      // First time user
      setDailyCheckIns(generateMockCheckIns());
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('silver_foodie_state', JSON.stringify({ 
      sharedItems, 
      familyGroup, 
      favoriteIds,
      gameScores,
      learnedKnowledgeIds,
      dailyCheckIns
    }));
  }, [sharedItems, familyGroup, favoriteIds, gameScores, learnedKnowledgeIds, dailyCheckIns]);

  const shareVideo = (videoId: string, message?: string) => {
    if (!currentUser) return;
    const newItem: SharedContent = {
      id: Math.random().toString(36).substr(2, 9),
      videoId,
      sharedBy: currentUser.id,
      timestamp: Date.now(),
      status: 'pending',
      message
    };
    setSharedItems(prev => [newItem, ...prev]);
  };

  const updateSharedItem = (id: string, updates: Partial<SharedContent>) => {
    setSharedItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const updateHealthProfile = (profile: HealthProfile) => {
    if (familyGroup) {
      setFamilyGroup({ ...familyGroup, healthProfile: profile });
    }
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const recordGameScore = (score: Omit<GameScore, 'id'>) => {
    const newScore: GameScore = {
      ...score,
      id: Math.random().toString(36).substr(2, 9)
    };
    setGameScores(prev => [newScore, ...prev]);
  };

  const learnKnowledge = (id: string) => {
    setLearnedKnowledgeIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const recordCheckIn = (checkIn: Omit<DailyCheckIn, 'id' | 'timestamp'>) => {
    const newCheckIn: DailyCheckIn = {
      ...checkIn,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setDailyCheckIns(prev => [newCheckIn, ...prev]);
  };

  return (
    <FamilyContext.Provider value={{ 
      currentUser, 
      familyGroup, 
      sharedItems, 
      favoriteIds,
      gameScores,
      learnedKnowledgeIds,
      dailyCheckIns,
      setCurrentUser, 
      updateHealthProfile, 
      shareVideo,
      updateSharedItem,
      toggleFavorite,
      recordGameScore,
      learnKnowledge,
      recordCheckIn
    }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}
