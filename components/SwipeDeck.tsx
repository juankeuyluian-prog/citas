
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { DateIdea } from '../types';
import { Heart, X, MapPin, Calendar, LayoutGrid, Check, Moon, Sun } from 'lucide-react';

interface SwipeDeckProps {
  dates: DateIdea[];
  onReserve: (date: DateIdea) => void;
  onSkip: (date: DateIdea) => void;
  onViewReservations: () => void;
  reservationCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const triggerHaptic = (duration: number = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration);
  }
};

const SwipeDeck: React.FC<SwipeDeckProps> = ({ 
  dates, 
  onReserve, 
  onSkip, 
  onViewReservations,
  reservationCount,
  isDarkMode,
  toggleDarkMode
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState<number | string>(0);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const heartOpacity = useTransform(x, [50, 150], [0, 1]);
  const crossOpacity = useTransform(x, [-50, -150], [0, 1]);

  const swipe = (direction: 'left' | 'right') => {
    if (currentIndex >= dates.length) return;
    
    // Subtle haptic for the action
    triggerHaptic(direction === 'right' ? 20 : 15);
    setExitX(direction === 'right' ? 500 : -500);
    
    setTimeout(() => {
      const date = dates[currentIndex];
      if (direction === 'right') onReserve(date);
      else onSkip(date);
      setCurrentIndex(prev => prev + 1);
      x.set(0);
    }, 50);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      swipe('right');
    } else if (info.offset.x < -100) {
      swipe('left');
    } else {
      x.set(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent transition-colors duration-500 overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center px-8 pt-12 pb-4 z-30"
      >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Citas para vos</h2>
        
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { triggerHaptic(5); toggleDarkMode(); }}
            className="w-10 h-10 rounded-full glass border border-white/50 dark:border-white/10 shadow-sm flex items-center justify-center"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { triggerHaptic(8); onViewReservations(); }}
            className="relative glass w-11 h-11 rounded-full shadow-lg border border-white/50 dark:border-white/10 flex items-center justify-center"
          >
            <LayoutGrid className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            {reservationCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
              >
                {reservationCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Card Area */}
      <div className="flex-1 relative px-8 flex items-center justify-center overflow-hidden mb-2">
        <AnimatePresence mode="popLayout">
          {currentIndex < dates.length ? (
            <>
              {/* Background Card */}
              {currentIndex + 1 < dates.length && (
                <motion.div
                  key={dates[currentIndex + 1].id}
                  initial={{ scale: 0.9, opacity: 0.5, y: 15 }}
                  animate={{ scale: 0.95, opacity: 0.7, y: 0 }}
                  className="absolute w-full max-w-[340px] aspect-[4/5] sm:aspect-[3.4/4.5] z-10 pointer-events-none"
                >
                  <div className="relative h-full w-full rounded-[3.2rem] overflow-hidden shadow-lg border border-white/20 glass-dark opacity-30">
                    <img src={dates[currentIndex + 1].image} className="w-full h-full object-cover grayscale-[20%]" />
                  </div>
                </motion.div>
              )}

              {/* Active Card */}
              <motion.div
                key={dates[currentIndex].id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x, rotate, opacity }}
                onDragEnd={handleDragEnd}
                exit={{ x: exitX, opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="relative w-full max-w-[360px] aspect-[4/5] sm:aspect-[3.4/4.5] cursor-grab active:cursor-grabbing z-20"
              >
                <div className="relative h-full w-full rounded-[3.5rem] overflow-hidden shadow-[0_45px_110px_rgba(0,0,0,0.08)] dark:shadow-[0_45px_110px_rgba(0,0,0,0.4)] border border-white/30 dark:border-white/10 glass">
                  <img 
                    src={dates[currentIndex].image} 
                    alt={dates[currentIndex].title}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  
                  {/* Labels */}
                  <motion.div style={{ opacity: heartOpacity }} className="absolute top-10 right-10 border-4 border-emerald-400 rounded-xl p-3 rotate-12 bg-emerald-400/10 backdrop-blur-md pointer-events-none z-30">
                    <p className="text-emerald-400 font-black text-3xl uppercase tracking-widest">SÍ</p>
                  </motion.div>
                  <motion.div style={{ opacity: crossOpacity }} className="absolute top-10 left-10 border-4 border-rose-400 rounded-xl p-3 -rotate-12 bg-rose-400/10 backdrop-blur-md pointer-events-none z-30">
                    <p className="text-rose-400 font-black text-3xl uppercase tracking-widest">NO</p>
                  </motion.div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-8 pt-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white mb-3 uppercase tracking-[0.1em] border border-white/10">
                      {dates[currentIndex].tag}
                    </span>
                    <h3 className="text-3xl font-bold text-white mb-2 leading-tight drop-shadow-sm">{dates[currentIndex].title}</h3>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2 font-medium leading-relaxed">
                      {dates[currentIndex].description}
                    </p>
                    
                    {dates[currentIndex].location && (
                      <div className="flex items-center gap-2 text-white/60 text-[11px] font-semibold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{dates[currentIndex].location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center px-10">
              <div className="w-20 h-20 bg-rose-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                <Calendar className="w-10 h-10 text-rose-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">¡Eso es todo!</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed text-sm">Has revisado todas las ideas sugeridas.</p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { triggerHaptic(10); onViewReservations(); }}
                className="glass-dark px-10 py-4.5 rounded-2xl text-slate-800 dark:text-white font-bold shadow-lg border border-white/20"
              >
                Ver mis reservas
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Mirror Glass Footer Controls */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative px-8 pb-12 flex justify-center items-center gap-10 z-30"
      >
        {/* Skip Button (X) - Refined Round Glass */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: -8, y: -4 }}
          whileTap={{ scale: 0.9 }}
          disabled={currentIndex >= dates.length}
          onClick={() => swipe('left')}
          className="relative group w-20 h-20 flex items-center justify-center rounded-full overflow-hidden transition-all disabled:opacity-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/80"
        >
          {/* Main Glass Body */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-3xl transition-colors group-hover:bg-white/95" />
          
          {/* Inner Glossy Gradient - Radial to avoid "squared" edges */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent)]" />

          {/* Top Specular Edge Highlight - Softened */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
          
          {/* Subtle Bottom Glow Ring */}
          <div className="absolute inset-0 rounded-full border border-black/5" />
          
          {/* Icon */}
          <X className="relative z-10 w-8 h-8 text-rose-500 stroke-[3.5px] drop-shadow-[0_2px_4px_rgba(244,63,94,0.08)]" />
          
          {/* Surface Reflection Shimmer */}
          <motion.div 
            initial={{ x: '-150%', skewX: -30 }}
            whileHover={{ x: '150%' }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none"
          />
        </motion.button>

        {/* Like Button (Check) - Refined Round Glass - Same size as X */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 8, y: -4 }}
          whileTap={{ scale: 0.9 }}
          disabled={currentIndex >= dates.length}
          onClick={() => swipe('right')}
          className="relative group w-20 h-20 flex items-center justify-center rounded-full overflow-hidden transition-all disabled:opacity-20 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] border border-white"
        >
          {/* Main Glass Body */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl transition-colors group-hover:bg-white" />
          
          {/* Inner Glossy Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.5),transparent)]" />

          {/* Top Specular Edge Highlight */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent brightness-110" />
          
          {/* Subtle Color Infusion */}
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Icon */}
          <Check className="relative z-10 w-10 h-10 text-emerald-500 stroke-[4px] drop-shadow-[0_2px_8px_rgba(16,185,129,0.15)]" />
          
          {/* High-intensity Surface Shimmer */}
          <motion.div 
            initial={{ x: '-150%', skewX: -30 }}
            whileHover={{ x: '150%' }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent z-20 pointer-events-none"
          />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SwipeDeck;
