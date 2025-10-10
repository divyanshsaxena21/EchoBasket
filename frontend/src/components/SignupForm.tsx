import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

interface Props {
  onLogin: (token: string) => void;
}

export default function SignupForm({ onLogin }: Props) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      if (user) {
        // Optionally sign in after signup
        const loginCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        const loginUser = loginCredential.user;
        const token = await loginUser.getIdToken();
        localStorage.setItem('token', token);
        onLogin(token);
      }
    } catch {
      setError('Signup failed: Please check your email and password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      style={{
        maxWidth: 500,
        margin: '2em auto',
        padding: '2em',
        backgroundColor: '#1f2937',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        color: '#e0e7ff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5em', color: '#818cf8' }}>📝 Sign Up</h2>

      <label htmlFor="email" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
        Email
      </label>
      <input
        id="email"
        placeholder="Enter your email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        style={{
          width: '100%',
          padding: '0.8em',
          marginBottom: '1.2em',
          borderRadius: 8,
          border: '1px solid #4b5563',
          backgroundColor: '#374151',
          color: '#e0e7ff',
          fontSize: '1em',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#4b5563')}
      />

      <label htmlFor="password" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
        Password
      </label>
      <input
        id="password"
        placeholder="Enter your password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        style={{
          width: '100%',
          padding: '0.8em',
          marginBottom: '1.2em',
          borderRadius: 8,
          border: '1px solid #4b5563',
          backgroundColor: '#374151',
          color: '#e0e7ff',
          fontSize: '1em',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#4b5563')}
      />

      {error && (
        <p
          role="alert"
          style={{
            
            justifyContent: 'center',
            color: '#f87171',
            marginBottom: '1em',
            fontWeight: 600,
            fontSize: '0.9em',
            textAlign: 'center',
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          marginLeft: '0.5rem',
          marginRight: 'auto',
          width: '100%',
          padding: '0.9em',
          borderRadius: 8,
          border: 'none',
          backgroundColor: loading ? '#818cf8aa' : '#6366f1',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.1em',
          cursor: loading ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = '#4f46e5';
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = '#6366f1';
        }}
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
