import axios from 'axios';

export interface BrewPackage {
  id: string;
  name: string;
  description: string;
  category: 'IDE & Editors' | 'Terminal & CLI' | 'Dev Tools' | 'Productivity' | 'Utilities' | 'Media' | 'Communication';
  popular: boolean;
  installCount?: number;
  iconUrl?: string;
}

// const HOMEBREW_CASK_API_URL = 'https://formulae.brew.sh/api/analytics/cask-install/30d.json';
// const HOMEBREW_CASK_API_URL = 'https://formulae.brew.sh/api/analytics/cask-install/90d.json';
const HOMEBREW_CASK_API_URL = 'https://formulae.brew.sh/api/analytics/cask-install/365d.json';
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
    // Fetch both analytics and cask details in parallel
    const [analyticsResponse, caskDetailsResponse] = await Promise.all([
      axios.get(HOMEBREW_CASK_API_URL),
      axios.get(HOMEBREW_CASK_DETAILS_API_URL)
    ]);

    const analyticsData = analyticsResponse.data.items;
    const caskDetails = caskDetailsResponse.data as CaskDetails[];
    
    // Create a map of cask details for faster lookup
    const caskDetailsMap = new Map(
      caskDetails.map((cask) => [cask.token, cask])
    );

    // Sort by install count and take top 20 casks
    const topPackages = analyticsData
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 100)
      .map((item: any) => {
        const details = caskDetailsMap.get(item.cask);
        const category = guessCategory(details?.desc || '');
        const homepage = details?.homepage || '';
        
        return {
          id: item.cask,
          name: details?.name[0] || item.cask,
          description: details?.desc || '',
          category,
          popular: true,
          installCount: item.count,
          iconUrl: `https://www.google.com/s2/favicons?domain=${homepage}&sz=128`
        };
      });

    return topPackages;
  } catch (error) {
    console.error('Error fetching Homebrew data:', error);
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