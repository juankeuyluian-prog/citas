
import React, { useState, useEffect } from 'react';
import { AppState, DateIdea } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import SwipeDeck from './components/SwipeDeck';
import ReservationList from './components/ReservationList';
import { DATE_IDEAS } from './constants';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>(AppState.WELCOME);
  const [reservations, setReservations] = useState<DateIdea[]>([]);
  const [availableDates, setAvailableDates] = useState<DateIdea[]>(DATE_IDEAS);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleStart = () => setCurrentPage(AppState.SWIPING);
  const handleViewReservations = () => setCurrentPage(AppState.RESERVATIONS);
  const handleBackToSwipe = () => setCurrentPage(AppState.SWIPING);

  const onReserve = (date: DateIdea) => {
    const reservedDate = {
      ...date,
      reservedAt: new Date().toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      })
    };
    setReservations(prev => [...prev, reservedDate]);
    setAvailableDates(prev => prev.filter(d => d.id !== date.id));
  };

  const onSkip = (date: DateIdea) => {
    setAvailableDates(prev => prev.filter(d => d.id !== date.id));
  };

  const onUnreserve = (date: DateIdea) => {
    setReservations(prev => prev.filter(d => d.id !== date.id));
    setAvailableDates(prev => [...prev, date]);
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex items-center justify-center min-h-screen w-full transition-colors duration-500 bg-transparent overflow-hidden">
      <div className="relative w-full h-full sm:h-[92dvh] max-w-none sm:max-w-lg md:max-w-xl sm:mx-4 sm:rounded-[3rem] overflow-hidden sm:shadow-[0_40px_100px_rgba(0,0,0,0.15)] dark:sm:shadow-none bg-white/5 backdrop-blur-[2px] sm:border sm:border-white/40 dark:sm:border-white/10 transition-all duration-500">
        
        <AnimatePresence mode="wait">
          {currentPage === AppState.WELCOME && (
            <motion.div
              key="welcome"
              {...({
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 }
              } as any)}
              className="h-full w-full"
            >
              <WelcomeScreen onStart={handleStart} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            </motion.div>
          )}

          {currentPage === AppState.SWIPING && (
            <motion.div
              key="swiping"
              {...({
                initial: { x: '100%', opacity: 0 },
                animate: { x: 0, opacity: 1 },
                exit: { x: '-100%', opacity: 0 },
                transition: { type: 'spring', damping: 25, stiffness: 200 }
              } as any)}
              className="h-full w-full"
            >
              <SwipeDeck 
                dates={availableDates} 
                onReserve={onReserve} 
                onSkip={onSkip}
                onViewReservations={handleViewReservations}
                reservationCount={reservations.length}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </motion.div>
          )}

          {currentPage === AppState.RESERVATIONS && (
            <motion.div
              key="reservations"
              {...({
                initial: { y: '100%', opacity: 0 },
                animate: { y: 0, opacity: 1 },
                exit: { y: '100%', opacity: 0 },
                transition: { type: 'spring', damping: 25, stiffness: 200 }
              } as any)}
              className="h-full w-full"
            >
              <ReservationList 
                reservations={reservations} 
                onBack={handleBackToSwipe}
                onUnreserve={onUnreserve}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
