import { getSections, getVillages } from '@/lib/data';
import SectionCard from '@/components/Section/SectionCard';
import TrailMapWrapper from '@/components/Map/TrailMapWrapper';

export default function Home() {
  const sections = getSections();
  const villages = getVillages();
  const totalDistance = sections.reduce((sum, s) => sum + s.distance, 0);
  const totalDuration = sections.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[var(--color-forest)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Osi&amp;Avivit&apos;s Menalon Trail
          </h1>
          <p className="text-lg text-green-200 mb-6 max-w-2xl mx-auto">
            75 km across the heart of Arcadia — Greece&apos;s first certified hiking trail.
            9 villages, ancient gorges, mountain peaks, and stone-built hospitality.
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalDistance.toFixed(1)}</div>
              <div className="text-green-300">km total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">8</div>
              <div className="text-green-300">sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">9</div>
              <div className="text-green-300">villages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">~{Math.round(totalDuration)}</div>
              <div className="text-green-300">hours hiking</div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-[var(--color-forest)] mb-4">Trail Overview</h2>
        <TrailMapWrapper sections={sections} villages={villages} />
      </section>

      {/* Sections Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-[var(--color-forest)] mb-6">Trail Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </section>
    </div>
  );
}
