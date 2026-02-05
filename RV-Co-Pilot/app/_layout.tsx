import { Stack } from "expo-router";
import { useFonts, RubikDirt_400Regular } from '@expo-google-fonts/rubik-dirt'


export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Rubik-Dirt': RubikDirt_400Regular,
  });
  return <Stack />;
}