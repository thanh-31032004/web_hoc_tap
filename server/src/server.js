import express from "express";
import cors from "cors";
import connectMongoDB from "./config/dbconfig.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import axios from "axios";
import Bottleneck from "bottleneck";

dotenv.config();

const app = express();

// Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Kết nối MongoDB
const dbUrl = process.env.DB_URI || "mongodb://127.0.0.1:27017/db_webhoctap";
connectMongoDB(dbUrl);

// Groq AI Service
class GroqAIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.endpoint = "https://api.groq.com/openai/v1/chat/completions";

    if (!this.apiKey) {
      console.error('GROQ_API_KEY is missing in environment variables');
      throw new Error('AI service initialization failed');
    }

    // Model tốt nhất của Groq (có thể thay đổi tuỳ nhu cầu)
    this.model = "llama3-70b-8192";

    // Tạo bộ điều tiết request
    this.limiter = new Bottleneck({
      reservoir: 100, // 100 requests
      reservoirRefreshAmount: 100,
      reservoirRefreshInterval: 60 * 1000, // Làm mới mỗi phút
      minTime: 100 // 10 requests/giây (1000ms/10)
    });

    console.log(`Groq AI Service initialized with model: ${this.model}`);
  }

  createLearningPrompt(userData) {
    return `Bạn là chuyên gia giáo dục AI người Việt. Hãy tạo lộ trình học tập 4 tuần bằng tiếng Việt cho:
  - Trình độ: ${userData.level}
  - Mục tiêu: ${userData.goal}
  - Thời gian rảnh/ngày: ${userData.freeHours} giờ
  - Kỹ năng hiện có: ${userData.existingSkills?.join(', ') || 'Không có'}
  - Chủ đề quan tâm: ${userData.interests?.join(', ') || 'Không có'}
  
  Yêu cầu:
  1. Sử dụng tiếng Việt rõ ràng, tự nhiên
  2. Phân chia thành các chủ đề hàng tuần
  3. Đề xuất tài nguyên học tập tiếng Việt (nếu có)
  4. Dự án thực hành nhỏ mỗi tuần
  5. Định dạng Markdown
  6. Ưu tiên giải thích dễ hiểu, phù hợp trình độ người học
  7. Ngắn gọn`;
  }

  async sendToGroq(prompt) {
    try {
      const response = await axios.post(
        this.endpoint,
        {
          model: this.model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1500,
          stream: false
        },
        {
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json"
          },
          timeout: 30000 // 30 giây timeout
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API Error:', error.response?.data || error.message);

      // Xử lý lỗi rate limiting của Groq
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 10;
        throw new Error(`Quá nhiều yêu cầu. Vui lòng thử lại sau ${retryAfter} giây`);
      }

      throw new Error('Lỗi dịch vụ AI: ' + error.message);
    }
  }

  async generateLearningPath(userData) {
    if (!userData.level || !userData.goal) {
      throw new Error('Thiếu thông tin trình độ hoặc mục tiêu');
    }

    const prompt = this.createLearningPrompt(userData);

    // Sử dụng bộ điều tiết để quản lý request
    return this.limiter.schedule(() => this.sendToGroq(prompt));
  }
}

// Khởi tạo Groq AI service
const aiService = new GroqAIService();

// ĐỊNH NGHĨA ENDPOINT AI
app.post('/api/ai/learning-path', async (req, res) => {
  try {
    if (!req.body.level || !req.body.goal) {
      return res.status(400).json({ error: 'Vui lòng cung cấp trình độ và mục tiêu học tập' });
    }

    const learningPath = await aiService.generateLearningPath(req.body);

    res.json({
      success: true,
      path: learningPath
    });

  } catch (error) {
    console.error('AI Endpoint Error:', error);

    // Xử lý lỗi rate limiting
    if (error.message.includes('Quá nhiều yêu cầu')) {
      return res.status(429).json({
        error: error.message,
        solution: "Vui lòng đợi và thử lại sau"
      });
    }

    res.status(500).json({
      error: error.message || 'Lỗi máy chủ'
    });
  }
});

// SỬ DỤNG MAIN ROUTER
app.use("/", router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    aiService: aiService.apiKey ? 'active' : 'inactive',
    provider: 'Groq',
    model: aiService.model
  });
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Middleware xử lý lỗi tập trung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Khởi chạy server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(`AI Service: ${aiService.apiKey ? 'Đã kích hoạt' : 'Chưa kích hoạt'}`);
  console.log(`Provider: Groq (${aiService.model})`);
});

export const viteNodeApp = app;
export { server };