'use client';

import { useEffect } from 'react';
import { useItineraryStore } from '@/store/itinerary';
import { getSections } from '@/lib/data';
import DifficultyBadge from '@/components/Section/DifficultyBadge';
import { TrailSection } from '@/types';

const sections = getSections();

export default function PlannerPage() {
  const {
    startDate,
    pace,
    days,
    setStartDate,
    setPace,
    autoGroup,
    addDay,
    removeDay,
    toggleRestDay,
    removeSection,
    setDayDescription,
    assignSection,
    undo,
    canUndo,
  } = useItineraryStore();

  // Auto-group on first load if no days exist
  useEffect(() => {
    if (days.length === 0) {
      autoGroup();
    }
  }, []);

  const totalDistance = days.reduce((sum, day) => {
    return sum + day.sectionIds.reduce((s, id) => {
      const sec = sections.find((x) => x.id === id);
      return s + (sec?.distance || 0);
    }, 0);
  }, 0);

  const totalDuration = days.reduce((sum, day) => {
    return sum + day.sectionIds.reduce((s, id) => {
      const sec = sections.find((x) => x.id === id);
      return s + (sec?.duration || 0);
    }, 0);
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--color-forest)] mb-6">
        Itinerary Planner
      </h1>

      {/* Controls */}
      <div className="bg-[var(--color-cream)] rounded-xl p-5 mb-8 flex flex-wrap gap-6 items-end">
        <div>
          <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate || ''}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">
            Pace
          </label>
          <select
            value={pace}
            onChange={(e) => setPace(e.target.value as 'relaxed' | 'moderate' | 'fast')}
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="relaxed">Relaxed (≤3 hrs/day)</option>
            <option value="moderate">Moderate (≤5 hrs/day)</option>
            <option value="fast">Fast (≤7 hrs/day)</option>
          </select>
        </div>
        <button
          onClick={autoGroup}
          className="bg-[var(--color-forest)] text-white px-4 py-2 rounded-lg text-sm hover:bg-[var(--color-moss)] transition-colors"
        >
          Auto-Group Sections
        </button>
        <button
          onClick={() => addDay()}
          className="border border-[var(--color-forest)] text-[var(--color-forest)] px-4 py-2 rounded-lg text-sm hover:bg-[var(--color-forest)] hover:text-white transition-colors"
        >
          + Add Day
        </button>
        <button
          onClick={undo}
          disabled={!canUndo}
          className="border border-stone-300 text-[var(--color-stone)] px-4 py-2 rounded-lg text-sm hover:bg-stone-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ↩ Undo
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--color-cream)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--color-forest)]">{days.length}</div>
          <div className="text-sm text-[var(--color-stone)]">Days</div>
        </div>
        <div className="bg-[var(--color-cream)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--color-forest)]">{totalDistance.toFixed(1)} km</div>
          <div className="text-sm text-[var(--color-stone)]">Total Distance</div>
        </div>
        <div className="bg-[var(--color-cream)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--color-forest)]">{totalDuration.toFixed(1)} hrs</div>
          <div className="text-sm text-[var(--color-stone)]">Total Hiking Time</div>
        </div>
      </div>

      {/* Day Cards */}
      <div className="space-y-4">
        {days.map((day, dayIndex) => {
          const daySections = day.sectionIds
            .map((id) => sections.find((s) => s.id === id))
            .filter(Boolean) as TrailSection[];
          const dayDistance = daySections.reduce((s, sec) => s + sec.distance, 0);
          const dayDuration = daySections.reduce((s, sec) => s + sec.duration, 0);

          return (
            <div
              key={dayIndex}
              className={`border rounded-xl p-5 ${
                day.isRestDay
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-[var(--color-forest)]">
                    Day {day.dayNumber}
                  </h3>
                  {day.date && (
                    <span className="text-xs text-[var(--color-stone)]">
                      {new Date(day.date).toLocaleDateString('en', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                  {day.isRestDay && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Rest Day
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addDay(dayIndex)}
                    className="text-xs text-[var(--color-stone)] hover:text-[var(--color-forest)]"
                    title="Insert day after this one"
                  >
                    ＋
                  </button>
                  <button
                    onClick={() => toggleRestDay(dayIndex)}
                    className="text-xs text-[var(--color-stone)] hover:text-blue-600"
                    title={day.isRestDay ? 'Mark as hiking day' : 'Mark as rest day'}
                  >
                    {day.isRestDay ? '🥾' : '😴'}
                  </button>
                  <button
                    onClick={() => removeDay(dayIndex)}
                    className="text-xs text-red-400 hover:text-red-600"
                    title="Remove day"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <textarea
                value={day.description}
                onChange={(e) => setDayDescription(dayIndex, e.target.value)}
                placeholder="Notes for this day..."
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 mb-3 resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-forest)] bg-white/50"
                rows={2}
              />

              {!day.isRestDay && (
                <>
                  {daySections.length > 0 ? (
                    <div className="space-y-2">
                      {daySections.map((sec) => (
                        <div
                          key={sec.id}
                          className="flex items-center justify-between bg-[var(--color-sand)] rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {sec.from} → {sec.to}
                            </span>
                            <DifficultyBadge level={sec.difficulty} showLabel={false} />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[var(--color-stone)]">
                              {sec.distance}km • {sec.duration}hrs
                            </span>
                            <button
                              onClick={() => removeSection(sec.id, dayIndex)}
                              className="text-xs text-red-400 hover:text-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="text-xs text-[var(--color-stone)] pt-1">
                        Total: {dayDistance.toFixed(1)} km • {dayDuration} hrs
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--color-stone)] italic">
                      No sections assigned yet. Use the dropdown below or Auto-Group.
                    </p>
                  )}
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        assignSection(Number(e.target.value), dayIndex);
                      }
                    }}
                    className="mt-2 w-full text-sm border border-stone-200 rounded-lg px-3 py-2 text-[var(--color-stone)] bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-forest)]"
                  >
                    <option value="">+ Add section to this day...</option>
                    {sections
                      .filter((s) => !day.sectionIds.includes(s.id))
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          Section {s.id}: {s.from} → {s.to} ({s.distance}km, {s.duration}hrs)
                        </option>
                      ))}
                  </select>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
