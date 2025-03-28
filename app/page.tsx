import { getPackages } from './data/packages';
import PackageList from './components/PackageList';

export default async function Home() {
  const packages = await getPackages();

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto">
      <header className="text-center mb-12 macos-card macos-blur pt-12 pb-14 rounded-xl border border-neutral-200/40 dark:border-neutral-700/40 shadow-sm">
        <h1 className="text-4xl sm:text-5xl mb-5 font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-100 dark:to-neutral-300">Brew</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300">Base</span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mt-2 px-4">
          Discover and select the best Homebrew packages for your Mac
        </p>
        <div className="mt-8">
          <a href="https://brew.sh" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-sm backdrop-blur-sm inline-flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16L16 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Visit Homebrew
          </a>
        </div>
      </header>

      <PackageList initialPackages={packages} />
    </div>
  );
}
