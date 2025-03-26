import axios from 'axios';

interface AnalyticsItem {
  cask: string;
  count: string;
}

export interface BrewPackage {
  id: string;
  name: string;
  description: string;
  category: 'IDE & Editors' | 'Terminal & CLI' | 'Dev Tools' | 'Productivity' | 'Utilities' | 'Media' | 'Communication';
  popular: boolean;
  installCount?: number;
  growthPercentage?: number;
  iconUrl?: string;
}

const HOMEBREW_CASK_90D_API_URL = 'https://formulae.brew.sh/api/analytics/cask-install/90d.json';
const HOMEBREW_CASK_365D_API_URL = 'https://formulae.brew.sh/api/analytics/cask-install/365d.json';
const HOMEBREW_CASK_DETAILS_API_URL = 'https://formulae.brew.sh/api/cask.json';

interface CaskDetails {
  token: string;
  desc: string;
  homepage: string;
  name: string[];
  version: string;
}

export async function fetchMostUsedPackages(): Promise<BrewPackage[]> {
  try {
    // Fetch analytics and cask details in parallel
    const [analytics365Response, analytics90Response, caskDetailsResponse] = await Promise.all([
      axios.get(HOMEBREW_CASK_365D_API_URL),
      axios.get(HOMEBREW_CASK_90D_API_URL),
      axios.get(HOMEBREW_CASK_DETAILS_API_URL)
    ]);

    const analytics365Data = analytics365Response.data.items as AnalyticsItem[];
    const analytics90Data = analytics90Response.data.items as AnalyticsItem[];
    const caskDetails = caskDetailsResponse.data as CaskDetails[];
    
    // Create maps for faster lookup
    const caskDetailsMap = new Map(caskDetails.map((cask) => [cask.token, cask]));
    const analytics90Map = new Map(analytics90Data.map((item) => [item.cask, item.count]));

    // Sort by install count and take top 100 casks
    const topPackages = analytics365Data
      .sort((a, b) => parseInt(b.count.replace(/,/g, '')) - parseInt(a.count.replace(/,/g, '')))
      .slice(0, 100)
      .filter((item) => {
        const details = caskDetailsMap.get(item.cask);
        return details && details.token === item.cask && details.desc && details.homepage;
      })
      .map((item) => {
        const details = caskDetailsMap.get(item.cask);
        const category = guessCategory(details?.desc || '');
        const homepage = details?.homepage || '';
        
        // Calculate growth percentage
        const count365d = parseInt(item.count.replace(/,/g, ''));
        const count90d = parseInt((analytics90Map.get(item.cask) || "0").replace(/,/g, ''));
        
        // Convert counts to daily rates for fair comparison
        const dailyRate365 = count365d / 365;
        const dailyRate90 = count90d / 90;
        
        // Calculate growth percentage
        const growthPercentage = dailyRate90 > 0 && dailyRate365 > 0
          ? ((dailyRate90 - dailyRate365) / dailyRate365) * 100
          : 0;
        
        return {
          id: item.cask,
          name: details?.name[0] || item.cask,
          description: details?.desc || '',
          category,
          popular: true,
          installCount: parseInt(item.count.replace(/,/g, '')),
          growthPercentage: Math.round(growthPercentage * 10) / 10, // Round to 1 decimal
          iconUrl: `https://www.google.com/s2/favicons?domain=${homepage}&sz=128`
        };
      });

    return topPackages;
  } catch (error) {
    console.error('Error fetching Homebrew data:', error);
    return staticBrewPackages;
  }
}

// Add a cache to avoid refetching data too frequently
let cachedPackages: BrewPackage[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function getPackages(): Promise<BrewPackage[]> {
  // Use cache if available and not expired
  const now = Date.now();
  if (cachedPackages && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedPackages;
  }

  try {
    const packages = await fetchMostUsedPackages();
    cachedPackages = packages;
    lastFetchTime = now;
    return packages;
  } catch (error) {
    console.error('Error fetching packages:', error);
    return staticBrewPackages;
  }
}

function guessCategory(description: string): BrewPackage['category'] {
  const lowerDesc = description.toLowerCase();
  
  // Check communication apps first
  if (lowerDesc.includes('video conference') ||
      lowerDesc.includes('meeting') ||
      lowerDesc.includes('video call') ||
      lowerDesc.includes('conferencing') ||
      lowerDesc.includes('virtual meeting') ||
      lowerDesc.includes('browser') ||
      lowerDesc.includes('chat') ||
      lowerDesc.includes('email') ||
      lowerDesc.includes('messaging')) {
    return 'Communication';
  }
  
  // Development categories
  if (lowerDesc.includes('ide') || 
      lowerDesc.includes('editor') ||
      lowerDesc.includes('code')) {
    return 'IDE & Editors';
  }
  
  if (lowerDesc.includes('terminal') ||
      lowerDesc.includes('cli') ||
      lowerDesc.includes('shell') ||
      lowerDesc.includes('command line')) {
    return 'Terminal & CLI';
  }
  
  if (lowerDesc.includes('develop') || 
      lowerDesc.includes('programming') ||
      lowerDesc.includes('compiler') ||
      lowerDesc.includes('debug') ||
      lowerDesc.includes('git')) {
    return 'Dev Tools';
  }
  
  if (lowerDesc.includes('browser') ||
      lowerDesc.includes('chat') ||
      lowerDesc.includes('email') ||
      lowerDesc.includes('messaging')) {
    return 'Communication';
  }
  
  // ...rest of the categories remain the same...
  if (lowerDesc.includes('music') ||
      lowerDesc.includes('video') ||
      lowerDesc.includes('player') ||
      lowerDesc.includes('stream')) {
    return 'Media';
  }
  
  if (lowerDesc.includes('window') ||
      lowerDesc.includes('productivity') ||
      lowerDesc.includes('workflow') ||
      lowerDesc.includes('task')) {
    return 'Productivity';
  }
  
  return 'Utilities';
}

// Update static list to include only casks as fallback
export const staticBrewPackages: BrewPackage[] = [
  {
    id: 'visual-studio-code',
    name: 'Visual Studio Code',
    description: 'Code editing. Redefined.',
    category: 'IDE & Editors',
    popular: true,
    iconUrl: 'https://www.google.com/s2/favicons?domain=https://code.visualstudio.com&sz=128'
  },
  {
    id: 'iterm2',
    name: 'iterm2',
    description: 'Terminal emulator for macOS',
    category: 'Terminal & CLI',
    popular: true,
  },
  {
    id: 'rectangle',
    name: 'rectangle',
    description: 'Move and resize windows using keyboard shortcuts',
    category: 'Productivity',
    popular: true,
  },
  {
    id: 'firefox',
    name: 'firefox',
    description: 'Web browser from Mozilla',
    category: 'Communication',
    popular: true,
  },
  {
    id: 'spotify',
    name: 'spotify',
    description: 'Music streaming service',
    category: 'Media',
    popular: true,
  }
];