import Link from "next/link";
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
    { label: "Casks", value: packages.length.toLocaleString() },
    { label: "Categories", value: categoryCount.toString() },
    { label: "Installs / year", value: compact.format(totalInstalls) },
  ];

  return (
    <div className="mx-auto w-full max-w-[62rem] px-4 pb-10 sm:px-6">
      <header className="pt-5">
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3"
        >
          <Link
            href="/"
            className="flex items-center gap-3 text-brew-text hover:text-brew-text hover:no-underline"
          >
            <Beer
              className="h-9 w-9 shrink-0 text-brew-amber"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="text-2xl font-black tracking-tight">BrewBase</span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <a href="https://formulae.brew.sh/cask/">Browse casks</a>
            <a href="https://formulae.brew.sh/analytics/">Analytics</a>
            <a
              href="https://brew.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              brew.sh
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </nav>
      </header>

      <main id="main">
        <section className="pb-10 pt-12 text-center sm:pb-14 sm:pt-16">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-brew-soft">
            An independent Homebrew cask browser
          </p>
          <h1 className="mx-auto mt-4 max-w-[15em] text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-[1.05] tracking-tight text-brew-text [text-shadow:1px_1px_10px_rgba(0,0,0,0.25)]">
            Pick your apps.
            <br />
            <span className="text-brew-strong">Copy one command.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[36rem] text-lg text-brew-text">
            Browse the most installed Homebrew casks, select what you need and
            set up a new Mac in a single line.
          </p>

          <dl className="mx-auto mt-9 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-brew border border-brew-border bg-brew-surface px-4 py-4 text-left"
              >
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-brew-soft">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-3xl font-black tabular-nums text-brew-strong">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="casks-heading">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2
              id="casks-heading"
              className="text-2xl font-bold text-brew-text"
            >
              Browse casks
            </h2>
            <p className="text-sm text-brew-soft">
              365-day install analytics from formulae.brew.sh
            </p>
          </div>

          <PackageList initialPackages={packages} />
        </section>
      </main>

      <footer className="mt-14 border-t border-brew-border py-8 text-center text-sm text-brew-soft">
        <p>
          Install counts come from{" "}
          <a href="https://formulae.brew.sh/analytics/cask-install/365d/">
            Homebrew&apos;s 365-day cask analytics
          </a>
          .
        </p>
        <p className="mt-2">
          BrewBase is an independent project, not affiliated with or endorsed by
          Homebrew.
        </p>
      </footer>
    </div>
  );
}
