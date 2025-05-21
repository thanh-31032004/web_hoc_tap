import express, { Router } from "express";
import cors from "cors";
import connectMongoDB from "./config/dbconfig";
import router from "./routes/index.js"; // Import router từ file index.js trong thư mục routes
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const dbUrl = process.env.DB_URI || "mongodb://127.0.0.1:27017/db_webhoctap";

connectMongoDB(dbUrl);
// Sử dụng main API router
// app.use("/", router); // Tất cả các API của bạn sẽ có tiền tố /api
app.use("/", router);
// // Thêm một route gốc đơn giản cho server
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });

// // Xử lý lỗi 404 (Nếu không có route nào khớp)
// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Không tìm thấy API endpoint' });
// });

// // Middleware xử lý lỗi tập trung (có thể tạo file riêng cho nó)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Đã xảy ra lỗi server', error: err.message });
// });

export const viteNodeApp = app;
