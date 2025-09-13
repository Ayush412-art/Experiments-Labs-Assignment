import { MenuItem, TextField, Button } from "@mui/material";
import { useState } from "react";
import FloatingSymbols from "../components/MovingIcons";
import { fetchGoals } from "../Services/goals";
import GoalCard from "../components/GoalCard";

function Goalspage() {
  const [goal, setGoal] = useState("");
  const [complexity, setComplexity] = useState("");
  const [generatedGoals, setGeneratedGoals] = useState<any[]>([]); // ✅ store multiple goals

  const handlerGoals = async () => {
    const data = await fetchGoals({ goal, complexity });
    console.log(data);
    setGeneratedGoals((prevGoals) => [...prevGoals, data]);
  };

  return (
    <>
      <FloatingSymbols />
      <section className="max-w-6xl mx-auto p-6">
        <div className="flex space-x-2">
          <TextField
            id="goal"
            value={goal}
            fullWidth
            variant="outlined"
            label="What do you want to learn?"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGoal(e.target.value)
            }
          />
          <TextField
            select
            value={complexity}
            id="complexity"
            variant="outlined"
            label="Duration"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setComplexity(e.target.value)
            }
          >
            <MenuItem value="3 weeks">low</MenuItem>
            <MenuItem value="3 months">medium</MenuItem>
            <MenuItem value="6 months">high</MenuItem>
            <MenuItem value="Random timeline">default</MenuItem>
          </TextField>
          <Button onClick={handlerGoals} variant="text" sx={{ px: 4 }}>
            Generate
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {generatedGoals.map((goalData, index) => (
            <GoalCard
              key={index}
              title={goalData.data.title}
              complexity={goalData.data.complexity}
              progress={goalData.data.progress}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Goalspage;
