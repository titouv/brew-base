import { getPackages } from './data/packages';
import PackageList from './components/PackageList';

export default async function Home() {
  const packages = await getPackages();

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="text-center mb-12 macos-card macos-blur pt-10 pb-12 rounded-xl">
        <h1 className="text-5xl mb-4 font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-100 dark:to-neutral-300">Brew</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300">Base</span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mt-2">
          Discover and select the best Homebrew packages for your Mac
        </p>
        <div className="mt-6">
          <a href="https://brew.sh" target="_blank" rel="noopener noreferrer" className="macos-button-primary macos-button inline-block">
            Visit Homebrew
          </a>
        </div>
      </header>

      <PackageList initialPackages={packages} />
    </div>
  );
}
