import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/routing/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import JobDetailPage from './pages/JobDetailPage';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJobPage from './pages/employer/PostJobPage';
import EditJobPage from './pages/employer/EditJobPage';
import ApplicantsPage from './pages/employer/ApplicantsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/jobs" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/jobs/:id" element={<JobDetailPage />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        
                        <Route path="/employer/dashboard" element={<ProtectedRoute allowedRoles={['Employer']}><EmployerDashboard /></ProtectedRoute>} />
                        <Route path="/employer/post-job" element={<ProtectedRoute allowedRoles={['Employer']}><PostJobPage /></ProtectedRoute>} />
                        <Route path="/employer/jobs/edit/:jobId" element={<ProtectedRoute allowedRoles={['Employer']}><EditJobPage /></ProtectedRoute>} />
                        <Route path="/employer/jobs/:jobId/applicants" element={<ProtectedRoute allowedRoles={['Employer']}><ApplicantsPage /></ProtectedRoute>} />
                        
                        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['Student']}><StudentProfilePage /></ProtectedRoute>} />

                        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
                        
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    );
}

export default App;
