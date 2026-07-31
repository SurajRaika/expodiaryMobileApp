/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView } from 'react-native';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

type RoleOption = {
  id: string;
  label: string;
  description: string;
};

type IndustryOption = {
  id: string;
  label: string;
};

type GoalOption = {
  id: string;
  label: string;
  description: string;
};

const ROLES: RoleOption[] = [
  { id: 'exhibitor', label: 'Exhibitor', description: 'Showcasing products and seeking leads' },
  { id: 'sales_rep', label: 'Sales Representative', description: 'Pitching, networking, and scanning leads' },
  { id: 'organizer', label: 'Trade Show Organizer', description: 'Coordinating event flow and vendor success' },
  { id: 'visitor', label: 'Visitor / Attendee', description: 'Exploring and discovering booths/companies' },
];

const INDUSTRIES: IndustryOption[] = [
  { id: 'tech', label: 'Technology & Software' },
  { id: 'health', label: 'Medical & Healthcare' },
  { id: 'industrial', label: 'Manufacturing & Industrial' },
  { id: 'retail', label: 'Fashion & Retail' },
  { id: 'other', label: 'Other Industries' },
];

const GOALS: GoalOption[] = [
  { id: 'goal_low', label: 'Under 50 Leads', description: 'Focused, high-quality targeted connections' },
  { id: 'goal_med', label: '50 - 200 Leads', description: 'Healthy balance of quantity and quality' },
  { id: 'goal_high', label: '200 - 500 Leads', description: 'Ambitious, aggressive prospecting' },
  { id: 'goal_enterprise', label: '500+ Leads', description: 'Enterprise-level trade show team goal' },
];

export function OnboardingScreen() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();

  // Onboarding wizard state
  const [step, setStep] = React.useState<number>(0); // 0, 1, 2
  const [selectedRole, setSelectedRole] = React.useState<string>('exhibitor');
  const [selectedIndustry, setSelectedIndustry] = React.useState<string>('tech');
  const [selectedGoal, setSelectedGoal] = React.useState<string>('goal_med');

  const handleNext = () => {
    if (step < 2) {
      setStep(prev => prev + 1);
    }
    else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsFirstTime(false);
    // Move to register
    router.replace('/register');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar />

      {/* Top Header Row with Skip Button */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <View className="flex-row items-center space-x-2">
          <Text className="text-2xl font-extrabold text-primary-500">ExpoDiary</Text>
          <View className="rounded-full bg-neutral-100 px-2.5 py-0.5 dark:bg-neutral-800">
            <Text className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Beta</Text>
          </View>
        </View>
        <Pressable
          testID="skip-button"
          onPress={handleComplete}
          className="rounded-lg bg-neutral-50 px-3 py-1.5 dark:bg-neutral-800"
        >
          <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-300">Skip</Text>
        </Pressable>
      </View>

      {/* Progress Bar Indicators */}
      <View className="px-6 pb-4">
        <View className="flex-row justify-between space-x-2">
          {[0, 1, 2].map((i) => {
            const isActive = i <= step;
            return (
              <View
                key={i}
                testID={`progress-step-${i}`}
                className={`h-2 flex-1 rounded-full ${
                  isActive ? 'bg-black dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              />
            );
          })}
        </View>
        <Text className="mt-2 text-xs font-medium text-neutral-400 dark:text-neutral-500">
          Step
          {' '}
          {step + 1}
          {' '}
          of 3
        </Text>
      </View>

      {/* Main Content Area */}
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 0 && (
          <View className="space-y-6">
            <View>
              <Text testID="onboarding-step-0-title" className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                What is your role at the Trade Expo?
              </Text>
              <Text className="mt-2 text-base text-neutral-500 dark:text-neutral-400">
                We will personalize your lead tracking experience based on what you do.
              </Text>
            </View>

            <View className="mt-4 gap-y-3">
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <Pressable
                    key={role.id}
                    testID={`role-option-${role.id}`}
                    onPress={() => setSelectedRole(role.id)}
                    className={`flex-col rounded-xl border-2 p-4 transition-all ${
                      isSelected
                        ? 'border-black bg-neutral-50 dark:border-white dark:bg-neutral-800'
                        : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {role.label}
                      </Text>
                      {isSelected && (
                        <View className="size-5 items-center justify-center rounded-full bg-black dark:bg-white">
                          <View className="size-2 rounded-full bg-white dark:bg-black" />
                        </View>
                      )}
                    </View>
                    <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {role.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 1 && (
          <View className="space-y-6">
            <View>
              <Text testID="onboarding-step-1-title" className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Which industry best fits your booth?
              </Text>
              <Text className="mt-2 text-base text-neutral-500 dark:text-neutral-400">
                Choose the primary vertical you represent.
              </Text>
            </View>

            <View className="mt-4 gap-y-3">
              {INDUSTRIES.map((industry) => {
                const isSelected = selectedIndustry === industry.id;
                return (
                  <Pressable
                    key={industry.id}
                    testID={`industry-option-${industry.id}`}
                    onPress={() => setSelectedIndustry(industry.id)}
                    className={`flex-row items-center justify-between rounded-xl border-2 p-4 transition-all ${
                      isSelected
                        ? 'border-black bg-neutral-50 dark:border-white dark:bg-neutral-800'
                        : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
                    }`}
                  >
                    <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {industry.label}
                    </Text>
                    {isSelected && (
                      <View className="size-5 items-center justify-center rounded-full bg-black dark:bg-white">
                        <View className="size-2 rounded-full bg-white dark:bg-black" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="space-y-6">
            <View>
              <Text testID="onboarding-step-2-title" className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Set your Expo Lead Goal
              </Text>
              <Text className="mt-2 text-base text-neutral-500 dark:text-neutral-400">
                Let's set a healthy target to track your progress live.
              </Text>
            </View>

            <View className="mt-4 gap-y-3">
              {GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <Pressable
                    key={goal.id}
                    testID={`goal-option-${goal.id}`}
                    onPress={() => setSelectedGoal(goal.id)}
                    className={`flex-col rounded-xl border-2 p-4 transition-all ${
                      isSelected
                        ? 'border-black bg-neutral-50 dark:border-white dark:bg-neutral-800'
                        : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {goal.label}
                      </Text>
                      {isSelected && (
                        <View className="size-5 items-center justify-center rounded-full bg-black dark:bg-white">
                          <View className="size-2 rounded-full bg-white dark:bg-black" />
                        </View>
                      )}
                    </View>
                    <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {goal.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Interactive Navigation Controls */}
      <View className="border-t border-neutral-100 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <View className="flex-row justify-between space-x-4">
          {step > 0
            ? (
                <Button
                  testID="back-button"
                  label="Back"
                  variant="outline"
                  onPress={handleBack}
                  className="flex-1"
                />
              )
            : (
                <View className="flex-1" />
              )}
          <Button
            testID="next-button"
            label={step === 2 ? 'Personalize & Register' : 'Next'}
            variant="default"
            onPress={handleNext}
            className="flex-1"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
