import { Beer, ExternalLink } from "lucide-react";
import { getPackages } from "./data/packages";
import PackageList from "./components/PackageList";

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default async function Home() {
  const packages = await getPackages();

  const categoryCount = new Set(packages.map((pkg) => pkg.category)).size;
  const totalInstalls = packages.reduce(
    (sum, pkg) => sum + (pkg.installCount ?? 0),
    0
  );

  const stats = [
    { label: "Apps", value: packages.length.toLocaleString() },
    { label: "Categories", value: categoryCount.toString() },
    { label: "Installs / year", value: compact.format(totalInstalls) },
  ];

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 max-w-7xl mx-auto">
      <nav className="flex items-center justify-between mb-10 sm:mb-14">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-sm">
            <Beer className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Brew<span className="text-blue-600 dark:text-blue-400">Base</span>
          </span>
        </div>
        <a
          href="https://brew.sh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-500/10 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
        >
          brew.sh
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </nav>

      <header className="mb-10 sm:mb-12 max-w-3xl">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          Pick your Mac apps.
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500 dark:from-blue-400 dark:to-violet-400">
            Copy one command.
          </span>
        </h1>
        <p className="mt-5 text-lg text-neutral-600 dark:text-neutral-400 max-w-xl">
          Browse the most installed Homebrew casks, select what you need, and
          set up a new machine in a single line.
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {stat.label}
              </dt>
              <dd className="text-2xl font-semibold tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <PackageList initialPackages={packages} />

      <footer className="text-center text-xs text-neutral-500 dark:text-neutral-400 pb-8">
        Install counts come from Homebrew&apos;s 365-day cask analytics.
      </footer>
    </div>
  );
}
