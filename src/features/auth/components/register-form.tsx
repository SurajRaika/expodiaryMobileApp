/* eslint-disable max-lines-per-function */
import { useForm } from '@tanstack/react-form';
import { Link } from 'expo-router';
import * as React from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, Input, Text, View } from '@/components/ui';
import { getFieldError } from '@/components/ui/form-utils';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string({
      message: 'Email is required',
    })
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string({
      message: 'Password is required',
    })
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(1, 'Company Name is required'),
});

export type FormType = z.infer<typeof schema>;

export type RegisterFormProps = {
  onSubmit?: (data: FormType) => void;
};

export function RegisterForm({ onSubmit = () => {} }: RegisterFormProps) {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      companyName: '',
    },
    validators: {
      onChange: schema as any,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center bg-white p-6 dark:bg-neutral-900">
        <View className="mb-6 items-center justify-center">
          <Text
            testID="register-title"
            className="pb-2 text-center text-4xl font-extrabold text-neutral-900 dark:text-neutral-50"
          >
            Create Account
          </Text>

          <Text className="max-w-xs text-center text-gray-500 dark:text-gray-400">
            Join ExpoDiary to easily capture, rate, and track your trade show leads.
          </Text>
        </View>

        <form.Field
          name="name"
          children={field => (
            <Input
              testID="register-name-input"
              label="Full Name"
              placeholder="John Doe"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />

        <form.Field
          name="email"
          children={field => (
            <Input
              testID="register-email-input"
              label="Work Email"
              placeholder="john@company.com"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />

        <form.Field
          name="companyName"
          children={field => (
            <Input
              testID="register-company-input"
              label="Company Name"
              placeholder="Acme Corp"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />

        <form.Field
          name="password"
          children={field => (
            <Input
              testID="register-password-input"
              label="Password"
              placeholder="••••••"
              secureTextEntry={true}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />

        <form.Subscribe
          selector={state => [state.isSubmitting]}
          children={([isSubmitting]) => (
            <Button
              testID="register-submit-button"
              label="Sign Up & Get Started"
              onPress={form.handleSubmit}
              loading={isSubmitting}
              className="mt-4"
            />
          )}
        />

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-neutral-500 dark:text-neutral-400">
            Already have an account?
            {' '}
          </Text>
          <Link href="/login" asChild testID="to-login-link">
            <Text className="font-bold text-black underline dark:text-white">
              Sign In
            </Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
