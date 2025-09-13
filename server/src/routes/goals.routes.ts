import { Router } from "express";
import {
  generateGoalRoadmap,
  getAllGoals,
  getGoalById,
  updateGoalProgress,
  deleteGoal
} from "../controllers/Goals.controllers";


const router = Router();

// POST /api/goals/generate - Generate a new learning roadmap using Gemini AI
// Protected route - requires authentication
router.post("/generate", generateGoalRoadmap);

// GET /api/goals - Get all goals
// Optional authentication - shows user-specific goals if authenticated
router.get("/",  getAllGoals);

// GET /api/goals/:id - Get a specific goal by ID
// Optional authentication
router.get("/:id",  getGoalById);

// PUT /api/goals/:id - Update goal progress or roadmap
// Protected route - requires authentication and user validation
router.put("/:id",  updateGoalProgress);

// DELETE /api/goals/:id - Delete a goal
// Protected route - requires authentication and user validation
router.delete("/:id",  deleteGoal);

export default router;
