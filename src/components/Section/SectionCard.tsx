import Link from 'next/link';
import { TrailSection } from '@/types';
import DifficultyBadge from './DifficultyBadge';

interface SectionCardProps {
  section: TrailSection;
}

export default function SectionCard({ section }: SectionCardProps) {
  return (
    <Link
      href={`/day/${section.id}`}
      className="block bg-[var(--color-cream)] rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-stone-200"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-[var(--color-forest)]">
          Section {section.id}
        </h3>
        <DifficultyBadge level={section.difficulty} showLabel={false} />
      </div>
      <p className="text-sm text-[var(--color-stone)] mb-3">
        {section.from} → {section.to}
      </p>
      <div className="flex gap-4 text-xs text-[var(--color-stone)]">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {section.distance} km
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {section.duration} hrs
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M3 20L9 8l4 6 4-10 4 16" />
          </svg>
          ↑{section.elevationGain}m
        </span>
      </div>
      <p className="mt-3 text-sm text-gray-600 line-clamp-2">{section.description}</p>
    </Link>
  );
}
