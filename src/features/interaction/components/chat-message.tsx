import * as React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export type ChatMessageType = {
  id: string;
  sender: 'user' | 'other';
  type: 'text' | 'voice' | 'photo' | 'scanner';
  content?: string;
  timestamp: string;
  duration?: number; // in seconds
  imageUri?: string;
  cardData?: {
    name: string;
    title: string;
    company: string;
    phone: string;
    email: string;
  };
};

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text className={`text-base/5 ${isUser ? 'text-white' : 'text-neutral-900 dark:text-neutral-100'}`}>
            {message.content}
          </Text>
        );
      case 'photo':
        return <PhotoMessage imageUri={message.imageUri} />;
      case 'scanner':
        return <ScannerMessage cardData={message.cardData} />;
      case 'voice':
        return <VoiceMessage duration={message.duration} isUser={isUser} />;
      default:
        return null;
    }
  };

  return (
    <View className={`my-1.5 flex-row px-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <View
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'rounded-tr-none bg-teal-600'
            : 'rounded-tl-none border border-neutral-100 bg-white dark:border-neutral-700 dark:bg-neutral-800'
        }`}
      >
        {renderContent()}

        <View className="mt-1 flex-row items-center justify-end">
          <Text className={`text-right text-[9px] ${isUser ? 'text-teal-100' : 'text-neutral-400'}`}>
            {message.timestamp}
          </Text>
          {isUser && (
            <Text className="ml-1 text-[10px] text-sky-300">✓✓</Text>
          )}
        </View>
      </View>
    </View>
  );
}

// Extracted Subcomponents to reduce function line lengths below 110 lines limit

function PhotoMessage({ imageUri }: { imageUri?: string }) {
  return (
    <View className="overflow-hidden rounded-lg bg-neutral-200">
      {imageUri
        ? (
            <Image
              source={{ uri: imageUri }}
              className="h-48 w-64 object-cover"
              style={{ width: 256, height: 192 }}
              resizeMode="cover"
            />
          )
        : (
            <View className="h-48 w-64 items-center justify-center bg-neutral-800">
              <Text className="text-sm text-white">📷 Captured Photo</Text>
            </View>
          )}
      <View className="absolute right-0 bottom-0 left-0 bg-black/40 p-2">
        <Text className="text-xs font-semibold text-white">📷 Taken via Custom Camera</Text>
      </View>
    </View>
  );
}

function ScannerMessage({ cardData }: { cardData?: ChatMessageType['cardData'] }) {
  return (
    <View className="w-72 overflow-hidden rounded-xl border border-teal-500 bg-neutral-900 shadow-lg">
      <View className="flex-row items-center justify-between bg-teal-600 px-3 py-1.5">
        <Text className="text-xs font-bold tracking-wider text-white uppercase">📇 Business Card Scanned</Text>
        <View className="size-2 animate-pulse rounded-full bg-green-400" />
      </View>

      {/* Virtual Card Content */}
      <View className="bg-neutral-900 p-4">
        <View className="mb-3 border-b border-neutral-700 pb-2">
          <Text className="text-lg font-bold text-teal-400">
            {cardData?.name || 'Jane Doe'}
          </Text>
          <Text className="text-xs font-medium text-neutral-300">
            {cardData?.title || 'Director of Sales'}
          </Text>
          <Text className="text-[10px] font-semibold text-neutral-400">
            {cardData?.company || 'ExpoDiary SaaS'}
          </Text>
        </View>

        <View className="space-y-1.5">
          <View className="flex-row items-center">
            <Text className="mr-1.5 text-xs text-neutral-400">📞</Text>
            <Text className="text-xs text-neutral-200">{cardData?.phone || '+1 (555) 019-2834'}</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="mr-1.5 text-xs text-neutral-400">✉️</Text>
            <Text className="text-xs text-neutral-200">{cardData?.email || 'jane.doe@expodiary.io'}</Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between opacity-40">
          <View className="h-1.5 w-16 rounded-sm bg-neutral-600" />
          <Text className="text-[8px] tracking-widest text-white">OCR SUCCESS</Text>
        </View>
      </View>
    </View>
  );
}

type VoiceMessageProps = {
  duration?: number;
  isUser: boolean;
};

function VoiceMessage({ duration = 5, isUser }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0 to 1
  const playbackTimer = React.useRef<any>(null);

  React.useEffect(() => {
    if (isPlaying) {
      const step = 0.05;
      const intervalMs = (duration * 1000) * step;
      playbackTimer.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            clearInterval(playbackTimer.current);
            return 0;
          }
          return prev + step;
        });
      }, intervalMs);
    }
    else {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
      }
    }
    return () => {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
      }
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setProgress(0);
    setIsPlaying(prev => !prev);
  };

  const formatVoiceTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentTime = progress * duration;
  const wavesData = [4, 8, 12, 10, 6, 14, 11, 7, 9, 13, 15, 8, 5, 10, 12, 6, 8, 4];

  return (
    <View className="w-64 flex-row items-center py-1">
      <Pressable
        onPress={togglePlay}
        className={`size-11 items-center justify-center rounded-full ${isUser ? 'bg-white' : 'bg-teal-600'}`}
      >
        {isPlaying
          ? (
              <View className="flex-row items-center justify-center">
                <View className={`mr-0.5 h-4 w-1.5 rounded-full ${isUser ? 'bg-teal-600' : 'bg-white'}`} style={{ marginRight: 2 }} />
                <View className={`h-4 w-1.5 rounded-full ${isUser ? 'bg-teal-600' : 'bg-white'}`} />
              </View>
            )
          : (
              <View
                style={{
                  width: 0,
                  height: 0,
                  backgroundColor: 'transparent',
                  borderStyle: 'solid',
                  borderLeftWidth: 14,
                  borderRightWidth: 0,
                  borderBottomWidth: 8,
                  borderTopWidth: 8,
                  borderLeftColor: isUser ? '#0D9488' : '#FFFFFF',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderTopColor: 'transparent',
                  marginLeft: 4,
                }}
              />
            )}
      </Pressable>

      <View className="ml-3 flex-1 justify-center">
        <View className="mb-1 h-6 flex-row items-center">
          {wavesData.map((h, i) => {
            const percent = i / wavesData.length;
            const active = progress > percent;
            const barColor = active
              ? (isUser ? 'bg-neutral-100' : 'bg-teal-600')
              : (isUser ? 'bg-teal-800' : 'bg-neutral-400 dark:bg-neutral-600');
            return (
              <View
                key={i}
                className={`mr-0.5 w-1 rounded-full ${barColor}`}
                style={{ height: h, marginRight: 2 }}
              />
            );
          })}
        </View>

        <View className="flex-row items-center justify-between">
          <Text className={`text-[10px] ${isUser ? 'text-teal-100' : 'text-neutral-500'}`}>
            {formatVoiceTime(currentTime)}
          </Text>
          <Text className={`text-[10px] ${isUser ? 'text-teal-100' : 'text-neutral-500'}`}>
            {formatVoiceTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
}
