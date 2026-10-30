"use client";

import { useState, useMemo } from "react";
import { BrewPackage } from "../data/packages";
import {
  TrendingDownIcon,
  TrendingUpIcon,
  Copy,
  ChevronDown,
  CheckIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

interface PackageListProps {
  initialPackages: BrewPackage[];
}

type SortBy = "installs" | "growth";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "installs", label: "Most installed" },
  { value: "growth", label: "Fastest growing" },
];

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60";

function PackageIcon({ name, iconUrl }: { name: string; iconUrl?: string }) {
  const [failed, setFailed] = useState(false);

  if (!iconUrl || failed) {
    return (
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-500/15 text-lg font-semibold text-neutral-500 dark:text-neutral-400"
        aria-hidden
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  // The padded tile gives full-bleed and transparent icons the same breathing room.
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl}
        alt=""
        className="h-full w-full rounded-md object-contain"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export default function PackageList({ initialPackages }: PackageListProps) {
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(
    new Set()
  );
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [sortBy, setSortBy] = useState<SortBy>("installs");
  const [query, setQuery] = useState("");
  const [showCopyOptions, setShowCopyOptions] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

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

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const pkg of initialPackages) {
      counts.set(pkg.category, (counts.get(pkg.category) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [initialPackages]);

  // Rank follows the active sort over the full list, so it stays stable while filtering.
  const sorted = useMemo(() => {
    const key = sortBy === "growth" ? "growthPercentage" : "installCount";
    return [...initialPackages].sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
  }, [initialPackages, sortBy]);

  const visiblePackages = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sorted
      .map((pkg, index) => ({ pkg, rank: index + 1 }))
      .filter(
        ({ pkg }) =>
          (selectedCategories.size === 0 ||
            selectedCategories.has(pkg.category)) &&
          (needle === "" ||
            pkg.name.toLowerCase().includes(needle) ||
            pkg.id.toLowerCase().includes(needle) ||
            pkg.description?.toLowerCase().includes(needle))
      );
  }, [sorted, selectedCategories, query]);

  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const hasFilters = selectedCategories.size > 0 || query !== "";
  const clearFilters = () => {
    setSelectedCategories(new Set());
    setQuery("");
  };

  return (
    <>
      <div className="sticky top-4 z-20 mb-8 rounded-2xl bg-neutral-900/95 text-neutral-100 shadow-lg ring-1 ring-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3 p-3 pl-5">
          <span
            className="select-none font-mono text-sm text-emerald-400"
            aria-hidden
          >
            $
          </span>
          <code
            className={`min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm font-mono ${
              selectedPackages.size === 0
                ? "text-neutral-500"
                : "text-neutral-100"
            }`}
          >
            {getBrewCommand()}
            {selectedPackages.size === 0 && (
              <span className="ml-2 font-sans text-xs text-neutral-500">
                ← select apps below
              </span>
            )}
          </code>
          {selectedPackages.size > 0 && (
            <button
              onClick={() => setSelectedPackages(new Set())}
              className={`hidden shrink-0 rounded-lg px-2.5 py-1.5 text-xs text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100 sm:block ${focusRing}`}
            >
              Clear {selectedPackages.size}
            </button>
          )}
          <div
            className="relative shrink-0"
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowCopyOptions(false);
            }}
          >
            <button
              onClick={() => setShowCopyOptions(!showCopyOptions)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${focusRing} ${
                copiedCommand
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-blue-600 text-white enabled:hover:bg-blue-500 enabled:active:bg-blue-700"
              }`}
              title="Copy options"
              aria-label="Copy options"
              aria-haspopup="menu"
              aria-expanded={showCopyOptions}
              disabled={selectedPackages.size === 0}
            >
              {copiedCommand ? (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </>
              )}
            </button>
            {showCopyOptions && (
              <div
                role="menu"
                className="animate-fadeIn absolute right-0 top-full z-10 mt-2 w-72 overflow-hidden rounded-xl border border-neutral-200/60 bg-white/95 text-neutral-800 shadow-xl backdrop-blur-xl dark:border-neutral-700/60 dark:bg-neutral-800/95 dark:text-neutral-100"
              >
                <div className="py-1">
                  <button
                    role="menuitem"
                    onClick={() =>
                      copyToClipboard(getBrewCommand(false), "standard")
                    }
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-neutral-100/80 focus-visible:bg-neutral-100/80 focus-visible:outline-none dark:hover:bg-neutral-700/80 dark:focus-visible:bg-neutral-700/80"
                  >
                    <Copy className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    <span>
                      Copy{" "}
                      <span className="text-neutral-500 dark:text-neutral-400">
                        brew install
                      </span>{" "}
                      command
                    </span>
                  </button>
                  <button
                    role="menuitem"
                    onClick={() =>
                      copyToClipboard(getBrewCommand(true), "withInstall")
                    }
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-neutral-100/80 focus-visible:bg-neutral-100/80 focus-visible:outline-none dark:hover:bg-neutral-700/80 dark:focus-visible:bg-neutral-700/80"
                  >
                    <Copy className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    <span>Copy with Homebrew installation</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps…"
              aria-label="Search apps"
              className={`surface w-full rounded-xl py-2.5 pl-10 pr-4 text-sm placeholder:text-neutral-400 ${focusRing}`}
            />
          </div>

          <div
            role="group"
            aria-label="Sort by"
            className="surface inline-flex shrink-0 rounded-xl p-1"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                aria-pressed={sortBy === option.value}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${focusRing} ${
                  sortBy === option.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map(({ name, count }) => {
            const active = selectedCategories.has(name);
            return (
              <button
                key={name}
                onClick={() => toggleCategory(name)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full py-1.5 pl-3.5 pr-3 text-sm font-medium transition-colors ${focusRing} ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-neutral-500/10 text-neutral-700 hover:bg-neutral-500/20 dark:text-neutral-300"
                }`}
              >
                {name}
                <span
                  className={`text-xs tabular-nums ${
                    active ? "text-white/70" : "text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className={`ml-1 rounded px-1 text-sm text-blue-600 hover:underline dark:text-blue-400 ${focusRing}`}
            >
              Clear filters
            </button>
          )}
        </div>

        <p
          className="text-xs text-neutral-500 dark:text-neutral-400"
          aria-live="polite"
        >
          Showing {visiblePackages.length}{" "}
          {visiblePackages.length === 1 ? "app" : "apps"}
          {selectedPackages.size > 0 && ` · ${selectedPackages.size} selected`}
        </p>
      </div>

      {visiblePackages.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-neutral-500/10">
            <XIcon className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No apps found</h3>
          <p className="mb-4 text-neutral-500 dark:text-neutral-400">
            Try a different search or remove some filters.
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className={`rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-500/20 dark:text-blue-400 ${focusRing}`}
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePackages.map(({ pkg, rank }) => {
            const selected = selectedPackages.has(pkg.id);
            return (
              <div
                key={pkg.id}
                className={`surface surface-interactive relative cursor-pointer rounded-2xl p-5 ${focusRing} ${
                  selected
                    ? "!border-blue-500 ring-2 ring-blue-500/60 dark:!border-blue-400 dark:ring-blue-400/60"
                    : ""
                }`}
                onClick={() => togglePackage(pkg.id)}
                tabIndex={0}
                role="button"
                aria-pressed={selected}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    togglePackage(pkg.id);
                  }
                }}
              >
                <span
                  className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                    selected
                      ? "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400"
                      : "border-neutral-300 dark:border-neutral-600"
                  }`}
                  aria-hidden
                >
                  {selected && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                </span>

                <div className="mb-3 flex items-center gap-3 pr-8">
                  <PackageIcon name={pkg.name} iconUrl={pkg.iconUrl} />
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold leading-tight">
                      {pkg.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      #{rank} · {pkg.category}
                    </p>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 min-h-10 text-sm text-neutral-600 dark:text-neutral-300">
                  {pkg.description || "No description available"}
                </p>

                <div className="flex items-center justify-between border-t border-neutral-500/10 pt-3 text-xs">
                  {pkg.installCount !== undefined ? (
                    <span
                      className="text-neutral-500 dark:text-neutral-400"
                      title={`${pkg.installCount.toLocaleString()} installations in the last year`}
                    >
                      <span className="font-semibold tabular-nums text-neutral-800 dark:text-neutral-100">
                        {compact.format(pkg.installCount)}
                      </span>{" "}
                      installs / year
                    </span>
                  ) : (
                    <span />
                  )}
                  {pkg.growthPercentage !== undefined && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium tabular-nums ${
                        pkg.growthPercentage >= 0
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {pkg.growthPercentage >= 0 ? (
                        <TrendingUpIcon className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDownIcon className="h-3.5 w-3.5" />
                      )}
                      {pkg.growthPercentage >= 0 ? "+" : ""}
                      {pkg.growthPercentage.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
