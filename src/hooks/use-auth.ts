import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    setLoading(false);

    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return { isAuthenticated, loading };
};
