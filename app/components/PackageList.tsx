"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BrewPackage } from "../data/packages";
import {
  CheckIcon,
  ChevronDown,
  Copy,
  Download,
  SearchIcon,
  SearchXIcon,
  Terminal,
  TrendingDownIcon,
  TrendingUpIcon,
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

function PackageIcon({ name, iconUrl }: { name: string; iconUrl?: string }) {
  const [failed, setFailed] = useState(false);

  if (!iconUrl || failed) {
    return (
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brew-border bg-brew-raised text-lg font-bold text-brew-amber"
        aria-hidden
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  // The padded tile gives full-bleed and transparent icons the same breathing room.
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brew-border bg-brew-strong p-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl}
        alt=""
        className="h-full w-full rounded-lg object-contain"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

function CommandText({ command }: { command: string }) {
  const [head, ...tokens] = command.split(" ");

  return (
    <span className="whitespace-nowrap">
      <span className="text-brew-amber">{head}</span>{" "}
      {tokens.map((token, index) => {
        const color =
          token === "--cask"
            ? "text-brew-cyan"
            : token.startsWith("-")
              ? "text-brew-muted"
              : index === 0
                ? "text-brew-text"
                : "text-brew-green";

        return (
          <span key={`${token}-${index}`} className={color}>
            {token}
            {index < tokens.length - 1 ? " " : ""}
          </span>
        );
      })}
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
  const searchRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (
        event.key !== "/" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;

      event.preventDefault();
      searchRef.current?.focus();
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
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

  const hasSelection = selectedPackages.size > 0;

  return (
    <>
      <div className="sticky top-[4.5rem] z-30 mb-6">
        <div className="rounded-2xl border border-brew-border bg-brew-surface/85 p-2.5 shadow-brew backdrop-blur-xl">
          <div className="flex items-stretch gap-2">
            <div
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brew-amber/10 text-brew-amber ring-1 ring-inset ring-brew-amber/20 sm:flex"
              aria-hidden
            >
              <Terminal className="h-4 w-4" />
            </div>

            <div className="flex min-h-11 min-w-0 flex-1 items-center overflow-x-auto rounded-xl border border-brew-border bg-brew-code px-3 font-mono text-sm">
              <code className="flex items-center">
                <span className="mr-2 select-none text-brew-faint" aria-hidden>
                  $
                </span>
                <CommandText command={getBrewCommand()} />
              </code>
              {!hasSelection && (
                <span className="ml-3 whitespace-nowrap font-sans text-xs text-brew-faint">
                  Select casks below
                </span>
              )}
            </div>

            {hasSelection && (
              <button
                type="button"
                onClick={() => setSelectedPackages(new Set())}
                aria-label={`Clear ${selectedPackages.size} selected casks`}
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 rounded-xl border border-brew-border px-2.5 text-xs font-semibold text-brew-muted transition-colors hover:border-brew-border-strong hover:bg-brew-hover hover:text-brew-strong md:justify-start"
              >
                <XIcon className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden md:inline">
                  Clear {selectedPackages.size}
                </span>
              </button>
            )}

            <div ref={copyMenuRef} className="relative flex shrink-0 items-stretch">
              <div
                className={`flex items-stretch overflow-hidden rounded-xl ${
                  hasSelection
                    ? "bg-brew-amber text-brew-on-amber"
                    : "bg-brew-raised text-brew-faint"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(getBrewCommand(false), "standard")
                  }
                  disabled={!hasSelection}
                  className="flex min-h-11 items-center gap-2 px-3.5 text-sm font-bold transition-colors enabled:hover:bg-brew-amber-soft disabled:cursor-not-allowed"
                >
                  {copiedCommand ? (
                    <CheckIcon className="h-4 w-4" aria-hidden />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden />
                  )}
                  <span className="hidden sm:inline">
                    {copiedCommand ? "Copied" : "Copy"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCopyOptions(!showCopyOptions)}
                  disabled={!hasSelection}
                  aria-label="More copy options"
                  aria-haspopup="menu"
                  aria-expanded={showCopyOptions}
                  aria-controls={showCopyOptions ? "copy-menu" : undefined}
                  className={`flex min-h-11 w-9 items-center justify-center border-l transition-colors enabled:hover:bg-brew-amber-soft disabled:cursor-not-allowed ${
                    hasSelection
                      ? "border-brew-on-amber/15"
                      : "border-brew-border"
                  }`}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ease-brew ${
                      showCopyOptions ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
              </div>

              {showCopyOptions && (
                <div
                  id="copy-menu"
                  role="menu"
                  aria-label="Copy options"
                  className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-xl border border-brew-border bg-brew-surface shadow-brew"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      copyToClipboard(getBrewCommand(false), "standard")
                    }
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-brew-hover"
                  >
                    <Copy
                      className="mt-0.5 h-4 w-4 shrink-0 text-brew-amber"
                      aria-hidden
                    />
                    <span>
                      <span className="block text-sm font-semibold text-brew-text">
                        Copy command
                      </span>
                      <span className="mt-0.5 block text-xs text-brew-faint">
                        Just the brew install command
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      copyToClipboard(getBrewCommand(true), "withInstall")
                    }
                    className="flex w-full items-start gap-3 border-t border-brew-border px-4 py-3 text-left transition-colors hover:bg-brew-hover"
                  >
                    <Download
                      className="mt-0.5 h-4 w-4 shrink-0 text-brew-amber"
                      aria-hidden
                    />
                    <span>
                      <span className="block text-sm font-semibold text-brew-text">
                        Copy with Homebrew
                      </span>
                      <span className="mt-0.5 block text-xs text-brew-faint">
                        Includes the official installer script
                      </span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <span className="sr-only" role="status">
            {copiedCommand ? "Command copied to clipboard" : ""}
          </span>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-brew-border bg-brew-surface p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <SearchIcon
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brew-faint"
              aria-hidden
            />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setQuery("");
                  event.currentTarget.blur();
                }
              }}
              placeholder="Search casks, identifiers or descriptions"
              aria-label="Search casks"
              aria-keyshortcuts="/"
              autoComplete="off"
              spellCheck={false}
              className="min-h-11 w-full rounded-xl border border-brew-border bg-brew-bg/60 py-2.5 pl-10 pr-14 text-sm text-brew-strong placeholder:text-brew-faint transition-colors focus:border-brew-border-strong"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center rounded-md border border-brew-border bg-brew-raised px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brew-faint sm:flex">
              /
            </kbd>
          </div>

          <div
            role="group"
            aria-label="Sort by"
            className="inline-flex shrink-0 self-start rounded-xl border border-brew-border bg-brew-bg/60 p-1 lg:self-auto"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSortBy(option.value)}
                aria-pressed={sortBy === option.value}
                className={`min-h-10 rounded-lg px-4 text-sm transition-colors ${
                  sortBy === option.value
                    ? "bg-brew-amber font-semibold text-brew-on-amber"
                    : "font-medium text-brew-muted hover:bg-brew-hover hover:text-brew-text"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-brew-border pt-3">
          {categories.map(({ name, count }) => {
            const active = selectedCategories.has(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggleCategory(name)}
                aria-pressed={active}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors ${
                  active
                    ? "border-brew-amber bg-brew-amber text-brew-on-amber"
                    : "border-brew-border bg-brew-bg/40 text-brew-muted hover:border-brew-border-strong hover:text-brew-text"
                }`}
              >
                {name}
                <span className="text-[10px] tabular-nums opacity-60">
                  {count}
                </span>
              </button>
            );
          })}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-9 px-2 text-xs font-semibold text-brew-amber-deep transition-colors hover:text-brew-amber-soft hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-brew-faint">
          <p aria-live="polite">
            Showing {visiblePackages.length}{" "}
            {visiblePackages.length === 1 ? "cask" : "casks"}
          </p>
          {hasSelection && (
            <p className="font-medium text-brew-amber-soft">
              {selectedPackages.size} selected
            </p>
          )}
        </div>
      </div>

      {visiblePackages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brew-border-strong bg-brew-surface/40 px-6 py-16 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brew-raised text-brew-faint">
            <SearchXIcon className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="mt-4 text-xl font-bold text-brew-strong">
            No casks found
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-brew-muted">
            Try a different search or remove a filter.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 min-h-11 rounded-xl border border-brew-border bg-brew-surface px-4 py-2 text-sm font-semibold text-brew-text transition-colors hover:border-brew-border-strong hover:bg-brew-hover"
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
                className={`group relative flex cursor-pointer flex-col rounded-2xl border p-5 transition-[background-color,border-color,box-shadow] duration-200 ease-brew ${
                  selected
                    ? "border-brew-amber/60 bg-brew-amber/[0.06] shadow-brew"
                    : "border-brew-border bg-brew-surface hover:border-brew-border-strong hover:bg-brew-raised hover:shadow-brew-lift"
                }`}
                onClick={() => togglePackage(pkg.id)}
                tabIndex={0}
                role="button"
                aria-pressed={selected}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    togglePackage(pkg.id);
                  }
                }}
              >
                <span
                  className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                    selected
                      ? "border-brew-amber bg-brew-amber text-brew-on-amber"
                      : "border-brew-border-strong bg-brew-bg/50 text-transparent group-hover:border-brew-muted"
                  }`}
                  aria-hidden
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>

                <div className="mb-3 flex items-center gap-3 pr-8">
                  <PackageIcon name={pkg.name} iconUrl={pkg.iconUrl} />
                  <div className="min-w-0">
                    <h3
                      className="truncate text-[0.95rem] font-semibold leading-tight text-brew-strong"
                      title={pkg.name}
                    >
                      {pkg.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-brew-faint">
                      #{rank} · {pkg.category}
                    </p>
                  </div>
                </div>

                <p
                  className="mb-4 line-clamp-2 min-h-10 text-sm leading-relaxed text-brew-muted"
                  title={pkg.description || undefined}
                >
                  {pkg.description || "No description available"}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-brew-border pt-3 text-xs">
                  {pkg.installCount !== undefined ? (
                    <span
                      className="text-brew-faint"
                      title={`${pkg.installCount.toLocaleString()} installations in the last year`}
                    >
                      <span className="font-semibold tabular-nums text-brew-text">
                        {compact.format(pkg.installCount)}
                      </span>{" "}
                      installs / year
                    </span>
                  ) : (
                    <span />
                  )}
                  {pkg.growthPercentage !== undefined && (
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-semibold tabular-nums ${
                        pkg.growthPercentage >= 0
                          ? "bg-brew-green/10 text-brew-green"
                          : "bg-brew-red/10 text-brew-red"
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
