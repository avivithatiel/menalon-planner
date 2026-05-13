export default function Footer() {
  return (
    <footer className="bg-[var(--color-forest)] text-green-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
        <p>Menalon Trail Planner — Personal trip planning tool</p>
        <p className="mt-1 text-green-300/70">
          Trail data from{' '}
          <a
            href="https://menalontrail.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            menalontrail.eu
          </a>{' '}
          • First certified trail in Greece (ERA)
        </p>
      </div>
    </footer>
  );
}
