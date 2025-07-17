import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectMongoDB from "./config/dbconfig.js";
import router from "./routes/index.js";
import GroqAIService from "./groqService.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect DB
const dbUrl = process.env.DB_URI || "mongodb://127.0.0.1:27017/db_webhoctap";
connectMongoDB(dbUrl);

// Khởi tạo Groq service
const aiService = new GroqAIService();

// Tạo endpoint AI
app.post('/api/ai/learning-path', async (req, res) => {
  try {
    if (!req.body.level || !req.body.goal) {
      return res.status(400).json({ error: 'Vui lòng nhập trình độ và mục tiêu' });
    }

    const learningPath = await aiService.generateLearningPath(req.body);

    res.json({
      success: true,
      path: learningPath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.use("/", router);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    aiService: aiService.apiKey ? 'active' : 'inactive',
    provider: 'Groq',
    model: aiService.model
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export const viteNodeApp = app;
export { server };
