import express, { Application } from 'express';
import { createServer } from 'http';
import connection from './db/db';
import dotenv from "dotenv";
import goalsRoutes from './routes/goals.routes';
import userRoutes from "./routes/users.route";
import cors from 'cors';
import AITutorSocketService from './services/AITutorSocketService';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);

app.use(cors());

// Default middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connection();

// Routes
app.use('/api/goals', goalsRoutes);
app.use('/api/user', userRoutes);

// Initialize Socket.IO service
const aiTutorSocketService = new AITutorSocketService(httpServer);


app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    connectedSessions: aiTutorSocketService.getConnectedSessionsCount(),
    timestamp: new Date().toISOString()
  });
});

const PORT =  8090;

httpServer.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
  console.log(`Socket.IO server is running`);
});