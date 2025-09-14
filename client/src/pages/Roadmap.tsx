import { useState } from "react";
import { useLocation } from "react-router-dom";
// import AItutor from "../components/AiAvtar";
interface RoadmapWeek {
  week: number;
  title: string;
  description: string;
  completed: boolean;
  _id: string;
}

interface Goal {
  title: string;
  complexity: string;
  progress: number;
  roadmap: RoadmapWeek[];
  _id?: string;
}

function Roadmap() {
  const location = useLocation();
  const goalsData = location.state?.goals || {};
  const [expandedGoalId, setExpandedGoalId] = useState<string>("");

  // Keep goals in state so changes trigger re-renders
  const [goals, setGoals] = useState<Goal[]>(
    goalsData.title ? [goalsData] : []
  );

  // Calculate progress
  const calculateProgress = (goal: Goal): number => {
    if (!goal.roadmap || goal.roadmap.length === 0) {
      return 0;
    }
    const completedWeeks = goal.roadmap.filter((week) => week.completed).length;
    return Math.round((completedWeeks / goal.roadmap.length) * 100);
  };

  // Toggle expand/collapse
  const handleGoalToggle = (goalId: string) => {
    setExpandedGoalId(expandedGoalId === goalId ? "" : goalId);
  };

  // Toggle week completion
  const handleWeekToggle = (
    goalId: string,
    weekId: string,
    completed: boolean
  ) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal._id === goalId || (!goal._id && goalId === "goal-1")) {
          const updatedRoadmap = goal.roadmap.map((week) =>
            week._id === weekId ? { ...week, completed } : week
          );
          return {
            ...goal,
            roadmap: updatedRoadmap,
            progress: calculateProgress({ ...goal, roadmap: updatedRoadmap })
          };
        }
        return goal;
      })
    );
  };

  if (goals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Goals Available
          </h1>
          <p className="text-gray-600">
            Please create a goal first to view its roadmap here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Learning Roadmap
          </h1>
          <p className="text-gray-600">
            Track your learning progress and manage your educational journey
          </p>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal);
            const isExpanded =
              expandedGoalId === goal._id || expandedGoalId === "";

            return (
              <div
                key={goal._id || "goal-1"}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Goal Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleGoalToggle(goal._id || "goal-1")}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        {goal.title}
                      </h2>
                      <p className="text-gray-600 mb-3">
                        Complexity: {goal.complexity}
                      </p>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          Progress: {progress}%
                        </span>
                        <span className="text-sm text-gray-500">
                          {goal.roadmap.filter((w) => w.completed).length} /{" "}
                          {goal.roadmap.length} weeks completed
                        </span>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="ml-4">
                      <div
                        className={`transform transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-6 h-6 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Roadmap */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Weekly Roadmap
                      </h3>

                      {/* Overall Progress */}
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-medium text-gray-800">
                            Overall Progress
                          </span>
                          <span className="text-2xl font-bold text-blue-600">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Weeks */}
                    <div className="space-y-3">
                      {goal.roadmap.map((week) => (
                        <div
                          key={week._id}
                          className={`p-4 border rounded-lg transition-all ${
                            week.completed
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  checked={week.completed}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleWeekToggle(
                                      goal._id || "goal-1",
                                      week._id,
                                      e.target.checked
                                    );
                                  }}
                                  className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <h4
                                  className={`font-semibold ${
                                    week.completed
                                      ? "text-green-800"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {week.title}
                                </h4>
                              </div>
                              <p
                                className={`text-sm ml-8 ${
                                  week.completed
                                    ? "text-green-700"
                                    : "text-gray-600"
                                }`}
                              >
                                {week.description}
                              </p>
                            </div>
                            {week.completed && (
                              <div className="ml-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Completed
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

             {/* <AItutor currentGoal={goals[0]} /> */}

      </div>
    </div>
  );
}

export default Roadmap;
