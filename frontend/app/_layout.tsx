import { Stack } from "expo-router";
import { useFonts, RubikDirt_400Regular } from '@expo-google-fonts/rubik-dirt'
import { View } from "react-native"; 


export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Rubik-Dirt': RubikDirt_400Regular,
  });

    if (!loaded) {
    return <View />; // or null / splash screen
  }

  return <Stack />;
}