
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, Sun, Moon, Minus } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 28, stiffness: 120 },
  },
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, isDarkMode, toggleDarkMode }) => {
  return (
    <motion.div 
      {...({
        variants: containerVariants,
        initial: "hidden",
        animate: "visible"
      } as any)}
      className="flex flex-col items-center justify-between h-full py-20 px-10 text-center relative overflow-hidden bg-transparent"
    >
      {/* Dark Mode Toggle - Top Right */}
      <div className="absolute top-12 right-10 z-50">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="p-2 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-indigo-400 fill-indigo-100/30" />
          )}
        </motion.button>
      </div>

      {/* Headline - Refined typography and hierarchy */}
      <motion.div {...({ variants: itemVariants } as any)} className="z-10 mt-2">
        <h1 className="text-[34px] leading-[1.15] font-light text-slate-800 dark:text-slate-100 tracking-tight">
          Tu app <span className="font-bold">personal</span><br />
          para<br />
          elegir <span className="font-bold">nuestras citas</span>
        </h1>
      </motion.div>

      {/* Central Illustration - Balanced for Visual Harmony */}
      <motion.div 
        {...({ variants: itemVariants } as any)}
        className="relative w-full flex-1 flex items-center justify-center py-12"
      >
        <div className="relative">
          {/* Main Large Circular Orb */}
          <motion.div 
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.01, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-white/30 dark:bg-slate-800/20 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center justify-center z-10"
          >
            <div className="relative z-20">
              <Calendar className="w-20 h-20 text-indigo-500/80 dark:text-indigo-400/90 stroke-[1.5px]" />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-1 -right-1"
              >
                <Heart className="w-10 h-10 text-rose-500 fill-rose-500 drop-shadow-[0_4px_12px_rgba(244,63,94,0.3)]" />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Floating Elements - Precision positions from screenshot */}
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 -left-10 z-20 w-11 h-11 bg-white/60 dark:bg-slate-700/40 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/40 dark:border-white/10 flex items-center justify-center"
          >
            <Minus className="w-5 h-5 text-indigo-400 stroke-[3px]" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 -right-6 z-20 w-12 h-12 bg-white/60 dark:bg-slate-700/40 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/40 dark:border-white/10 flex items-center justify-center"
          >
            <Heart className="w-6 h-6 text-rose-400 fill-rose-400/20" />
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Text & Button */}
      <div className="w-full z-10 flex flex-col items-center gap-10">
        <motion.div {...({ variants: itemVariants } as any)}>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base leading-relaxed max-w-[280px]">
            Te espero para planear nuestras próximas citas
          </p>
        </motion.div>

        <motion.button
          {...({
            variants: itemVariants,
            whileHover: { scale: 1.01 },
            whileTap: { scale: 0.98 }
          } as any)}
          onClick={onStart}
          className="w-full py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg font-bold shadow-2xl dark:shadow-none transition-all tracking-tight"
        >
          Empezar
        </motion.button>
      </div>

      {/* Removed the adjustment label as requested */}
    </motion.div>
  );
};

export default WelcomeScreen;
