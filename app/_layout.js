import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {

  return (
    <SafeAreaProvider>
        <Stack
            screenOptions={{
              // Hide the header for all other routes.
              headerShown: true,
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                // Hide the header for this route
                headerShown: false,
              }}
            />
          </Stack>
    </SafeAreaProvider>
  );
}