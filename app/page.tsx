import { getPackages } from './data/packages';
import PackageList from './components/PackageList';

export default async function Home() {
  const packages = await getPackages();

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl mb-4 font-bold">
          <span className="text-gray-100">Brew</span>
          <span className="text-gray-500">Base</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Select the packages you want to install on your Mac
        </p>
      </header>

      <PackageList initialPackages={packages} />
    </div>
  );
}
