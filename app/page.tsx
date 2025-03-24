'use client';

import { useState, useEffect, useMemo } from 'react';
import { staticBrewPackages, BrewPackage, fetchMostUsedPackages } from './data/packages';

export default function Home() {
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [packages, setPackages] = useState<BrewPackage[]>(staticBrewPackages);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'installs' | 'growth'>('installs');

  useEffect(() => {
    const loadPackages = async () => {
      setLoading(true);
      try {
        const mostUsed = await fetchMostUsedPackages();
        if (mostUsed.length > 0) {
          setPackages(mostUsed);
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  const togglePackage = (packageId: string) => {
    const newSelected = new Set(selectedPackages);
    if (newSelected.has(packageId)) {
      newSelected.delete(packageId);
    } else {
      newSelected.add(packageId);
    }
    setSelectedPackages(newSelected);
  };

  const getBrewCommand = () => {
    if (selectedPackages.size === 0) return 'brew install --cask';
    return `brew install --cask ${Array.from(selectedPackages).join(' ')}`;
  };

  const categories = Array.from(new Set(packages.map(pkg => pkg.category)));

  const sortedAndFilteredPackages = useMemo(() => {
    let sorted = [...packages];
    if (sortBy === 'growth') {
      sorted = sorted.sort((a, b) => (b.growthPercentage ?? 0) - (a.growthPercentage ?? 0));
    } else {
      sorted = sorted.sort((a, b) => (b.installCount ?? 0) - (a.installCount ?? 0));
    }
    return sorted.filter(pkg => selectedCategories.size === 0 || selectedCategories.has(pkg.category));
  }, [packages, selectedCategories, sortBy]);

  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-medium mb-4">Brew Package Composer</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Select the packages you want to install on your Mac
        </p>
      </header>

      <div className="mb-8 p-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 backdrop-blur-xl shadow-sm">
        <code className="text-sm font-mono text-gray-700 dark:text-gray-300">{getBrewCommand()}</code>
      </div>

      {!loading && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                    ${selectedCategories.has(category)
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'installs' | 'growth')}
                className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
              >
                <option value="installs">Most Installed</option>
                <option value="growth">Fastest Growing</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading most used packages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAndFilteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 rounded-lg transition-all cursor-default
                ${selectedPackages.has(pkg.id)
                  ? 'bg-gray-100/50 dark:bg-gray-800/50 shadow-sm border border-gray-900 dark:border-white'
                  : 'bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                } backdrop-blur-xl`}
              onClick={() => togglePackage(pkg.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                {pkg.iconUrl && (
                  <img
                    src={pkg.iconUrl}
                    alt={`${pkg.name} icon`}
                    className="w-8 h-8 rounded-lg"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
                <h3 className="text-lg font-medium">{pkg.name}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {pkg.description || 'No description available'}
              </p>
              {pkg.installCount && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {pkg.installCount.toLocaleString()} installations in the last year
                </p>
              )}
              <div className="mt-2 flex justify-between items-center">
                <span className="inline-block px-2 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {pkg.category}
                </span>
                {pkg.growthPercentage !== undefined && (
                  <span className={`text-xs font-medium ${pkg.growthPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {pkg.growthPercentage >= 0 ? '+' : ''}{pkg.growthPercentage.toFixed(1)}% growth
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
