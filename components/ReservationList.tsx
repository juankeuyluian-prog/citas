
import React, { useState } from 'react';
import { DateIdea } from '../types';
import { ArrowLeft, MapPin, Share2, Calendar, Heart, Trash2, CalendarPlus, Sun, Moon, Clock, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReservationListProps {
  reservations: DateIdea[];
  onBack: () => void;
  onUnreserve: (date: DateIdea) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const triggerHaptic = (duration: number = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration);
  }
};

// Framer Motion variants
const listContainerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const listItemVariants: any = {
  hidden: { 
    y: 20, 
    opacity: 0, 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 140,
      mass: 0.8
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

const ReservationList: React.FC<ReservationListProps> = ({ reservations, onBack, onUnreserve, isDarkMode, toggleDarkMode }) => {
  const [dateToDelete, setDateToDelete] = useState<DateIdea | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateIdea | null>(null);

  const addToCalendar = (date: DateIdea) => {
    triggerHaptic(15);
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const text = encodeURIComponent(date.title);
    const details = encodeURIComponent(date.description);
    const location = encodeURIComponent(date.location || '');
    window.open(`${baseUrl}&text=${text}&details=${details}&location=${location}`, '_blank');
  };

  const handleShare = async (date: DateIdea) => {
    triggerHaptic(15);
    const shareData = {
      title: '¡Nuestra próxima cita!',
      text: `He reservado: ${date.title}. ${date.description} ${date.location ? `Lugar: ${date.location}` : ''}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
        alert('Detalles de la cita copiados al portapapeles');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleUnreserveRequest = (date: DateIdea) => {
    triggerHaptic(15);
    setDateToDelete(date);
    setSelectedDate(null);
  };

  const confirmDelete = () => {
    if (dateToDelete) {
      triggerHaptic(30);
      onUnreserve(dateToDelete);
      setDateToDelete(null);
    }
  };

  const cancelDelete = () => {
    triggerHaptic(10);
    setDateToDelete(null);
  };

  const handleToggleMode = () => {
    triggerHaptic(5);
    toggleDarkMode();
  };

  const handleGoBack = () => {
    triggerHaptic(8);
    onBack();
  };

  const openDetails = (date: DateIdea) => {
    triggerHaptic(10);
    setSelectedDate(date);
  };

  const closeDetails = () => {
    triggerHaptic(5);
    setSelectedDate(null);
  };

  const getTagStyle = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('rom')) return 'text-rose-500';
    if (t.includes('div')) return 'text-orange-500';
    if (t.includes('rela')) return 'text-blue-500';
    if (t.includes('cult')) return 'text-indigo-500';
    return 'text-emerald-500';
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-slate-950 overflow-hidden transition-colors duration-500 relative">
      
      {/* Detail View Overlay */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-0 sm:px-8"
            onClick={closeDetails}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90dvh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img src={selectedDate.image} alt={selectedDate.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={closeDetails}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[12px] font-bold uppercase tracking-[0.2em] ${getTagStyle(selectedDate.tag)}`}>
                    {selectedDate.tag}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Reservada el {selectedDate.reservedAt}
                  </span>
                </div>
                
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 leading-tight">
                  {selectedDate.title}
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Descripción</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                      {selectedDate.description}
                    </p>
                  </div>

                  {selectedDate.location && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Ubicación sugerida</h4>
                        <p className="text-slate-700 dark:text-slate-200 font-semibold">{selectedDate.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -3, boxShadow: "0 12px 28px -4px rgba(16, 185, 129, 0.2)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToCalendar(selectedDate)}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-all duration-300"
                    >
                      <CalendarPlus className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">Agendar</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -3, boxShadow: "0 12px 28px -4px rgba(244, 63, 94, 0.2)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleUnreserveRequest(selectedDate)}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 transition-all duration-300"
                    >
                      <Trash2 className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">Quitar</span>
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="h-10 w-full bg-white dark:bg-slate-900" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal Refined */}
      <AnimatePresence>
        {dateToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[120] flex items-center justify-center p-8 bg-black/40 dark:bg-black/70 backdrop-blur-[6px]"
            onClick={cancelDelete}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220, mass: 1 }}
              className="w-full max-w-[340px] glass rounded-[3rem] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/10 flex flex-col items-center text-center overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-rose-500/10 blur-[50px] pointer-events-none" />

              <div className="relative mb-8">
                <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center border border-rose-500/20 shadow-inner group">
                   <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg border border-rose-100 dark:border-rose-900/30">
                     <AlertCircle className="w-8 h-8 text-rose-500 animate-pulse" />
                   </div>
                </div>
              </div>

              <h3 className="text-[26px] font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-tight">
                ¿Quitar reserva?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed font-medium px-2">
                Estás a punto de quitar "<span className="text-slate-900 dark:text-white font-bold">{dateToDelete.title}</span>" de tu lista de planes.
              </p>

              <div className="flex flex-col w-full gap-3.5">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2, boxShadow: "0 15px 30px -5px rgba(244, 63, 94, 0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmDelete}
                  className="w-full py-5 rounded-[1.5rem] bg-rose-500 text-white font-black shadow-xl shadow-rose-500/20 text-[15px] tracking-tight transition-all"
                >
                  Quitar reserva
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={cancelDelete}
                  className="w-full py-5 rounded-[1.5rem] bg-transparent text-slate-500 dark:text-slate-400 font-bold text-[15px] tracking-tight transition-all border border-slate-200 dark:border-slate-800"
                >
                  Mantener cita
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-8 pt-12 pb-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800/50 z-10"
      >
        <div className="flex items-center gap-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleGoBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </motion.button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Mis Reservas</h2>
        </div>

        <motion.button whileHover={{ scale: 1.05, boxShadow: "0 8px 20px -4px rgba(0,0,0,0.1)" }} whileTap={{ scale: 0.95 }} onClick={handleToggleMode} className="w-10 h-10 rounded-full glass border border-white/50 dark:border-white/10 shadow-sm flex items-center justify-center transition-colors">
          {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400 fill-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-500 fill-indigo-100" />}
        </motion.button>
      </motion.div>

      {/* Reservation List with Entrance Animation */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <AnimatePresence mode="popLayout">
          {reservations.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center px-10"
            >
              <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/10 rounded-[2.2rem] flex items-center justify-center mb-6 shadow-inner border border-rose-100/50 dark:border-rose-900/20">
                <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <Heart className="w-10 h-10 text-rose-300 dark:text-rose-800 fill-rose-300/10" />
                </motion.div>
              </div>
              <p className="text-gray-400 dark:text-gray-500 font-medium text-sm">Aún no elegiste ninguna cita.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 pb-20"
            >
              {reservations.map((date) => (
                <motion.div
                  key={date.id}
                  variants={listItemVariants}
                  exit="exit"
                  layout
                  onClick={() => openDetails(date)}
                  whileHover={{ 
                    scale: 1.025, 
                    y: -4, 
                    boxShadow: isDarkMode 
                      ? "0 30px 60px -15px rgba(0, 0, 0, 0.6)" 
                      : "0 25px 50px -12px rgba(0, 0, 0, 0.05)"
                  }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 flex gap-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-gray-100/30 dark:border-gray-800/50 group cursor-pointer transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest flex items-center gap-1">
                    <Info className="w-2 h-2" /> Toca para info
                  </div>

                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-sm">
                    <img src={date.image} alt={date.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${getTagStyle(date.tag)}`}>
                        {date.tag}
                      </span>
                      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                        <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                      </motion.div>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight mb-1.5 truncate">
                      {date.title}
                    </h4>
                    
                    <div className="space-y-1">
                      {date.location && (
                        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[11px] font-medium">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{date.location}</span>
                        </div>
                      )}
                      {date.reservedAt && (
                        <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-600 text-[10px] font-semibold italic">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Reservada el {date.reservedAt}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 items-center justify-center self-center pr-1.5" onClick={(e) => e.stopPropagation()}>
                    <motion.button whileHover={{ scale: 1.1, boxShadow: "0 12px 24px -6px rgba(16, 185, 129, 0.3)", borderColor: "rgba(16, 185, 129, 0.5)", y: -2 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); addToCalendar(date); }} className="relative w-10 h-10 rounded-full glass border border-white/50 dark:border-white/10 shadow-sm flex items-center justify-center overflow-hidden transition-all text-slate-500 dark:text-slate-400 hover:text-emerald-500 bg-white/20 dark:bg-white/5">
                      <CalendarPlus className="relative z-10 w-4 h-4" />
                    </motion.button>

                    <motion.button whileHover={{ scale: 1.1, boxShadow: "0 12px 24px -6px rgba(99, 102, 241, 0.3)", borderColor: "rgba(99, 102, 241, 0.5)", y: -2 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleShare(date); }} className="relative w-10 h-10 rounded-full glass border border-white/50 dark:border-white/10 shadow-sm flex items-center justify-center overflow-hidden transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-500 bg-white/20 dark:bg-white/5">
                      <Share2 className="relative z-10 w-4 h-4" />
                    </motion.button>

                    <motion.button whileHover={{ scale: 1.1, boxShadow: "0 12px 24px -6px rgba(244, 63, 94, 0.3)", borderColor: "rgba(244, 63, 94, 0.5)", y: -2 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleUnreserveRequest(date); }} className="relative w-10 h-10 rounded-full glass border border-white/50 dark:border-white/10 shadow-sm flex items-center justify-center overflow-hidden transition-all text-slate-500 dark:text-slate-400 hover:text-rose-500 bg-white/20 dark:bg-white/5">
                      <Trash2 className="relative z-10 w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary Footer */}
      <AnimatePresence>
        {reservations.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="px-8 py-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-gray-100/30 dark:border-gray-800/50 shadow-[0_-30px_60px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-[0.2em]">Total Reservado</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{reservations.length} Citas</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationList;
