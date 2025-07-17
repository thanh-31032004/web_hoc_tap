import axios from "axios";
import Bottleneck from "bottleneck";
import Course from "./models/course";

class GroqAIService {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY;
        this.endpoint = "https://api.groq.com/openai/v1/chat/completions";
        this.model = "llama3-70b-8192";

        if (!this.apiKey) {
            throw new Error("GROQ_API_KEY is missing in env");
        }

        this.limiter = new Bottleneck({
            reservoir: 100,
            reservoirRefreshAmount: 100,
            reservoirRefreshInterval: 60 * 1000,
            minTime: 100,
        });
    }

    async generateLearningPath(userData) {
        if (!userData.level || !userData.goal) {
            throw new Error("Thiếu thông tin trình độ hoặc mục tiêu");
        }

        // Lấy danh sách Course từ Mongo
        const courses = await Course.find();

        let courseListMarkdown = courses
            .map(
                (c) =>
                    `- ${c.title} (ID: ${c._id}) - Category: ${c.category} - Difficulty: ${c.difficulty}`
            )
            .join("\n");

        const prompt = `
Bạn là chuyên gia giáo dục AI. Đây là danh sách các khóa học trong hệ thống:

${courseListMarkdown}

Thông tin người dùng:
- Trình độ: ${userData.level}
- Mục tiêu: ${userData.goal}
- Kỹ năng hiện có: ${userData.existingSkills?.join(", ") || "Không có"}
- Chủ đề quan tâm: ${userData.interests?.join(", ") || "Không có"}
- Thời gian học mỗi ngày: ${userData.freeHours} giờ

**Yêu cầu:**
- Gợi ý lộ trình học tập chia theo từng tuần.
- Phải là Tiếng Việt.
- Nếu thấy phù hợp, hãy chèn link nội bộ đến khóa học theo cú pháp:
[Tiêu đề](/courses/<id>)
- Định dạng kết quả ở Markdown.
- Ngắn gọn, dễ hiểu.
`;

        return this.limiter.schedule(() => this.sendToGroq(prompt));
    }

    async sendToGroq(prompt) {
        const response = await axios.post(
            this.endpoint,
            {
                model: this.model,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1500,
                stream: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                timeout: 30000,
            }
        );

        return response.data.choices[0].message.content;
    }
}


export default GroqAIService;
