import { notFound } from 'next/navigation';
import { getSections, getAccommodationsForSection } from '@/lib/data';
import DifficultyBadge from '@/components/Section/DifficultyBadge';
import AccommodationCard from '@/components/Accommodation/AccommodationCard';
import SectionMapWrapper from '@/components/Map/SectionMapWrapper';
import WeatherWidgetWrapper from '@/components/Weather/WeatherWidgetWrapper';

interface PageProps {
  params: Promise<{ sectionId: string }>;
}

export default async function DayDetailPage({ params }: PageProps) {
  const { sectionId } = await params;
  const sections = getSections();
  const section = sections.find((s) => s.id === parseInt(sectionId));

  if (!section) {
    notFound();
  }

  const accommodations = getAccommodationsForSection(section.id);
  const prevSection = sections.find((s) => s.id === section.id - 1);
  const nextSection = sections.find((s) => s.id === section.id + 1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-[var(--color-stone)]">Section {section.id} of 8</span>
          <DifficultyBadge level={section.difficulty} />
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-forest)]">
          {section.from} → {section.to}
        </h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatBox label="Distance" value={`${section.distance} km`} />
        <StatBox label="Duration" value={`${section.duration} hrs`} />
        <StatBox label="Elevation Gain" value={`↑ ${section.elevationGain}m`} />
        <StatBox label="Elevation Loss" value={`↓ ${section.elevationLoss}m`} />
        <StatBox label="Highest Point" value={`${section.highestPoint}m`} />
      </div>

      {/* Map */}
      <div className="mb-8">
        <SectionMapWrapper section={section} accommodations={accommodations} />
      </div>

      {/* Description */}
      <div className="bg-[var(--color-cream)] rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-[var(--color-forest)] mb-3">Trail Description</h2>
        <p className="text-gray-700 leading-relaxed">{section.description}</p>
      </div>

      {/* Highlights */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--color-forest)] mb-3">Highlights</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {section.highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700">
              <span className="text-[var(--color-moss)] mt-0.5">✦</span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      {/* Weather */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--color-forest)] mb-3">Weather Forecast</h2>
        <WeatherWidgetWrapper
          lat={section.toCoords[0]}
          lon={section.toCoords[1]}
          villageName={section.to}
        />
      </div>

      {/* Accommodations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--color-forest)] mb-3">
          Accommodations
        </h2>
        {accommodations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accommodations.map((acc) => (
              <AccommodationCard key={acc.id} accommodation={acc} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--color-stone)]">No accommodations listed for this section yet.</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        {prevSection ? (
          <a
            href={`/day/${prevSection.id}`}
            className="text-[var(--color-moss)] hover:underline"
          >
            ← Section {prevSection.id}: {prevSection.from} → {prevSection.to}
          </a>
        ) : (
          <span />
        )}
        {nextSection ? (
          <a
            href={`/day/${nextSection.id}`}
            className="text-[var(--color-moss)] hover:underline"
          >
            Section {nextSection.id}: {nextSection.from} → {nextSection.to} →
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-cream)] rounded-lg p-3 text-center">
      <div className="text-xs text-[var(--color-stone)]">{label}</div>
      <div className="text-lg font-semibold text-[var(--color-forest)]">{value}</div>
    </div>
  );
}

export function generateStaticParams() {
  return Array.from({ length: 8 }, (_, i) => ({ sectionId: String(i + 1) }));
}
