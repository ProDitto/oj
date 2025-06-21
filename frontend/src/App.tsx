import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import ProblemListPage from "./pages/ProblemListPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import ContestListPage from "./pages/ContestListPage";
import ContestDetailPage from "./pages/ContestDetailPage";
import ContestProblemPage from "./pages/ContestProblemPage";
import AdminProblemPage from "./pages/AdminProblemPage";
import ProblemForm from "./components/admin/ProblemForm";
import Navbar from "./components/Navbar";
import UserProfile from "./pages/UserProfile";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/problems" />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/problems" element={<ProblemListPage />} />
          <Route path="/problem/:slug" element={<ProblemDetailPage />} />
          <Route path="/contests" element={<ContestListPage />} />
          <Route path="/contest/:contestId/problem/:slug" element={<ContestProblemPage />} />
          <Route path="/contest/:contestId" element={<ContestDetailPage />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path="/admin/problems" element={<AdminProblemPage />} />
          <Route path="/admin/problems/new" element={<ProblemForm />} />
          <Route path="/admin/problems/edit/:slug" element={<ProblemForm />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App