import { DifficultyLevel, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/types';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  showLabel?: boolean;
}

export default function DifficultyBadge({ level, showLabel = true }: DifficultyBadgeProps) {
  const colorClasses: Record<DifficultyLevel, string> = {
    1: 'bg-green-500 text-white',
    2: 'bg-green-600 text-white',
    3: 'bg-yellow-500 text-white',
    4: 'bg-orange-500 text-white',
    5: 'bg-red-500 text-white',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses[level]}`}
    >
      <span>{level}/5</span>
      {showLabel && <span>• {DIFFICULTY_LABELS[level]}</span>}
    </span>
  );
}
