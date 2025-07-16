import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Auth/Login" options={{ title: '로그인' }} />
        <Stack.Screen name="Auth/Register" options={{ title: '회원가입' }} />
        <Stack.Screen name="Auth/SetNickname" options={{ title: '닉네임 설정' }} />
        <Stack.Screen name="Community/WritePost" options={{ title: '글 작성' }} />
        <Stack.Screen name="Community/PostList" options={{ title: '글 목록' }} />
        <Stack.Screen name="Community/PostDetail" options={{ title: '글 상세' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
