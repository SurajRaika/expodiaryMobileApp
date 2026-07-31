import * as React from 'react';
import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import { InteractionScreen } from './interaction-screen';

afterEach(cleanup);

describe('interaction screen chat suite', () => {
  it('renders chat screen, default messages and input elements correctly', async () => {
    setup(<InteractionScreen />);

    // Should find the Header title and subtitle
    expect(screen.getByText('ExpoDiary Scanner Bot')).toBeOnTheScreen();
    expect(screen.getByText('Ready to Scan Cards')).toBeOnTheScreen();

    // Default chat messages should be visible
    expect(screen.getByText(/Welcome to your lead Interaction page!/i)).toBeOnTheScreen();
    expect(screen.getByText(/Just click the scanner icon/i)).toBeOnTheScreen();

    // Chat input controls should be visible
    expect(screen.getByPlaceholderText('Type a message...')).toBeOnTheScreen();
    expect(screen.getByLabelText('take selfie')).toBeOnTheScreen();
    expect(screen.getByLabelText('scanner')).toBeOnTheScreen();
    expect(screen.getByLabelText('record voice')).toBeOnTheScreen();
  });

  it('allows user to type and send text messages', async () => {
    const { user } = setup(<InteractionScreen />);

    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Hello this is a test text message');

    // The send button should now appear
    const sendBtn = screen.getByLabelText('send message');
    await user.press(sendBtn);

    // Message should be appended to the thread
    await waitFor(() => {
      expect(screen.getByText('Hello this is a test text message')).toBeOnTheScreen();
    });
  });

  it('triggers scanner mode and captures simulated card successfully', async () => {
    const { user } = setup(<InteractionScreen />);

    // Tap scanner button to open scanner popup
    const scannerBtn = screen.getByLabelText('scanner');
    await user.press(scannerBtn);

    // Scanner camera overlay should be visible
    expect(screen.getByText('🔍 Document/Card Scanner')).toBeOnTheScreen();

    // Click camera shutter (Capture Button) using the testID
    const captureBtn = screen.getByTestId('shutter-button');
    await user.press(captureBtn);

    // Scanner overlay should close, and business card message should render
    await waitFor(() => {
      expect(screen.queryByText('🔍 Document/Card Scanner')).not.toBeOnTheScreen();
      expect(screen.getByText('📇 Business Card Scanned')).toBeOnTheScreen();
    });
  });

  it('triggers photo mode and captures simulated photo successfully', async () => {
    const { user } = setup(<InteractionScreen />);

    // Tap photo camera button
    const photoBtn = screen.getByLabelText('take selfie');
    await user.press(photoBtn);

    // Photo overlay should be visible
    expect(screen.getByText('📷 In-App Camera')).toBeOnTheScreen();

    // Click camera shutter using the testID
    const captureBtn = screen.getByTestId('shutter-button');
    await user.press(captureBtn);

    // Overlay closes and captured image block appears
    await waitFor(() => {
      expect(screen.queryByText('📷 In-App Camera')).not.toBeOnTheScreen();
      expect(screen.getByText('📷 Taken via Custom Camera')).toBeOnTheScreen();
    });
  });

  it('triggers voice recording, counts seconds and sends voice message', async () => {
    const { user } = setup(<InteractionScreen />);

    // Tap microphone record voice button
    const voiceBtn = screen.getByLabelText('record voice');
    await user.press(voiceBtn);

    // Recorder overlay should be visible
    expect(screen.getByText('Recording Audio Live')).toBeOnTheScreen();

    // Click confirm/send record button
    const confirmBtn = screen.getByText('✔️');
    await user.press(confirmBtn);

    // Recorder closes and voice bubble with playback visualizer appears
    await waitFor(() => {
      expect(screen.queryByText('Recording Audio Live')).not.toBeOnTheScreen();
    });
  });
});
