import * as React from 'react';

import { cleanup, screen, setup } from '@/lib/test-utils';
import { OnboardingScreen } from './onboarding-screen';

afterEach(cleanup);

describe('onboardingScreen Wizard', () => {
  it('renders Step 0 correctly', async () => {
    setup(<OnboardingScreen />);
    expect(await screen.findByTestId('onboarding-step-0-title')).toBeOnTheScreen();
    expect(screen.getByTestId('role-option-exhibitor')).toBeOnTheScreen();
    expect(screen.getByTestId('next-button')).toBeOnTheScreen();
    expect(screen.queryByTestId('back-button')).not.toBeOnTheScreen();
  });

  it('navigates through the onboarding steps correctly', async () => {
    const { user } = setup(<OnboardingScreen />);

    // Step 0 -> Step 1
    const nextBtn = screen.getByTestId('next-button');
    await user.press(nextBtn);

    expect(await screen.findByTestId('onboarding-step-1-title')).toBeOnTheScreen();
    expect(screen.getByTestId('industry-option-tech')).toBeOnTheScreen();
    expect(screen.getByTestId('back-button')).toBeOnTheScreen();

    // Step 1 -> Step 2
    await user.press(nextBtn);
    expect(await screen.findByTestId('onboarding-step-2-title')).toBeOnTheScreen();
    expect(screen.getByTestId('goal-option-goal_med')).toBeOnTheScreen();

    // Step 2 -> Step 1 (Back button)
    const backBtn = screen.getByTestId('back-button');
    await user.press(backBtn);
    expect(await screen.findByTestId('onboarding-step-1-title')).toBeOnTheScreen();
  });
});
