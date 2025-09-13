import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Goal, { IGoal } from "../models/Goals.model";
import dotenv from "dotenv";
dotenv.config()
// Check if API key is available
// if (!process.env.GEMINI_API_KEY) {
//   console.log("Gemini API key is missing.");
// }
const GEMINI_API_KEY = "AIzaSyCK6iEIOWx_HIKDgcJl8YUFER16I4ZXf6k"
const genAi = new GoogleGenerativeAI(GEMINI_API_KEY!);

// Generate learning roadmap using Gemini AI
export const generateGoalRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { goal, complexity } = req.body;

    // Validate required fields
    if (!goal || !complexity) {
      res.status(400).json({ 
        success: false,
        message: "Goal and complexity are required" 
      });
      return;
    }

    // Check if API key is available
    if (!GEMINI_API_KEY) {
      res.status(500).json({ 
        success: false,
        message: "Gemini API key is not configured" 
      });
      return;
    }

    // Create a detailed prompt for Gemini
    const prompt = `Generate a comprehensive learning roadmap for the goal: "${goal}".

The roadmap should be designed for
${complexity ? `The duration should be approximately ${complexity}.` : 'Determine an appropriate duration based on the complexity.'}

Please respond ONLY with valid JSON in this exact structure:
{
  "title": "Learning Roadmap for [suitable goal title]",
  "duration": "${complexity}",
  "roadmap": [
    {
      "week": 1,
      "title": "Week 1: [Topic Name]",
      "description": "Brief description of what will be covered this week",
      "completed": false
    },
    {
      "week": 2,
      "title": "Week 2: [Topic Name]", 
      "description": "Brief description of what will be covered this week",
      "completed": false
    }
  ]
}

Make sure to:
- Create a realistic timeline based on the complexity level
- Break down the goal into weekly milestones
- Provide clear, actionable descriptions for each week
- Ensure the roadmap progresses logically from basics to advanced topics
- Return ONLY the JSON, no additional text or markdown formatting`;

    const geminiModel = genAi.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await geminiModel.generateContent(prompt);
    const response = result.response.text().replace(/```json|```/g, "").trim();

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      res.status(500).json({ 
        success: false,
        message: "Failed to parse AI response" 
      });
      return;
    }

    // Validate the parsed response structure
    if (!parsed.title || !parsed.roadmap || !Array.isArray(parsed.roadmap)) {
      res.status(500).json({ 
        success: false,
        message: "Invalid roadmap structure received from AI" 
      });
      return;
    }

    // Create new goal document
    const newGoal = new Goal({
      title: parsed.title,
      complexity: parsed.complexity || complexity,
      progress: 0,
      roadmap: parsed.roadmap.map((item: any) => ({
        week: item.week,
        title: item.title,
        description: item.description,
        completed: false
      })),
      user: req.body.userId || null 
    });

    await newGoal.save();

    res.status(201).json({
      success: true,
      message: "Learning roadmap generated successfully",
      data: newGoal
    });

  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to generate learning roadmap",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};


export const getAllGoals = async (req: Request, res: Response): Promise<void> => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: goals
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch goals"
    });
  }
};

// Get single goal by ID
export const getGoalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);

    if (!goal) {
      res.status(404).json({
        success: false,
        message: "Goal not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch goal"
    });
  }
};

// Update goal progress
export const updateGoalProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { progress, roadmap } = req.body;

    const updateData: any = {};
    
    if (progress !== undefined) {
      updateData.progress = Math.max(0, Math.min(100, progress));
    }

    if (roadmap && Array.isArray(roadmap)) {
      updateData.roadmap = roadmap;
    }

    const goal = await Goal.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!goal) {
      res.status(404).json({
        success: false,
        message: "Goal not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      data: goal
    });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update goal"
    });
  }
};

// Delete goal
export const deleteGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const goal = await Goal.findByIdAndDelete(id);

    if (!goal) {
      res.status(404).json({
        success: false,
        message: "Goal not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete goal"
    });
  }
};
