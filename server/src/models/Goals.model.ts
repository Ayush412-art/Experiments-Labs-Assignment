import mongoose, { Schema, Document } from "mongoose";

export interface IRoadmapItem {
  week?: number;
  title: string;
  description?: string;
  completed?: boolean;
}

export interface IGoal extends Document {
  title: string;         
  complexity: string;    
  progress: number;      
  roadmap: IRoadmapItem[];
  user?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const RoadmapItemSchema = new Schema<IRoadmapItem>({
  week: { type: Number },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
});

const GoalSchema = new Schema<IGoal>(
  {
    title: { type: String, required: true },
    complexity: { type: String, required: true },
    progress: { type: Number, default: 0 },
    roadmap: { type: [RoadmapItemSchema], default: [] },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IGoal>("Goal", GoalSchema);




