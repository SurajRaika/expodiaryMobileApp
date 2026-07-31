import * as React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

type CustomCameraProps = {
  visible: boolean;
  mode: 'scanner' | 'photo';
  onClose: () => void;
  onCapture: (capturedData: {
    imageUri: string;
    cardData?: {
      name: string;
      title: string;
      company: string;
      phone: string;
      email: string;
    };
  }) => void;
};

export function CustomCamera({ visible, mode, onClose, onCapture }: CustomCameraProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [streamActive, setStreamActive] = React.useState(false);
  const [streamError, setStreamError] = React.useState(false);

  // HTML5 Webcam support on Web
  React.useEffect(() => {
    if (Platform.OS !== 'web' || !visible || typeof navigator === 'undefined' || !navigator.mediaDevices) {
      return;
    }

    let localStream: MediaStream | null = null;

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode === 'scanner' ? 'environment' : 'user',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });
        localStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      }
      catch (err) {
        console.log('Webcam not available, using simulated stream:', err);
        setStreamError(true);
      }
    };

    startWebcam();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [visible, mode]);

  if (!visible)
    return null;

  const handleCapture = () => {
    const imageUri = getCaptureImageUri(streamActive, videoRef, mode);
    if (mode === 'scanner') {
      const cardData = generateMockCardData();
      onCapture({ imageUri, cardData });
    }
    else {
      onCapture({ imageUri });
    }
  };

  const isWebStream = Platform.OS === 'web' && !streamError;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/80 p-4">
      <View className="w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl">
        <CameraHeader mode={mode} onClose={onClose} />

        <View className="relative aspect-4/3 w-full items-center justify-center overflow-hidden bg-neutral-900">
          {isWebStream && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 size-full object-cover"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {(Platform.OS !== 'web' || streamError || !streamActive) && (
            <SimulatedStream mode={mode} />
          )}

          {mode === 'scanner' && <ScannerOverlay />}
          {mode === 'photo' && <PhotoOverlay />}
        </View>

        <View className="items-center bg-neutral-900 p-6">
          <Pressable
            onPress={handleCapture}
            testID="shutter-button"
            className="size-16 items-center justify-center rounded-full border-4 border-white bg-teal-500 active:scale-95"
          >
            <View className="size-11 rounded-full bg-white/30" />
          </Pressable>
          <Text className="mt-2 text-xs font-semibold text-neutral-400">
            {mode === 'scanner' ? 'Tap to Scan Card' : 'Tap to Take Photo'}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Subcomponents to keep CustomCamera below max-lines-per-function limit

function CameraHeader({ mode, onClose }: { mode: 'scanner' | 'photo'; onClose: () => void }) {
  return (
    <View className="flex-row items-center justify-between border-b border-neutral-900 bg-neutral-900 px-5 py-4">
      <Text className="text-base font-bold text-white">
        {mode === 'scanner' ? '🔍 Document/Card Scanner' : '📷 In-App Camera'}
      </Text>
      <Pressable onPress={onClose} className="rounded-full bg-neutral-800 p-1.5 active:bg-neutral-700">
        <Text className="px-1 text-xs font-bold text-neutral-400">✕</Text>
      </Pressable>
    </View>
  );
}

function SimulatedStream({ mode }: { mode: 'scanner' | 'photo' }) {
  return (
    <View className="absolute inset-0 items-center justify-center bg-teal-950/20">
      <View className="absolute inset-x-6 top-1/4 bottom-1/4 items-center justify-center rounded-xl border-2 border-dashed border-teal-500/40">
        <Text className="px-4 text-center text-[11px] font-bold tracking-widest text-teal-400 uppercase">
          {mode === 'scanner' ? 'Align Business Card inside Frame' : 'Position Face inside Circle'}
        </Text>
      </View>
      <View className="size-24 animate-spin items-center justify-center rounded-full border-4 border-teal-500/20 border-t-teal-500" />
      <Text className="absolute bottom-4 text-xs font-semibold text-neutral-400">
        🔋 Simulated Live Lens Feed (HD)
      </Text>
    </View>
  );
}

function ScannerOverlay() {
  return (
    <View className="pointer-events-none absolute inset-0 items-center justify-center">
      <View className="relative h-44 w-72 rounded-xl border-2 border-teal-400 bg-black/10 shadow-lg">
        <View className="absolute top-[-2] left-[-2] size-5 border-t-4 border-l-4 border-teal-400" />
        <View className="absolute top-[-2] right-[-2] size-5 border-t-4 border-r-4 border-teal-400" />
        <View className="absolute bottom-[-2] left-[-2] size-5 border-b-4 border-l-4 border-teal-400" />
        <View className="absolute right-[-2] bottom-[-2] size-5 border-r-4 border-b-4 border-teal-400" />
        <View
          className="absolute inset-x-0 h-0.5 bg-teal-400 shadow-[0_0_8px_#0d9488]"
          style={{ top: '40%' }}
        />
      </View>
      <Text className="mt-2 rounded-sm bg-neutral-900/80 px-2 py-0.5 text-[10px] font-bold tracking-wider text-teal-400 uppercase">
        Automatic Border Detection Active
      </Text>
    </View>
  );
}

function PhotoOverlay() {
  return (
    <View className="pointer-events-none absolute inset-0 items-center justify-center">
      <View className="relative size-48 rounded-full border-2 border-dashed border-white bg-black/10">
        <View className="absolute inset-0 scale-105 rounded-full border-2 border-teal-400 opacity-60" />
      </View>
      <Text className="mt-3 rounded-sm bg-neutral-900/80 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
        Selfie Mode
      </Text>
    </View>
  );
}

// Utility capture generators

function getCaptureImageUri(
  streamActive: boolean,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  mode: 'scanner' | 'photo',
): string {
  if (Platform.OS === 'web' && streamActive && videoRef.current) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        if (mode === 'scanner') {
          ctx.strokeStyle = '#0D9488';
          ctx.lineWidth = 10;
          ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        }
        return canvas.toDataURL('image/jpeg');
      }
    }
    catch (e) {
      console.error('Failed to capture frame from video element:', e);
    }
  }

  return mode === 'scanner'
    ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'
    : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600';
}

function generateMockCardData() {
  const names = ['John Carter', 'Sarah Jenkins', 'David Kim', 'Elena Rostova', 'Marcus Brody'];
  const titles = ['VP of Product', 'Lead Architect', 'Regional Managing Director', 'Head of Marketing', 'Senior Consultant'];
  const companies = ['CloudForge Solutions', 'Vertex Analytics', 'Nova Labs', 'Stellar Media', 'Aegis Security'];

  const randIdx = Math.floor(Math.random() * names.length);
  const name = names[randIdx];
  const company = companies[randIdx];
  const email = `${name.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(' ', '')}.com`;
  const phone = `+1 (555) 019-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    name,
    title: titles[randIdx],
    company,
    phone,
    email,
  };
}
