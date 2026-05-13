import { create } from 'zustand';
import { ItineraryDay } from '@/types';

interface ItineraryStore {
  startDate: string | null;
  pace: 'relaxed' | 'moderate' | 'fast';
  days: ItineraryDay[];
  setStartDate: (date: string) => void;
  setPace: (pace: 'relaxed' | 'moderate' | 'fast') => void;
  setDays: (days: ItineraryDay[]) => void;
  assignSection: (sectionId: number, dayIndex: number) => void;
  removeSection: (sectionId: number, dayIndex: number) => void;
  moveSection: (sectionId: number, fromDay: number, toDay: number) => void;
  addDay: () => void;
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

  setStartDate: (date) => {
    set({ startDate: date });
    // Update day dates
    const days = get().days.map((day, i) => ({
      ...day,
      date: addDays(date, i),
    }));
    set({ days });
  },

  setPace: (pace) => set({ pace }),

  setDays: (days) => set({ days }),

  assignSection: (sectionId, dayIndex) => {
    const days = [...get().days];
    if (days[dayIndex] && !days[dayIndex].sectionIds.includes(sectionId)) {
      days[dayIndex] = {
        ...days[dayIndex],
        sectionIds: [...days[dayIndex].sectionIds, sectionId],
      };
      set({ days });
    }
  },

  removeSection: (sectionId, dayIndex) => {
    const days = [...get().days];
    if (days[dayIndex]) {
      days[dayIndex] = {
        ...days[dayIndex],
        sectionIds: days[dayIndex].sectionIds.filter((id) => id !== sectionId),
      };
      set({ days });
    }
  },

  moveSection: (sectionId, fromDay, toDay) => {
    const days = [...get().days];
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
      set({ days });
    }
  },

  addDay: () => {
    const { days, startDate } = get();
    const newDay: ItineraryDay = {
      dayNumber: days.length + 1,
      date: startDate ? addDays(startDate, days.length) : null,
      sectionIds: [],
      isRestDay: false,
    };
    set({ days: [...days, newDay] });
  },

  removeDay: (dayIndex) => {
    const days = get().days.filter((_, i) => i !== dayIndex).map((day, i) => ({
      ...day,
      dayNumber: i + 1,
    }));
    set({ days });
  },

  toggleRestDay: (dayIndex) => {
    const days = [...get().days];
    if (days[dayIndex]) {
      days[dayIndex] = {
        ...days[dayIndex],
        isRestDay: !days[dayIndex].isRestDay,
        sectionIds: !days[dayIndex].isRestDay ? [] : days[dayIndex].sectionIds,
      };
      set({ days });
    }
  },

  autoGroup: () => {
    const { pace, startDate } = get();
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

    set({ days });
  },
}));

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
