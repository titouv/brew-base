"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BrewPackage } from "../data/packages";
import {
  TrendingDownIcon,
  TrendingUpIcon,
  Copy,
  ChevronDown,
  CheckIcon,
  SearchIcon,
  SearchXIcon,
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

function PackageIcon({ name, iconUrl }: { name: string; iconUrl?: string }) {
  const [failed, setFailed] = useState(false);

  if (!iconUrl || failed) {
    return (
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-brew border border-brew-border bg-brew-surface text-lg font-bold text-brew-text"
        aria-hidden
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  // The padded tile gives full-bleed and transparent icons the same breathing room.
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-brew border border-brew-border bg-white p-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl}
        alt=""
        className="h-full w-full rounded-[0.2em] object-contain"
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
  const copyMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!copiedCommand) return;
    const timeout = setTimeout(() => setCopiedCommand(null), 2000);
    return () => clearTimeout(timeout);
  }, [copiedCommand]);

  useEffect(() => {
    if (!showCopyOptions) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!copyMenuRef.current?.contains(event.target as Node)) {
        setShowCopyOptions(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowCopyOptions(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [showCopyOptions]);

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
    void navigator.clipboard.writeText(text).catch(() => {
      // Clipboard access can be denied by the browser; keep the UI responsive.
    });
    setCopiedCommand(type);
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
      <div className="sticky top-3 z-20 mb-8 bg-brew-bg">
        <div className="flex items-stretch rounded-brew border border-brew-border bg-brew-code">
          <code className="flex min-h-11 min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap rounded-l-brew px-4 py-3 font-mono text-sm">
            <span className="select-none text-brew-green" aria-hidden>
              $
            </span>
            <span
              className={
                selectedPackages.size === 0
                  ? "text-brew-soft"
                  : "text-brew-strong"
              }
            >
              {getBrewCommand()}
            </span>
            {selectedPackages.size === 0 && (
              <span className="font-sans text-xs text-brew-soft">
                Select casks below
              </span>
            )}
          </code>

          {selectedPackages.size > 0 && (
            <button
              type="button"
              onClick={() => setSelectedPackages(new Set())}
              className="min-h-11 shrink-0 border-l border-brew-border px-3 text-xs font-bold text-brew-link transition-colors hover:bg-brew-selection hover:text-brew-link-hover"
            >
              <span className="sm:hidden">Clear</span>
              <span className="hidden sm:inline">
                Clear {selectedPackages.size}
              </span>
            </button>
          )}

          <div ref={copyMenuRef} className="relative flex shrink-0">
            <button
              type="button"
              onClick={() => setShowCopyOptions(!showCopyOptions)}
              className={`flex min-h-11 items-center gap-2 rounded-r-brew border-l border-brew-border px-4 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                copiedCommand
                  ? "bg-brew-selection text-brew-strong"
                  : "bg-brew-code text-brew-text enabled:hover:bg-brew-selection enabled:hover:text-brew-strong"
              }`}
              title="Copy options"
              aria-label="Copy options"
              aria-haspopup="menu"
              aria-expanded={showCopyOptions}
              disabled={selectedPackages.size === 0}
            >
              {copiedCommand ? (
                <>
                  <CheckIcon className="h-4 w-4" aria-hidden />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden />
                  Copy
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>

            {showCopyOptions && (
              <div
                role="menu"
                aria-label="Copy options"
                className="absolute right-0 top-full z-30 mt-2 w-72 overflow-hidden rounded-brew border border-brew-border bg-brew-bg shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    copyToClipboard(getBrewCommand(false), "standard")
                  }
                  className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm text-brew-text transition-colors hover:bg-brew-selection hover:text-brew-strong"
                >
                  <Copy
                    className="mt-0.5 h-4 w-4 shrink-0 text-brew-soft"
                    aria-hidden
                  />
                  <span>
                    Copy <code className="text-brew-soft">brew install</code>{" "}
                    command
                  </span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    copyToClipboard(getBrewCommand(true), "withInstall")
                  }
                  className="flex w-full items-start gap-3 border-t border-brew-border px-4 py-3 text-left text-sm text-brew-text transition-colors hover:bg-brew-selection hover:text-brew-strong"
                >
                  <Copy
                    className="mt-0.5 h-4 w-4 shrink-0 text-brew-soft"
                    aria-hidden
                  />
                  <span>Copy with Homebrew installation</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <span className="sr-only" role="status">
          {copiedCommand ? "Command copied to clipboard" : ""}
        </span>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brew-soft"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search casks…"
              aria-label="Search casks"
              className="min-h-11 w-full rounded-brew border border-brew-border bg-brew-surface py-2.5 pl-10 pr-4 text-sm text-brew-strong placeholder:text-brew-soft/70"
            />
          </div>

          <div
            role="group"
            aria-label="Sort by"
            className="inline-flex shrink-0 self-start rounded-brew border border-brew-border bg-brew-surface p-1 sm:self-auto"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSortBy(option.value)}
                aria-pressed={sortBy === option.value}
                className={`min-h-11 rounded-[0.25em] px-3.5 py-1.5 text-sm transition-colors ${
                  sortBy === option.value
                    ? "bg-brew-text font-bold text-brew-bg"
                    : "font-semibold text-brew-text hover:bg-brew-surface-hover"
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
                type="button"
                onClick={() => toggleCategory(name)}
                aria-pressed={active}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-brew border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-brew-text bg-brew-text font-bold text-brew-bg"
                    : "border-brew-border bg-brew-surface font-semibold text-brew-text hover:bg-brew-surface-hover"
                }`}
              >
                {name}
                <span className="text-xs tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 min-h-11 px-1 text-sm font-bold text-brew-link transition-colors hover:text-brew-link-hover hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <p className="text-sm text-brew-soft" aria-live="polite">
          Showing {visiblePackages.length}{" "}
          {visiblePackages.length === 1 ? "cask" : "casks"}
          {selectedPackages.size > 0 && ` · ${selectedPackages.size} selected`}
        </p>
      </div>

      {visiblePackages.length === 0 ? (
        <div className="py-16 text-center">
          <SearchXIcon
            className="mx-auto mb-4 h-10 w-10 text-brew-soft"
            aria-hidden
          />
          <h3 className="mb-2 text-xl font-bold text-brew-strong">
            No casks found
          </h3>
          <p className="mb-5 text-brew-text">
            Try a different search or remove a filter.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-11 rounded-brew border border-brew-border bg-brew-surface px-4 py-2 text-sm font-bold text-brew-text transition-colors hover:bg-brew-surface-hover"
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
                className={`relative flex cursor-pointer flex-col rounded-brew border p-5 transition-colors ${
                  selected
                    ? "border-brew-text bg-brew-surface-hover"
                    : "border-brew-border bg-brew-surface hover:border-brew-border-strong hover:bg-brew-surface-hover"
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
                  className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-[0.2em] border transition-colors ${
                    selected
                      ? "border-brew-text bg-brew-text text-brew-bg"
                      : "border-brew-soft/60"
                  }`}
                  aria-hidden
                >
                  {selected && <CheckIcon className="h-3.5 w-3.5" />}
                </span>

                <div className="mb-3 flex items-center gap-3 pr-8">
                  <PackageIcon name={pkg.name} iconUrl={pkg.iconUrl} />
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold leading-tight text-brew-strong">
                      {pkg.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-brew-soft">
                      #{rank} · {pkg.category}
                    </p>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 min-h-10 text-sm text-brew-text">
                  {pkg.description || "No description available"}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-brew-border pt-3 text-xs">
                  {pkg.installCount !== undefined ? (
                    <span
                      className="text-brew-soft"
                      title={`${pkg.installCount.toLocaleString()} installations in the last year`}
                    >
                      <span className="font-bold tabular-nums text-brew-strong">
                        {compact.format(pkg.installCount)}
                      </span>{" "}
                      installs / year
                    </span>
                  ) : (
                    <span />
                  )}
                  {pkg.growthPercentage !== undefined && (
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 font-bold tabular-nums ${
                        pkg.growthPercentage >= 0
                          ? "text-brew-green"
                          : "text-brew-red"
                      }`}
                      title="Change in daily installs compared with the previous year"
                    >
                      {pkg.growthPercentage >= 0 ? (
                        <TrendingUpIcon className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <TrendingDownIcon className="h-3.5 w-3.5" aria-hidden />
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
