export type CelestialBody = 'moon' | 'mars';

export type SuitColor = 'classic' | 'rose' | 'cyan' | 'gold' | 'mint' | 'violet';

export type RelicId =
  | 'apollo-11'
  | 'apollo-15'
  | 'apollo-17'
  | 'mars-pathfinder'
  | 'spirit-opportunity'
  | 'curiosity'
  | 'perseverance-ingenuity';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  funFact: string;
}

export interface SpaceRelic {
  id: RelicId;
  name: string;
  year: number;
  body: CelestialBody;
  coordinates: { x: number; y: number };
  landingSite: string;
  earthLaunchDate: string;
  cutesyNickname: string;
  shortDescription: string;
  detailedLore: string;
  primaryDiscovery: string;
  greeting: string;
  speechDialogue: string[];
  iconType: 'lunar_module' | 'moon_rover' | 'apollo_flag' | 'pathfinder' | 'spirit' | 'curiosity' | 'perseverance';
  quizQuestions: QuizQuestion[];
}

export interface StarBit {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  body: CelestialBody;
}
