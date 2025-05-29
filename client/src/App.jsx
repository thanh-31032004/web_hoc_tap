// client/src/App.j
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// Import Layout component
import Layout from './layout/Layout'; // Đảm bảo đường dẫn đúng

// Import các Pages của bạn
import HomePage from './pages/HomePage';


import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import AiRoadmapPage from './pages/AiRoadmapPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
// import NotFoundPage from './pages/NotFoundPage';

// Import ProtectedRoute (nếu bạn đã có)


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />

          {/* Protected Routes - Chỉ người dùng đã đăng nhập mới truy cập được */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ai-roadmap" element={<AiRoadmapPage />} />

          {/* Các route quản trị (ví dụ, nếu có) */}
          {/* <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} /> */}

          {/* Catch-all route cho các URL không khớp */}
          {/* <Route path="**" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;