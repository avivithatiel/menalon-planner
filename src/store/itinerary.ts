import { create } from 'zustand';
import { ItineraryDay } from '@/types';

interface Snapshot {
  startDate: string | null;
  pace: 'relaxed' | 'moderate' | 'fast';
  days: ItineraryDay[];
}

interface ItineraryStore {
  startDate: string | null;
  pace: 'relaxed' | 'moderate' | 'fast';
  days: ItineraryDay[];
  history: Snapshot[];
  canUndo: boolean;
  undo: () => void;
  setStartDate: (date: string) => void;
  setPace: (pace: 'relaxed' | 'moderate' | 'fast') => void;
  setDays: (days: ItineraryDay[]) => void;
  assignSection: (sectionId: number, dayIndex: number) => void;
  removeSection: (sectionId: number, dayIndex: number) => void;
  moveSection: (sectionId: number, fromDay: number, toDay: number) => void;
  addDay: (afterIndex?: number) => void;
  removeDay: (dayIndex: number) => void;
  toggleRestDay: (dayIndex: number) => void;
  autoGroup: () => void;
}

const PACE_CONFIG = {
  relaxed: { maxDistance: 8, maxDuration: 3 },
  moderate: { maxDistance: 14, maxDuration: 5 },
  fast: { maxDistance: 20, maxDuration: 7 },
};

// Section distances for auto-grouping
const SECTION_DATA = [
  { id: 1, distance: 12.5, duration: 5 },
  { id: 2, distance: 4.2, duration: 2 },
  { id: 3, distance: 14.9, duration: 5 },
  { id: 4, distance: 8.5, duration: 2.5 },
  { id: 5, distance: 5.6, duration: 2 },
  { id: 6, distance: 8.9, duration: 3.5 },
  { id: 7, distance: 6.6, duration: 2.5 },
  { id: 8, distance: 13.9, duration: 5 },
];

