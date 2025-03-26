"use client";

import { useState, useMemo } from "react";
import { BrewPackage } from "../data/packages";
import {
  TrendingDownIcon,
  TrendingUpIcon,
  Copy,
  ChevronDown,
} from "lucide-react";

interface PackageListProps {
  initialPackages: BrewPackage[];
}

export default function PackageList({ initialPackages }: PackageListProps) {
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [sortBy, setSortBy] = useState<"installs" | "growth">("installs");
  const [showCopyOptions, setShowCopyOptions] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(
    initialPackages.length === 0,
  );

  const togglePackage = (packageId: string) => {
    const newSelected = new Set(selectedPackages);
    if (newSelected.has(packageId)) {
      newSelected.delete(packageId);
    } else {
      newSelected.add(packageId);
    }
    setSelectedPackages(newSelected);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(type);
    setTimeout(() => setCopiedCommand(null), 2000);
    setShowCopyOptions(false);
  };

  const getBrewCommand = (includeInstall = false) => {
    const baseCommand =
      selectedPackages.size === 0
        ? "brew install --cask"
        : `brew install --cask ${Array.from(selectedPackages).join(" ")}`;

    return includeInstall
      ? `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && ${baseCommand}`
      : baseCommand;
  };

  const categories = Array.from(
    new Set(initialPackages.map((pkg) => pkg.category)),
  );

  const sortedAndFilteredPackages = useMemo(() => {
    let sorted = [...initialPackages];
    if (sortBy === "growth") {
      sorted = sorted.sort(
        (a, b) => (b.growthPercentage ?? 0) - (a.growthPercentage ?? 0),
      );
    } else {
      sorted = sorted.sort(
        (a, b) => (b.installCount ?? 0) - (a.installCount ?? 0),
      );
    }
    return sorted.filter(
      (pkg) =>
        selectedCategories.size === 0 || selectedCategories.has(pkg.category),
    );
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
      <div className="mb-8 p-4 macos-card macos-blur flex justify-between items-center relative group">
        <code
          className={`text-sm font-mono ${selectedPackages.size === 0 ? "text-gray-400 dark:text-gray-600" : "text-gray-700 dark:text-gray-300"}`}
        >
          {getBrewCommand()}
        </code>
        {selectedPackages.size === 0 && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-2 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap macos-blur">
            Select packages to generate a valid command
          </div>
        )}
        <div className="relative">
          <button
            onClick={() => setShowCopyOptions(!showCopyOptions)}
            className={`p-2 ${copiedCommand ? "bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "macos-button"} flex items-center gap-1`}
            title="Copy options"
            disabled={selectedPackages.size === 0}
          >
            {copiedCommand ? (
              <>
                <span className="text-xs font-medium mr-1">Copied!</span>
                <Copy className="w-4 h-4" />
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </>
            )}
          </button>
          {showCopyOptions && (
            <div className="absolute right-0 mt-2 w-72 macos-card macos-blur z-10 overflow-hidden animate-fadeIn">
              <div className="py-1">
                <button
                  onClick={() =>
                    copyToClipboard(getBrewCommand(false), "standard")
                  }
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100/60 dark:hover:bg-gray-700/60 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>
                    Copy{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      brew install
                    </span>{" "}
                    command
                  </span>
                </button>
                <button
                  onClick={() =>
                    copyToClipboard(getBrewCommand(true), "withInstall")
                  }
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100/60 dark:hover:bg-gray-700/60 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Copy with Homebrew installation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-1.5 text-sm font-medium transition-all macos-blur rounded-md
                    ${
                      selectedCategories.has(category)
                        ? "bg-blue-500/90 text-white dark:text-white border-none"
                        : "macos-button"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {selectedCategories.size > 0 && (
              <button
                onClick={() => setSelectedCategories(new Set())}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-flex items-center"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center">
            {selectedPackages.size > 0 && (
              <div className="mr-4 px-2.5 py-1 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full macos-blur">
                {selectedPackages.size}{" "}
                {selectedPackages.size === 1 ? "package" : "packages"} selected
              </div>
            )}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "installs" | "growth")
                }
                className="px-3 py-1.5 rounded-md macos-card macos-blur text-sm"
              >
                <option value="installs">Most Installed</option>
                <option value="growth">Fastest Growing</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className="p-6 macos-card macos-blur animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-md bg-gray-200/70 dark:bg-gray-800/70"></div>
                <div className="h-5 bg-gray-200/70 dark:bg-gray-800/70 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200/70 dark:bg-gray-800/70 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200/70 dark:bg-gray-800/70 rounded mb-3 w-full"></div>
              <div className="h-3 bg-gray-200/70 dark:bg-gray-800/70 rounded mb-3 w-1/3"></div>
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200/70 dark:bg-gray-800/70 rounded-full w-1/4"></div>
                <div className="h-4 bg-gray-200/70 dark:bg-gray-800/70 rounded w-1/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedAndFilteredPackages.length === 0 ? (
        <div className="py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full macos-card mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No packages found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try removing filters or changing the search criteria
          </p>
          {selectedCategories.size > 0 && (
            <button
              onClick={() => setSelectedCategories(new Set())}
              className="macos-button macos-blur"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {sortedAndFilteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 transition-all duration-200 cursor-pointer relative macos-card macos-blur
                ${
                  selectedPackages.has(pkg.id)
                    ? "border-2 border-blue-500 dark:border-blue-400 transform scale-[1.02] shadow-md"
                    : ""
                }`}
              onClick={() => togglePackage(pkg.id)}
              tabIndex={0}
              role="button"
              aria-pressed={selectedPackages.has(pkg.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  togglePackage(pkg.id);
                }
              }}
            >
              {selectedPackages.has(pkg.id) && (
                <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400"></div>
              )}
              <div className="flex items-center gap-3 mb-3">
                {pkg.iconUrl && (
                  <img
                    src={pkg.iconUrl}
                    alt={`${pkg.name} icon`}
                    className="w-10 h-10 rounded-md object-contain"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <h3 className="text-lg font-medium">{pkg.name}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {pkg.description || "No description available"}
              </p>
              {pkg.installCount && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {pkg.installCount.toLocaleString()} installations in the last
                  year
                </p>
              )}
              <div className="mt-3 flex justify-between items-center">
                <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 macos-blur">
                  {pkg.category}
                </span>
                {pkg.growthPercentage !== undefined && (
                  <span
                    className={`text-xs font-medium flex items-center ${pkg.growthPercentage >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {pkg.growthPercentage >= 0 ? "+" : ""}
                    {pkg.growthPercentage.toFixed(1)}%
                    {pkg.growthPercentage >= 0 ? (
                      <TrendingUpIcon className="h-4 w-4 ml-1" />
                    ) : (
                      <TrendingDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
