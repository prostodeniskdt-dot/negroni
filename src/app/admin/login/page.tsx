import { Suspense } from 'react';
import LoginForm from './ui';

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

