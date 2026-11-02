import Link from "next/link";
import { ArrowDown, ArrowUpRight, Beer, Code2 } from "lucide-react";
import { getPackages } from "./data/packages";
import PackageList from "./components/PackageList";

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const REPOSITORY_URL = "https://github.com/titouv/brew-base";

export default async function Home() {
  const packages = await getPackages();

  const categoryCount = new Set(packages.map((pkg) => pkg.category)).size;
  const totalInstalls = packages.reduce(
    (sum, pkg) => sum + (pkg.installCount ?? 0),
    0
  );

  const stats = {
    casks: packages.length.toLocaleString(),
    categories: categoryCount.toLocaleString(),
    installs: compact.format(totalInstalls),
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-brew-border bg-brew-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-brew-strong hover:text-brew-strong hover:no-underline"
          >
            <Beer
              className="h-6 w-6 shrink-0 text-brew-amber"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="font-serif text-2xl font-normal tracking-tight">
              BrewBase
            </span>
          </Link>

          <nav aria-label="Primary" className="flex items-center gap-1">
            <a
              href="#casks"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-brew-muted transition-colors hover:bg-brew-hover hover:text-brew-strong hover:no-underline sm:block"
            >
              Casks
            </a>
            <a
              href="https://formulae.brew.sh/analytics/"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-brew-muted transition-colors hover:bg-brew-hover hover:text-brew-strong hover:no-underline lg:block"
            >
              Analytics
            </a>
            <a
              href="https://brew.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-brew-muted transition-colors hover:bg-brew-hover hover:text-brew-strong hover:no-underline"
            >
              brew.sh
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href={REPOSITORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BrewBase source on GitHub (opens in a new tab)"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-brew-muted transition-colors hover:bg-brew-hover hover:text-brew-strong hover:no-underline"
            >
              <Code2 className="h-4 w-4" aria-hidden />
            </a>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="grid gap-8 pb-12 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brew-faint">
              Independent Homebrew cask browser
            </p>

            <h1 className="mt-5 max-w-[14em] font-serif text-[clamp(2.5rem,7vw,5rem)] font-normal leading-[0.98] tracking-[-0.025em] text-brew-strong">
              Pick your apps.
              <br />
              <span className="italic">Copy one command.</span>
            </h1>

            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-brew-muted">
              Browse the most installed Homebrew casks, select what you need
              and set up a new Mac in a single line.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#casks"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brew-strong px-5 py-2.5 text-sm font-bold text-brew-bg transition-colors hover:bg-brew-text hover:no-underline active:scale-[0.98] motion-reduce:active:scale-100"
              >
                Browse casks
                <ArrowDown className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://brew.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brew-border px-5 py-2.5 text-sm font-semibold text-brew-text transition-colors hover:border-brew-border-strong hover:bg-brew-surface hover:text-brew-strong hover:no-underline"
              >
                What is Homebrew?
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>

            <p className="mt-6 text-xs text-brew-faint">
              Install analytics from formulae.brew.sh. No account required.
            </p>
          </div>

          <dl
            aria-label="Catalogue statistics"
            className="grid grid-cols-3 gap-5 border-t border-brew-border pt-5 lg:self-end lg:border-l lg:border-t-0 lg:pb-1 lg:pl-8 lg:pt-0"
          >
            <div>
              <dt className="text-xs text-brew-muted">Casks</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-brew-strong">
                {stats.casks}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-brew-muted">Categories</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-brew-strong">
                {stats.categories}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-brew-muted">Installs / year</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-brew-strong">
                {stats.installs}
              </dd>
            </div>
          </dl>
        </section>

        <section
          id="casks"
          aria-labelledby="casks-heading"
          className="scroll-mt-24 pb-4"
        >
          <div className="mb-6">
            <h2
              id="casks-heading"
              className="text-2xl font-bold tracking-tight text-brew-strong"
            >
              Browse casks
            </h2>
            <p className="mt-1 text-sm text-brew-muted">
              Filter, sort and select the apps for your next Mac.
            </p>
          </div>

          <PackageList initialPackages={packages} />
        </section>
      </main>

      <footer className="mt-16 border-t border-brew-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-serif text-xl font-normal tracking-tight text-brew-strong">
              BrewBase
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-brew-muted">
              A fast, independent way to assemble a Homebrew cask install
              command.
            </p>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-brew-faint">
              BrewBase is not affiliated with or endorsed by Homebrew.
            </p>
          </div>

          <nav aria-label="Product">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brew-faint">
              Product
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#casks" className="text-brew-muted hover:text-brew-strong">
                  Browse casks
                </a>
              </li>
              <li>
                <a
                  href="https://formulae.brew.sh/analytics/"
                  className="text-brew-muted hover:text-brew-strong"
                >
                  Analytics
                </a>
              </li>
              <li>
                <a
                  href="https://brew.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brew-muted hover:text-brew-strong"
                >
                  brew.sh
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Data and source">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brew-faint">
              Data and source
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://formulae.brew.sh/api/cask.json"
                  className="text-brew-muted hover:text-brew-strong"
                >
                  Cask metadata
                </a>
              </li>
              <li>
                <a
                  href="https://formulae.brew.sh/api/analytics/cask-install/365d.json"
                  className="text-brew-muted hover:text-brew-strong"
                >
                  Install analytics
                </a>
              </li>
              <li>
                <a
                  href={REPOSITORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brew-muted hover:text-brew-strong"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-brew-border">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-brew-faint sm:px-6">
            <p>© {new Date().getFullYear()} BrewBase</p>
            <p>Data from formulae.brew.sh</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