export const useItineraryStore = create<ItineraryStore>((set, get) => ({
  startDate: null,
  pace: 'moderate',
  days: [],
  history: [],
  canUndo: false,

  undo: () => {
    const { history } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      startDate: prev.startDate,
      pace: prev.pace,
      days: prev.days,
      history: history.slice(0, -1),
      canUndo: history.length - 1 > 0,
    });
  },

  setStartDate: (date) => {
    const { startDate, pace, days } = get();
    const snapshot: Snapshot = { startDate, pace, days };
    const updatedDays = days.map((day, i) => ({
      ...day,
      date: addDays(date, i),
    }));
    set((state) => ({
      startDate: date,
      days: updatedDays,
      history: [...state.history, snapshot],
      canUndo: true,
    }));
  },

  setPace: (pace) => {
    const { startDate, pace: prevPace, days } = get();
    set((state) => ({
      pace,
      history: [...state.history, { startDate, pace: prevPace, days }],
      canUndo: true,
    }));
  },

  setDays: (days) => {
    const { startDate, pace, days: prevDays } = get();
    set((state) => ({
      days,
      history: [...state.history, { startDate, pace, days: prevDays }],
      canUndo: true,
    }));
  },

  assignSection: (sectionId, dayIndex) => {
    const { startDate, pace, days: prevDays } = get();
    const days = [...prevDays];
    if (days[dayIndex] && !days[dayIndex].sectionIds.includes(sectionId)) {
      days[dayIndex] = {
        ...days[dayIndex],
        sectionIds: [...days[dayIndex].sectionIds, sectionId],
      };
      set((state) => ({
        days,
        history: [...state.history, { startDate, pace, days: prevDays }],
        canUndo: true,
      }));
    }
  },

  removeSection: (sectionId, dayIndex) => {
    const { startDate, pace, days: prevDays } = get();
    const days = [...prevDays];
    if (days[dayIndex]) {
      days[dayIndex] = {
        ...days[dayIndex],
        sectionIds: days[dayIndex].sectionIds.filter((id) => id !== sectionId),
      };
      set((state) => ({
        days,
        history: [...state.history, { startDate, pace, days: prevDays }],
        canUndo: true,
      }));
    }
  },

  moveSection: (sectionId, fromDay, toDay) => {
    const { startDate, pace, days: prevDays } = get();
    const days = [...prevDays];
    if (days[fromDay] && days[toDay]) {
      days[fromDay] = {
        ...days[fromDay],
        sectionIds: days[fromDay].sectionIds.filter((id) => id !== sectionId),
      };
      if (!days[toDay].sectionIds.includes(sectionId)) {
        days[toDay] = {
          ...days[toDay],
          sectionIds: [...days[toDay].sectionIds, sectionId],
        };
      }
      set((state) => ({
        days,
        history: [...state.history, { startDate, pace, days: prevDays }],
        canUndo: true,
      }));
    }
  },

  addDay: (afterIndex?: number) => {
    const { days: prevDays, startDate, pace } = get();
    const insertAt = afterIndex !== undefined ? afterIndex + 1 : prevDays.length;
    const newDay: ItineraryDay = {
      dayNumber: insertAt + 1,
      date: null,
      sectionIds: [],
      isRestDay: false,
    };
    const days = [
      ...prevDays.slice(0, insertAt),
      newDay,
      ...prevDays.slice(insertAt),
    ].map((day, i) => ({
      ...day,
      dayNumber: i + 1,
      date: startDate ? addDays(startDate, i) : null,
    }));
    set((state) => ({
      days,
      history: [...state.history, { startDate, pace, days: prevDays }],
      canUndo: true,
    }));
  },

  removeDay: (dayIndex) => {
    const { startDate, pace, days: prevDays } = get();
    const days = prevDays.filter((_, i) => i !== dayIndex).map((day, i) => ({
      ...day,
      dayNumber: i + 1,
    }));
    set((state) => ({
      days,
      history: [...state.history, { startDate, pace, days: prevDays }],
      canUndo: true,
    }));
  },

  toggleRestDay: (dayIndex) => {
    const { startDate, pace, days: prevDays } = get();
    const days = [...prevDays];
    if (days[dayIndex]) {
      const becomingRestDay = !days[dayIndex].isRestDay;
      const displacedSections = becomingRestDay ? days[dayIndex].sectionIds : [];

      days[dayIndex] = {
        ...days[dayIndex],
        isRestDay: becomingRestDay,
        sectionIds: becomingRestDay ? [] : days[dayIndex].sectionIds,
      };

      // Move displaced sections to the next day
      if (becomingRestDay && displacedSections.length > 0) {
        const nextDayIndex = dayIndex + 1;
        if (nextDayIndex < days.length) {
          days[nextDayIndex] = {
            ...days[nextDayIndex],
            sectionIds: [...displacedSections, ...days[nextDayIndex].sectionIds],
          };
        } else {
          // Create a new day to hold the displaced sections
          const { startDate } = get();
          days.push({
            dayNumber: days.length + 1,
            date: startDate ? addDays(startDate, days.length) : null,
            sectionIds: displacedSections,
            isRestDay: false,
          });
        }
      }

      set((state) => ({
        days,
        history: [...state.history, { startDate, pace, days: prevDays }],
        canUndo: true,
      }));
    }
  },

  autoGroup: () => {
    const { pace, startDate, days: prevDays } = get();
    const config = PACE_CONFIG[pace];
    const days: ItineraryDay[] = [];
    let currentDay: number[] = [];
    let currentDuration = 0;

    SECTION_DATA.forEach((section) => {
      if (
        currentDay.length > 0 &&
        currentDuration + section.duration > config.maxDuration
      ) {
        days.push({
          dayNumber: days.length + 1,
          date: startDate ? addDays(startDate, days.length) : null,
          sectionIds: currentDay,
          isRestDay: false,
        });
        currentDay = [];
        currentDuration = 0;
      }
      currentDay.push(section.id);
      currentDuration += section.duration;
    });

    if (currentDay.length > 0) {
      days.push({
        dayNumber: days.length + 1,
        date: startDate ? addDays(startDate, days.length) : null,
        sectionIds: currentDay,
        isRestDay: false,
      });
    }

    set((state) => ({
      days,
      history: [...state.history, { startDate, pace, days: prevDays }],
      canUndo: true,
    }));
  },
}));

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
