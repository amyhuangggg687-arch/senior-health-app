/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'senior' | 'child';

export interface HealthProfile {
  conditions: string[]; // e.g., "高血压", "糖尿病"
  restrictions: string[]; // e.g., "忌辛辣", "少盐"
  dentalStatus: 'good' | 'fair' | 'poor'; // 牙口状况
  preferences: string[]; // 喜好
}

export interface FamilyMember {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface FamilyGroup {
  id: string;
  senior: FamilyMember;
  children: FamilyMember[];
  healthProfile: HealthProfile;
}

export interface VideoContent {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  author: string;
  likes: number;
  description: string;
  ingredients: string[];
}

export interface SharedContent {
  id: string;
  videoId: string;
  sharedBy: string; // userId
  timestamp: number;
  status: 'pending' | 'analyzed' | 'recommended';
  analysis?: string; // AI analyzed recipe
  message?: string; // 留言
  reply?: string;   // 回复
}

export interface GameScore {
  id: string;
  userId: string;
  score: number;
  time: number;
  flips: number;
  date: string; // YYYY-MM-DD
  type: 'daily' | 'practice';
}

export interface HealthKnowledge {
  id: string;
  ingredient: string;
  benefit: string;
  icon: string;
  imageUrl: string;
  category: '控糖' | '补钙' | '护心' | '护眼' | '通用';
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  completedItems: string[]; // e.g., ["喝水", "吃药"]
  mood: 'happy' | 'neutral' | 'sad';
  timestamp: number;
}

export interface AppState {
  currentUser: FamilyMember | null;
  familyGroup: FamilyGroup | null;
  sharedItems: SharedContent[];
  favoriteIds: string[];
  gameScores: GameScore[];
  learnedKnowledgeIds: string[];
  dailyCheckIns: DailyCheckIn[];
}
