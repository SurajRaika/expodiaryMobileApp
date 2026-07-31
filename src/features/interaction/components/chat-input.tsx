import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

type ChatInputProps = {
  onSendText: (text: string) => void;
  onOpenScanner: () => void;
  onOpenPhotoCamera: () => void;
  onStartRecording: () => void;
};

export function ChatInput({
  onSendText,
  onOpenScanner,
  onOpenPhotoCamera,
  onStartRecording,
}: ChatInputProps) {
  const [text, setText] = React.useState('');

  const handleSend = () => {
    if (text.trim() === '')
      return;
    onSendText(text.trim());
    setText('');
  };

  const hasText = text.trim().length > 0;

  return (
    <View className="flex-row items-center border-t border-neutral-100 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">

      {/* Photo/Camera Button (Left of input) */}
      <Pressable
        onPress={onOpenPhotoCamera}
        accessibilityLabel="take selfie"
        className="mr-2 size-10 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200 dark:bg-neutral-800"
      >
        <Text className="text-lg">📷</Text>
      </Pressable>

      {/* Main Input Wrapper */}
      <View className="flex-1 flex-row items-center rounded-full border border-neutral-200/50 bg-neutral-100 px-4 py-1.5 dark:border-neutral-700/50 dark:bg-neutral-800">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
          className="flex-1 py-1 text-base text-neutral-800 dark:text-neutral-100"
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
      </View>

      {/* Right buttons depending on typing state */}
      {hasText && (
        <Pressable
          onPress={handleSend}
          accessibilityLabel="send message"
          className="ml-2 size-10 items-center justify-center rounded-full bg-teal-600 shadow-sm active:bg-teal-700"
        >
          <Text className="text-base font-bold text-white">➔</Text>
        </Pressable>
      )}

      {!hasText && (
        <View className="ml-1 flex-row items-center">
          <Pressable
            onPress={onOpenScanner}
            accessibilityLabel="scanner"
            className="mr-1.5 size-10 items-center justify-center rounded-full border border-teal-200/40 bg-teal-50 active:bg-teal-100 dark:border-teal-900/40 dark:bg-teal-950/40"
          >
            <Text className="text-lg">📇</Text>
          </Pressable>

          <Pressable
            onPress={onStartRecording}
            accessibilityLabel="record voice"
            className="size-10 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200 dark:bg-neutral-800"
          >
            <Text className="text-lg">🎙️</Text>
          </Pressable>
        </View>
      )}

    </View>
  );
}
