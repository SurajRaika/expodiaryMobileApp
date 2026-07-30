import type { RegisterFormProps } from './components/register-form';
import { useRouter } from 'expo-router';
import * as React from 'react';

import { FocusAwareStatusBar } from '@/components/ui';
import { RegisterForm } from './components/register-form';
import { useAuthStore } from './use-auth-store';

export function RegisterScreen() {
  const router = useRouter();
  const signIn = useAuthStore.use.signIn();

  const onSubmit: RegisterFormProps['onSubmit'] = (data) => {
    console.log('Registering user:', data);
    // Simulate successful registration by signing them in
    signIn({ access: 'access-token', refresh: 'refresh-token' });
    router.replace('/');
  };

  return (
    <>
      <FocusAwareStatusBar />
      <RegisterForm onSubmit={onSubmit} />
    </>
  );
}
