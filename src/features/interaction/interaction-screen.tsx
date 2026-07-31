import type { ChatMessageType } from './components/chat-message';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { FocusAwareStatusBar, SafeAreaView } from '@/components/ui';
import { AudioRecorder } from './components/audio-recorder';
import { ChatInput } from './components/chat-input';
import { ChatMessage } from './components/chat-message';
import { CustomCamera } from './components/custom-camera';

const INITIAL_MESSAGES: ChatMessageType[] = [
  {
    id: '1',
    sender: 'other',
    type: 'text',
    content: 'Welcome to your lead Interaction page! 📱 Let\'s scan a business card or record a quick briefing note.',
    timestamp: '10:40 AM',
  },
  {
    id: '2',
    sender: 'other',
    type: 'text',
    content: 'Just click the scanner icon (📇) or record audio (🎙️) below to get started.',
    timestamp: '10:41 AM',
  },
];

export function InteractionScreen() {
  const [messages, setMessages] = React.useState<ChatMessageType[]>(INITIAL_MESSAGES);
  const [cameraVisible, setCameraVisible] = React.useState(false);
  const [cameraMode, setCameraMode] = React.useState<'scanner' | 'photo'>('scanner');
  const [recorderVisible, setRecorderVisible] = React.useState(false);

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, cameraVisible, recorderVisible]);

  const addMessage = (type: any, extra: any = {}) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        type,
        timestamp: getCurrentTime(),
        ...extra,
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <FocusAwareStatusBar />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <InteractionHeader onClear={() => setMessages([
          {
            id: '1',
            sender: 'other',
            type: 'text',
            content: 'Chat cleared. Let\'s scan a business card or record a quick briefing note.',
            timestamp: getCurrentTime(),
          },
        ])}
        />

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-1 py-2"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </ScrollView>

        <ChatInput
          onSendText={text => addMessage('text', { content: text })}
          onOpenScanner={() => {
            setCameraMode('scanner');
            setCameraVisible(true);
          }}
          onOpenPhotoCamera={() => {
            setCameraMode('photo');
            setCameraVisible(true);
          }}
          onStartRecording={() => setRecorderVisible(true)}
        />

        <CustomCamera
          visible={cameraVisible}
          mode={cameraMode}
          onClose={() => setCameraVisible(false)}
          onCapture={(capturedData: any) => {
            setCameraVisible(false);
            addMessage(cameraMode === 'scanner' ? 'scanner' : 'photo', {
              imageUri: capturedData.imageUri,
              cardData: capturedData.cardData,
            });
          }}
        />

        <AudioRecorder
          visible={recorderVisible}
          onCancel={() => setRecorderVisible(false)}
          onSend={(duration: number) => {
            setRecorderVisible(false);
            addMessage('voice', { duration });
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Subcomponents to keep InteractionScreen below max lines limit

function InteractionHeader({ onClear }: { onClear: () => void }) {
  return (
    <View className="flex-row items-center justify-between border-b border-neutral-200/60 bg-white px-4 py-3.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <View className="flex-row items-center">
        <View className="mr-3 size-10 items-center justify-center rounded-full bg-teal-500 shadow-inner">
          <Text className="text-base font-bold text-white">📇</Text>
        </View>
        <View>
          <Text className="text-base font-bold text-neutral-800 dark:text-white">ExpoDiary Scanner Bot</Text>
          <View className="mt-0.5 flex-row items-center">
            <View className="mr-1.5 size-2 rounded-full bg-green-500" />
            <Text className="text-xs text-neutral-500 dark:text-neutral-400">Ready to Scan Cards</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={onClear}
        className="rounded-lg bg-neutral-100 px-2.5 py-1.5 active:bg-neutral-200 dark:bg-neutral-800"
      >
        <Text className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Clear</Text>
      </Pressable>
    </View>
  );
}

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12;
  const minStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minStr} ${ampm}`;
}
