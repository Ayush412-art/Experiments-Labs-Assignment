import { Router } from "express";
import {
  generateGoalRoadmap,
  getAllGoals,
  getGoalById,
  updateGoalProgress,
  deleteGoal
} from "../controllers/Goals.controllers";


const router = Router();


router.post("/generate", generateGoalRoadmap);

router.get("/",  getAllGoals);

router.get("/:id",  getGoalById);

router.put("/:id",  updateGoalProgress);

router.delete("/:id",  deleteGoal);

export default router;
