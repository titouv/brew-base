import axios from "axios";

const FETCH_TIMEOUT_MS = 5000;
const MAX_CONCURRENT_FETCHES = 12;
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};
const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);

interface IconCandidate {
  url: string;
  score: number;
}

let activeFetches = 0;
const waiting: (() => void)[] = [];

async function withFetchSlot<T>(task: () => Promise<T>): Promise<T> {
  if (activeFetches >= MAX_CONCURRENT_FETCHES) {
    await new Promise<void>((resolve) => waiting.push(resolve));
  }
  activeFetches++;
  try {
    return await task();
  } finally {
    activeFetches--;
    waiting.shift()?.();
  }
}

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of tag.matchAll(/([a-z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3];
  }
  return attrs;
}

function scoreIcon(rel: string, sizes: string | undefined, href: string) {
  const rels = rel.toLowerCase().split(/\s+/);
  const isAppleTouch = rels.some((r) => r.startsWith("apple-touch-icon"));
  const isIcon = rels.includes("icon");
  if (!isAppleTouch && !isIcon) return null;

  const dimensions = Array.from((sizes ?? "").matchAll(/(\d+)x\d+/g), (m) =>
    parseInt(m[1])
  );
  const isVector = /\.svg(\?|$)/i.test(href) || sizes?.includes("any");
  const isBitmapIco = /\.ico(\?|$)/i.test(href);

  // Apple touch icons are authored as app icons, so they beat any plain favicon.
  const size = dimensions.length
    ? Math.max(...dimensions)
    : isVector
      ? 256
      : isAppleTouch
        ? 180
        : isBitmapIco
          ? 16
          : 32;
  return (isAppleTouch ? 1000 : 0) + size;
}

/** Picks the best icon a page declares in its <link> tags. */
export function pickPageIcon(html: string, baseUrl: string): string | null {
  const candidates: IconCandidate[] = [];

  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const { rel, href, sizes } = parseAttributes(tag);
    if (!rel || !href || href.startsWith("data:")) continue;

    const score = scoreIcon(rel, sizes, href);
    if (score === null) continue;

    try {
      candidates.push({ url: new URL(href, baseUrl).toString(), score });
    } catch {
      // Ignore hrefs that cannot be resolved.
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.url ?? null;
}

/** GitHub repo pages only declare GitHub's own favicon, so use the owner's avatar instead. */
function githubOwnerAvatar(homepage: URL): string | null {
  if (!GITHUB_HOSTS.has(homepage.hostname)) return null;
  const owner = homepage.pathname.split("/").filter(Boolean)[0];
  return owner ? `https://github.com/${encodeURIComponent(owner)}.png?size=128` : null;
}

async function fetchPage(url: URL) {
  const response = await axios.get<string>(url.toString(), {
    timeout: FETCH_TIMEOUT_MS,
    maxContentLength: 2 * 1024 * 1024,
    responseType: "text",
    headers: { ...BROWSER_HEADERS, Accept: "text/html" },
  });
  return {
    html: response.data,
    // Short links (e.g. aka.ms) can redirect somewhere else, such as a GitHub repo.
    finalUrl: new URL(response.request?.res?.responseUrl ?? url.toString()),
  };
}

/** Guards against icons that 404, are blocked, or resolve to a non-image. */
async function isLoadableImage(url: string): Promise<boolean> {
  try {
    const response = await withFetchSlot(() =>
      axios.get(url, {
        timeout: FETCH_TIMEOUT_MS,
        responseType: "stream",
        headers: BROWSER_HEADERS,
      })
    );
    response.data.destroy();
    return /^image\/|icon/i.test(String(response.headers["content-type"] ?? ""));
  } catch {
    return false;
  }
}

/**
 * Resolves an icon for a cask from its homepage, without any per-app data:
 * GitHub repos use the owner's avatar, other sites use the icon they declare
 * themselves, and the hostname favicon service is the last resort. Every
 * candidate is checked to load before it is used.
 */
export async function resolveIconUrl(homepage: string): Promise<string | undefined> {
  let url: URL;
  try {
    url = new URL(homepage);
  } catch {
    return undefined;
  }

  const avatar = githubOwnerAvatar(url);
  if (avatar && (await isLoadableImage(avatar))) return avatar;

  try {
    const { html, finalUrl } = await withFetchSlot(() => fetchPage(url));
    const candidates = [
      githubOwnerAvatar(finalUrl),
      pickPageIcon(html, finalUrl.toString()),
    ];
    for (const candidate of candidates) {
      if (candidate && candidate !== avatar && (await isLoadableImage(candidate))) {
        return candidate;
      }
    }
  } catch {
    // Unreachable or bot-blocking sites fall through to the favicon service.
  }
  return `https://icon.horse/icon/${url.hostname}`;
}
