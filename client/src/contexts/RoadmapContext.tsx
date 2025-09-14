import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Roadmap, RoadmapContextType } from '../types/roadmap';

// Create the context
const RoadmapContext = createContext<RoadmapContextType | null>(null);

// Provider component props
interface RoadmapProviderProps {
  children: ReactNode;
}

// Provider component
const RoadmapProvider: React.FC<RoadmapProviderProps> = ({ children }) => {
  // State management
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  const loadRoadmaps = useCallback(() => {
    try {
      setIsLoading(true);
      const savedRoadmaps = localStorage.getItem('roadmaps');
      
      if (savedRoadmaps) {
        const parsedRoadmaps = JSON.parse(savedRoadmaps);
        setRoadmaps(parsedRoadmaps);
      }
    } catch (err) {
      setError('Failed to load roadmaps from storage');
      console.error('Error loading roadmaps:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveRoadmaps = useCallback(() => {
    try {
      localStorage.setItem('roadmaps', JSON.stringify(roadmaps));
    } catch (err) {
      setError('Failed to save roadmaps to storage');
      console.error('Error saving roadmaps:', err);
    }
  }, [roadmaps]);

  useEffect(() => {
    loadRoadmaps();
  }, [loadRoadmaps]);

  useEffect(() => {
    
      saveRoadmaps();
    
  }, [roadmaps, saveRoadmaps]);

  // const addRoadmap = (roadmap: Roadmap) => {
  //   try {
  //     const newRoadmap: Roadmap = {
  //       ...roadmap,
  //       _id: roadmap._id || `roadmap_${Date.now()}`,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       progress: calculateProgress(roadmap)
  //     };
      
  //     setRoadmaps(prev => [...prev, newRoadmap]);
  //     setError(null);
  //   } catch (err) {
  //     setError('Failed to add roadmap');
  //     console.error('Error adding roadmap:', err);
  //   }
  // };

  // const updateRoadmap = (id: string, updates: Partial<Roadmap>) => {
  //   try {
  //     setRoadmaps(prev => 
  //       prev.map(roadmap => 
  //         roadmap._id === id 
  //           ? { 
  //               ...roadmap, 
  //               ...updates, 
  //               updatedAt: new Date(),
  //               progress: updates.roadmap ? calculateProgress({ ...roadmap, ...updates }) : roadmap.progress
  //             }
  //           : roadmap
  //       )
  //     );
      
  //     // Update current roadmap if it's the one being updated
  //     if (currentRoadmap?._id === id) {
  //       setCurrentRoadmap(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
  //     }
      
  //     setError(null);
  //   } catch (err) {
  //     setError('Failed to update roadmap');
  //     console.error('Error updating roadmap:', err);
  //   }
  // };

  // Delete a roadmap
  const deleteRoadmap = (id: string) => {
    try {
      setRoadmaps(prev => prev.filter(roadmap => roadmap._id !== id));
      
      // Clear current roadmap if it's the one being deleted
      if (currentRoadmap?._id === id) {
        setCurrentRoadmap(null);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to delete roadmap');
      console.error('Error deleting roadmap:', err);
    }
  };

  // Update week completion status
  const updateWeekProgress = (roadmapId: string, weekId: string, completed: boolean) => {
    try {
      setRoadmaps(prev => 
        prev.map(roadmap => {
          if (roadmap._id === roadmapId) {
            const updatedRoadmap = {
              ...roadmap,
              roadmap: roadmap.roadmap.map(week => 
                week._id === weekId ? { ...week, completed } : week
              ),
              updatedAt: new Date()
            };
            
            // Recalculate progress
            updatedRoadmap.progress = calculateProgress(updatedRoadmap);
            
            return updatedRoadmap;
          }
          return roadmap;
        })
      );

      // Update current roadmap if it's the one being updated
      if (currentRoadmap?._id === roadmapId) {
        const updatedCurrentRoadmap = {
          ...currentRoadmap,
          roadmap: currentRoadmap.roadmap.map(week => 
            week._id === weekId ? { ...week, completed } : week
          ),
          updatedAt: new Date()
        };
        updatedCurrentRoadmap.progress = calculateProgress(updatedCurrentRoadmap);
        setCurrentRoadmap(updatedCurrentRoadmap);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to update week progress');
      console.error('Error updating week progress:', err);
    }
  };

  // Calculate progress percentage
  const calculateProgress = (roadmap: Roadmap): number => {
    if (!roadmap.roadmap || roadmap.roadmap.length === 0) {
      return 0;
    }
    
    const completedWeeks = roadmap.roadmap.filter(week => week.completed).length;
    return Math.round((completedWeeks / roadmap.roadmap.length) * 100);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const contextValue: RoadmapContextType = {
    // State
    roadmaps,
    currentRoadmap,
    isLoading,
    error,

    // Actions
    // addRoadmap,
    // updateRoadmap,
    deleteRoadmap,
    setCurrentRoadmap,
    updateWeekProgress,
    calculateProgress,
    clearError,
    loadRoadmaps,
    saveRoadmaps,
  };

  return (
    <RoadmapContext.Provider value={contextValue}>
      {children}
    </RoadmapContext.Provider>
  );
};

export { RoadmapProvider };
export default RoadmapContext;
