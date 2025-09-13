import express, { Application } from 'express';
import connection from './db/db';
import dotenv from "dotenv";
import goalsRoutes from './routes/goals.routes';
import userRoutes from "./routes/users.route";
import cors from 'cors';

dotenv.config();

const app: Application = express();


// CORS configuration
app.use(cors());

// Default middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connection();

// Routes
app.use('/api/goals', goalsRoutes);
app.use('/api/user', userRoutes);



const PORT = process.env.PORT || 8090;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
 
});