/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FamilyProvider, useFamily } from './FamilyContext';
import SeniorFeed from './components/SeniorFeed';
import ChildDashboard from './components/ChildDashboard';
import SeniorNotifications from './components/SeniorNotifications';
import SeniorFavorites from './components/SeniorFavorites';
import GameHome from './components/GameHome';
import FoodMatchGame from './components/FoodMatchGame';
import Leaderboard from './components/Leaderboard';
import KnowledgeBook from './components/KnowledgeBook';
import { User, Users, Bell, PlayCircle, Star, Brain } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Navigation() {
  const location = useLocation();
  const { currentUser, setCurrentUser, familyGroup, sharedItems } = useFamily();

  const seniorNotificationCount = sharedItems.filter(item => item.status === 'recommended').length;
  const childNotificationCount = sharedItems.filter(item => item.status === 'pending').length;

  const toggleRole = () => {
    if (!currentUser || currentUser.role === 'senior') {
      setCurrentUser(familyGroup!.children[0]);
    } else {
      setCurrentUser(familyGroup!.senior);
    }
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-vintage-texture flex flex-col items-center justify-center p-8 z-[100]">
        <div className="relative mb-12">
          <div className="washi-tape -top-4 -left-8 bg-vintage-yellow/40"></div>
          <h1 className="text-6xl font-hand font-bold text-vintage-brown drop-shadow-md">银发食光</h1>
          <div className="washi-tape -bottom-2 -right-6 bg-vintage-orange/30 rotate-[5deg]"></div>
        </div>
        <p className="text-vintage-brown/60 mb-16 text-2xl font-hand italic tracking-wide">连接两代人的健康美味</p>
        
        <div className="grid grid-cols-1 gap-10 w-full max-w-xs">
          <button 
            onClick={() => setCurrentUser(familyGroup!.senior)}
            className="vintage-card p-6 flex items-center gap-6 hover:scale-105 transition-all group border-vintage-orange/20"
          >
            <div className="w-16 h-16 bg-white p-1 shadow-lg border-2 border-vintage-cream rotate-[-5deg]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full object-cover" alt="Senior" />
            </div>
            <div className="text-left">
              <span className="block text-3xl font-hand font-bold text-vintage-brown leading-none mb-1">我是长辈</span>
              <span className="text-sm font-retro text-zinc-400 font-bold opacity-60">看视频 享健康</span>
            </div>
          </button>

          <button 
            onClick={() => setCurrentUser(familyGroup!.children[0])}
            className="vintage-card p-6 flex items-center gap-6 hover:scale-105 transition-all group border-vintage-yellow/20"
          >
            <div className="w-16 h-16 bg-white p-1 shadow-lg border-2 border-vintage-cream rotate-[5deg]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" className="w-full h-full object-cover" alt="Child" />
            </div>
            <div className="text-left">
              <span className="block text-3xl font-hand font-bold text-vintage-brown leading-none mb-1">我是子女</span>
              <span className="text-sm font-retro text-zinc-400 font-bold opacity-60">尽孝心 管健康</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  const isSenior = currentUser.role === 'senior';

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 px-6 py-4 flex justify-around items-center z-50 border-t-4 bg-white/95 backdrop-blur-md border-vintage-brown/5 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
    )}>
      {isSenior ? (
        <>
          <Link 
            to="/" 
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === '/' ? "text-vintage-orange scale-110" : "text-vintage-brown/30"
            )}
          >
            <PlayCircle className={cn("w-8 h-8", location.pathname === '/' && "drop-shadow-sm")} />
            <span className="text-sm font-hand font-bold">每日食光</span>
          </Link>
          <Link 
            to="/notifications" 
            className={cn(
              "flex flex-col items-center gap-1 transition-all relative",
              location.pathname === '/notifications' ? "text-vintage-orange scale-110" : "text-vintage-brown/30"
            )}
          >
            <Bell className={cn("w-8 h-8", location.pathname === '/notifications' && "drop-shadow-sm")} />
            {seniorNotificationCount > 0 && (
              <span className="absolute -top-1 -right-0 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold animate-bounce">
                {seniorNotificationCount}
              </span>
            )}
            <span className="text-sm font-hand font-bold">孩子叮嘱</span>
          </Link>
          <Link 
            to="/favorites" 
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === '/favorites' ? "text-vintage-yellow scale-110" : "text-vintage-brown/30"
            )}
          >
            <Star className={cn("w-8 h-8", location.pathname === '/favorites' && "fill-vintage-yellow drop-shadow-sm")} />
            <span className="text-sm font-hand font-bold">我的收藏</span>
          </Link>
          <Link 
            to="/game-home" 
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === '/game-home' || location.pathname === '/game' || location.pathname === '/leaderboard' ? "text-vintage-orange scale-110" : "text-vintage-brown/30"
            )}
          >
            <Brain className={cn("w-8 h-8", (location.pathname === '/game-home' || location.pathname === '/game') && "drop-shadow-sm")} />
            <span className="text-sm font-hand font-bold">健脑游戏</span>
          </Link>
        </>
      ) : (
        <Link 
          to="/child" 
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative",
            location.pathname === '/child' ? "text-vintage-orange scale-110" : "text-vintage-brown/30"
          )}
        >
          <Users className="w-8 h-8" />
          {childNotificationCount > 0 && (
            <span className="absolute -top-1 -right-0 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold animate-bounce">
              {childNotificationCount}
            </span>
          )}
          <span className="text-sm font-hand font-bold">健康记录本</span>
        </Link>
      )}
      
      <div className="w-px h-8 bg-vintage-brown/10 mx-2"></div>

      <button 
        onClick={toggleRole}
        className="flex flex-col items-center gap-1 group"
      >
        <div className={cn(
          "w-10 h-10 bg-white p-1 shadow-md border-2 transition-all group-hover:rotate-12",
          isSenior ? "border-vintage-orange" : "border-vintage-yellow"
        )}>
          <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Avatar" />
        </div>
        <span className="text-xs font-bold font-hand text-vintage-brown tracking-tighter">身份切换</span>
      </button>
    </nav>
  );
}

export default function App() {
  return (
    <FamilyProvider>
      <Router>
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
          <Routes>
            <Route path="/" element={<SeniorFeed />} />
            <Route path="/child" element={<ChildDashboard />} />
            <Route path="/notifications" element={<SeniorNotifications />} />
            <Route path="/favorites" element={<SeniorFavorites />} />
            <Route path="/game-home" element={<GameHome />} />
            <Route path="/game" element={<FoodMatchGame />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/knowledge-book" element={<KnowledgeBook />} />
          </Routes>
          <Navigation />
        </div>
      </Router>
    </FamilyProvider>
  );
}
