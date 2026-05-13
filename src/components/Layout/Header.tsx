import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-[var(--color-forest)] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 20L9 8l4 6 4-10 4 16" />
          </svg>
          <span className="text-xl font-bold">Osi&amp;Avivit&apos;s Menalon Trail</span>
        </Link>
        <nav className="flex gap-6">
          <Link href="/" className="hover:text-green-200 transition-colors">
            Home
          </Link>
          <Link href="/planner" className="hover:text-green-200 transition-colors">
            Planner
          </Link>
        </nav>
      </div>
    </header>
  );
}
