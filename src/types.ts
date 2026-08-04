export type ExplorePhase = 'HOME' | 'TUNNEL' | 'OUTDOOR' | 'DESCENT' | 'ROAMING' | 'MURAL_HALL' | 'RESTORATION';

export interface MuralHotspot {
  id: string;
  title: string;
  titleZh: string;
  wall: 'east' | 'west' | 'north';
  x: number; // percentage coordinate
  y: number; // percentage coordinate
  description: string;
  descriptionEn?: string;
  historicalContext: string;
  historicalContextEn?: string;
  details: string[];
  detailsEn?: string[];
  image: string;
}

export interface ArtifactHotspot {
  id: string;
  title: string;
  titleZh: string;
  x: number; // percentage coordinate
  y: number; // percentage coordinate
  location: string;
  locationEn?: string;
  description: string;
  descriptionEn?: string;
  excavationInfo: string;
  excavationInfoEn?: string;
  craftsmanship: string;
  craftsmanshipEn?: string;
  motifs: string[];
  motifsEn?: string[];
  icon: string;
  image?: string;
  images?: string[];
}

export interface RestorationStep {
  stepIndex: number;
  name: string;
  nameZh: string;
  tool: 'brush' | 'glue' | 'paint' | 'pen' | 'varnish';
  instruction: string;
  instructionEn?: string;
  completedText: string;
  completedTextEn?: string;
}
