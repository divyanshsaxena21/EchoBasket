// src/App.tsx
import { useEffect, useState } from 'react';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';

function App() {
  const [isAuthenticated, setAuth] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuth(!!token);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? <Home onLogout={handleLogout} /> : <AuthPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;
