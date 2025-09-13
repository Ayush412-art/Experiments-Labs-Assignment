
export interface RoadmapWeek {
  week: number;
  title: string;
  description: string;
  completed: boolean;
  _id: string;
}

export interface Roadmap {
  title: string;
  complexity: string;
  progress: number;
  roadmap: RoadmapWeek[];
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoadmapContextType {
  // State
  roadmaps: Roadmap[];
  currentRoadmap: Roadmap | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  // addRoadmap: (roadmap: Roadmap) => void;
  // updateRoadmap: (id: string, updates: Partial<Roadmap>) => void;
  deleteRoadmap: (id: string) => void;
  setCurrentRoadmap: (roadmap: Roadmap | null) => void;
  updateWeekProgress: (roadmapId: string, weekId: string, completed: boolean) => void;
  calculateProgress: (roadmap: Roadmap) => number;
  clearError: () => void;
  loadRoadmaps: () => void;
  saveRoadmaps: () => void;
}
