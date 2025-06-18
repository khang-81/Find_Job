import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav>
            <Link to="/" className="nav-brand">Hanoi Student Gigs</Link>
            <div>
                <Link to="/jobs">Tìm Việc</Link>
                {isAuthenticated ? (
                    <>
                        {user.role === 'Employer' && <Link to="/employer/dashboard">Dashboard</Link>}
                        {user.role === 'Student' && <Link to="/student/profile">Hồ Sơ</Link>}
                        {user.role === 'Admin' && <Link to="/admin/dashboard">Admin</Link>}
                        <span style={{ margin: '0 1rem' }}>Chào, {user.email}!</span>
                        <button onClick={handleLogout}>Đăng xuất</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Đăng nhập</Link>
                        <Link to="/register">Đăng ký</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
