'use client';

import { useState, useMemo } from 'react';
import { BrewPackage } from '../data/packages';
import { TrendingDownIcon, TrendingUpIcon, Copy, ChevronDown } from 'lucide-react';

interface PackageListProps {
  initialPackages: BrewPackage[];
}

export default function PackageList({ initialPackages }: PackageListProps) {
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'installs' | 'growth'>('installs');
  const [showCopyOptions, setShowCopyOptions] = useState(false);

  const togglePackage = (packageId: string) => {
    const newSelected = new Set(selectedPackages);
    if (newSelected.has(packageId)) {
      newSelected.delete(packageId);
    } else {
      newSelected.add(packageId);
    }
    setSelectedPackages(newSelected);
  };

  const getBrewCommand = (includeInstall = false) => {
    const baseCommand = selectedPackages.size === 0 
      ? 'brew install --cask'
      : `brew install --cask ${Array.from(selectedPackages).join(' ')}`;
    
    return includeInstall
      ? `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && ${baseCommand}`
      : baseCommand;
  };

  const categories = Array.from(new Set(initialPackages.map(pkg => pkg.category)));

  const sortedAndFilteredPackages = useMemo(() => {
    let sorted = [...initialPackages];
    if (sortBy === 'growth') {
      sorted = sorted.sort((a, b) => (b.growthPercentage ?? 0) - (a.growthPercentage ?? 0));
    } else {
      sorted = sorted.sort((a, b) => (b.installCount ?? 0) - (a.installCount ?? 0));
    }
    return sorted.filter(pkg => selectedCategories.size === 0 || selectedCategories.has(pkg.category));
  }, [initialPackages, selectedCategories, sortBy]);

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
    <>
      <div className="mb-8 p-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 backdrop-blur-xl shadow-sm flex justify-between items-center relative group">
        <code className={`text-sm font-mono ${selectedPackages.size === 0 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>
          {getBrewCommand()}
        </code>
        {selectedPackages.size === 0 && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Select packages to generate a valid command
          </div>
        )}
        <div className="relative">
          <button
            onClick={() => setShowCopyOptions(!showCopyOptions)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-1"
            title="Copy options"
          >
            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          {showCopyOptions && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getBrewCommand(false));
                    setShowCopyOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Copy
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getBrewCommand(true));
                    setShowCopyOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Copy with Brew Installation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
                <span className={`text-xs font-medium flex items-center ${pkg.growthPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {pkg.growthPercentage >= 0 ? '+' : ''}{pkg.growthPercentage.toFixed(1)}%
                  {pkg.growthPercentage >= 0 ? (
                    <TrendingUpIcon className='h-4 w-4 ml-1'/>
                  ) : (
                    <TrendingDownIcon className='h-4 w-4 ml-1'/>
                  )}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}