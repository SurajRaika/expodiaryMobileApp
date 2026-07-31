import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

type AudioRecorderProps = {
  visible: boolean;
  onCancel: () => void;
  onSend: (duration: number) => void;
};

export function AudioRecorder({ visible, onCancel, onSend }: AudioRecorderProps) {
  const [seconds, setSeconds] = React.useState(0);
  const timerRef = React.useRef<any>(null);

  // Waveform heights state for dynamic sound simulation
  const [waves, setWaves] = React.useState<number[]>([10, 15, 8, 20, 12, 18, 6, 14, 10, 22, 16, 8, 12, 14, 10, 18, 12, 6]);

  React.useEffect(() => {
    if (!visible)
      return;

    // Start recording timer
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);

      // Simulate sound level updates by shifting and generating random heights
      setWaves(prevWaves => prevWaves.map(() => Math.floor(6 + Math.random() * 26)));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [visible]);

  // Reset timer state when recorder visibility changes
  React.useEffect(() => {
    if (visible) {
      setSeconds(0);
    }
  }, [visible]);

  if (!visible)
    return null;

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSend = () => {
    // Return final duration, if 0 make it at least 2 seconds
    onSend(seconds || 3);
  };

  return (
    <View className="absolute inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
      <View className="items-center">

        {/* Status Indicator */}
        <View className="mb-3 flex-row items-center">
          <View className="mr-1.5 size-2.5 animate-pulse rounded-full bg-red-500" />
          <Text className="text-xs font-bold tracking-widest text-red-500 uppercase">Recording Audio Live</Text>
        </View>

        {/* Live Timer */}
        <Text className="mb-4 font-mono text-3xl font-bold tracking-wider text-white">
          {formatTime(seconds)}
        </Text>

        {/* Dynamic Waveform Visualizer */}
        <View className="mb-6 h-16 w-full max-w-xs flex-row items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950/40 px-4">
          {waves.map((h, i) => (
            <View
              key={i}
              className="mx-0.5 w-1.5 rounded-full bg-teal-500"
              style={{ height: h }}
            />
          ))}
        </View>

        {/* Control Row */}
        <View className="w-full max-w-sm flex-row items-center justify-between px-6">

          {/* Delete / Trash Button */}
          <Pressable
            onPress={onCancel}
            className="size-12 items-center justify-center rounded-full bg-neutral-800 active:bg-neutral-700"
          >
            <Text className="text-lg">🗑️</Text>
          </Pressable>

          {/* Guide Text */}
          <Text className="text-xs font-medium text-neutral-400">
            Keep speaking...
          </Text>

          {/* Stop and Send Button */}
          <Pressable
            onPress={handleSend}
            className="size-14 items-center justify-center rounded-full bg-teal-500 shadow-lg active:scale-95"
          >
            {/* Paper Plane Icon */}
            <Text className="text-lg">✔️</Text>
          </Pressable>

        </View>

      </View>
    </View>
  );
}
