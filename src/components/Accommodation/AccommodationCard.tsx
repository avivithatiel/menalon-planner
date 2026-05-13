import { Accommodation } from '@/types';

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export default function AccommodationCard({ accommodation }: AccommodationCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-stone-100">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-[var(--color-forest)]">{accommodation.name}</h4>
          <span className="text-xs text-[var(--color-stone)] capitalize">{accommodation.type}</span>
        </div>
        <span className="text-xs bg-[var(--color-sand)] text-[var(--color-stone)] px-2 py-0.5 rounded">
          {accommodation.village}
        </span>
      </div>
      {accommodation.description && (
        <p className="text-sm text-gray-600 mt-2">{accommodation.description}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {accommodation.phone && (
          <a
            href={`tel:${accommodation.phone}`}
            className="text-xs text-[var(--color-moss)] hover:underline"
          >
            📞 {accommodation.phone}
          </a>
        )}
        {accommodation.website && (
          <a
            href={accommodation.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--color-moss)] hover:underline"
          >
            🌐 Website
          </a>
        )}
        {accommodation.bookingUrl && (
          <a
            href={accommodation.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-[var(--color-forest)] text-white px-2 py-1 rounded hover:bg-[var(--color-moss)] transition-colors"
          >
            Book Now →
          </a>
        )}
      </div>
    </div>
  );
}
