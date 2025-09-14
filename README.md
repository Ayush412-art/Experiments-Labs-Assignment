# Experiments Labs Assignment 🚀

This project contains both the **Frontend (client)** and **Backend (server)** of the Goal Management System.

---

## 📂 Project Structure

```
.
├── client   # Frontend (React + Vite)
└── server   # Backend (Node.js + Express + TypeScript + MongoDB)
```

---

## ⚡ Frontend Setup (client)

1. Navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `client/` and add:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_LOCALHOST_URL=http://localhost:8090
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at **http://localhost:5173**

---

## ⚡ Backend Setup (server)

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `server/` and add:
   ```env
   MONGO_URL=your_mongo_connection_url
   DB_NAME=your_database_name
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the backend server with:
   ```bash
   npm run dev
   ```

The backend will be running at **http://localhost:8090**

---

## 🔑 API Endpoints

### 🎯 Goals API

| Method | Endpoint                | Description                |
|--------|-------------------------|----------------------------|
| POST   | `/api/goals/generate`   | Generate a goal roadmap    |
| GET    | `/api/goals/`           | Get all goals              |
| GET    | `/api/goals/:id`        | Get a goal by ID           |
| PUT    | `/api/goals/:id`        | Update goal progress       |
| DELETE | `/api/goals/:id`        | Delete a goal              |

---

### 👤 User API

| Method | Endpoint          | Description      |
|--------|-------------------|------------------|
| POST   | `/api/user/login` | User login       |
| POST   | `/api/user/signup`| User signup      |

---

## 🌍 Deployment

- **Frontend**: Deploy on [Vercel](https://vercel.com/)  
- **Backend**: Deploy on [Render](https://render.com/)  

Make sure to update the frontend `.env` with your deployed backend URL.

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Firebase  
- **Backend**: Node.js + Express + TypeScript + MongoDB  
- **Auth**: JWT + Bcrypt  
- **AI**: Google Generative AI (Gemini API)  
- **Realtime**: Socket.IO  

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/Ayush412-art/Experiments-Labs-Assignment.git
cd Experiments-Labs-Assignment
```

Follow setup instructions for both frontend and backend.

---

## 📜 License

This project is licensed under the MIT License.
