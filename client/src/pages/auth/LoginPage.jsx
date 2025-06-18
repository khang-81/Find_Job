import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch {
            setError('Email hoặc mật khẩu không chính xác.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Đăng nhập</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Đăng nhập</button>
            <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
        </form>
    );
};

export default LoginPage;
