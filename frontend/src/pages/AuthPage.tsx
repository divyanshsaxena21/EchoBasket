// src/pages/AuthPage.tsx
import SignupForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';

interface Props {
  onLogin: (token: string) => void;
}

export default function AuthPage({ onLogin }: Props) {
  return (
    <div>
      <h2>Login</h2>
      <LoginForm onLogin={onLogin} />
      <h2>Or Sign Up</h2>
      <SignupForm onLogin={onLogin} />
    </div>
  );
}
