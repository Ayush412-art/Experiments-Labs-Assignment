
import axios from "axios";

interface GoalPayload {
  goal: string;
  complexity: string;
}

export const fetchGoals = async (payload: GoalPayload) => {
  try {
    const res = await axios.post("http://localhost:8090/api/goals/generate", payload);
    return res.data; 
  } catch (err) {
    console.error("Error fetching goals:", err);
    throw err;
  }
};
