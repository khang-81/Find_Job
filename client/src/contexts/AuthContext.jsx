import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                if (decodedUser.exp * 1000 > Date.now()) {
                    setUser({ id: decodedUser.id, email: decodedUser.email, role: decodedUser.role });
                } else {
                    localStorage.removeItem('token');
                }
            } catch {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        const decodedUser = jwtDecode(token);
        setUser({ id: decodedUser.id, email: decodedUser.email, role: decodedUser.role });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const authContextValue = { user, login, logout, isAuthenticated: !!user, loading };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
