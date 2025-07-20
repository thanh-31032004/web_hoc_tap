// client/src/App.j
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// Import Layout component
import Layout from './layout/Layout'; // Đảm bảo đường dẫn đúng

// Import các Pages của bạn
import HomePage from './pages/HomePage';

import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import AiRoadmapPage from './pages/AiRoadmapPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProrectedRoute';
import AdminLayout from './layout/AdminLayout';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminCourseListPage from './pages/admin/courses/ListCourse';
import AdminCourseCreatePage from './pages/admin/courses/AddCourse';
import AdminCourseEditPage from './pages/admin/courses/EditCourse';
import AdminLessonListPage from './pages/admin/lesson/lessonList';
import AdminLessonAddPage from './pages/admin/lesson/lessonAdd';
import AdminLessonEditPage from './pages/admin/lesson/lessonEdit';
import CourseDeltailPage from './pages/CourseDetailPage';
import UserListPage from './pages/admin/users/UserList';
import ForbiddenPage from './pages/ForbiddenPage';
import EditProfilePage from './pages/SettingProfile';

// Import ProtectedRoute (nếu bạn đã có)


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/courses/:id" element={<CourseDetailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings/profile" element={<EditProfilePage />} />

            <Route path="/ai-roadmap" element={<AiRoadmapPage />} />
          </Route>
        </Route>
        {/* Các route dành cho Admin */}
        <Route path="/admin" element={<ProtectedRoute authorize={["admin"]}><AdminLayout /></ProtectedRoute>}>
          <Route path='' element={<AdminDashboardPage />} />
          <Route path="courses" element={<AdminCourseListPage />} />
          <Route path="courses/:id" element={<CourseDeltailPage />} />
          <Route path="courses/create" element={<AdminCourseCreatePage />} />
          <Route path="courses/edit/:id" element={<AdminCourseEditPage />} />
          <Route path="lessons" element={<AdminLessonListPage />} />
          <Route path="lessons/create" element={<AdminLessonAddPage />} />
          <Route path="lessons/edit/:id" element={<AdminLessonEditPage />} />
          <Route path="users" element={<UserListPage />} />

        </Route>
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;