import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast, { ErrorToast, SuccessToast } from "react-native-toast-message";
import "../global.css";
import { Provider } from "react-redux";
import { store } from "@/business/store/redux/store";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    KelsonBold: require("../assets/fonts/Kelson-Bold.otf"),
    KelsonRegular: require("../assets/fonts/Kelson-Regular.otf"),
    KelsonLight: require("../assets/fonts/Kelson-Light.otf"),
    KelsonExtraBold: require("../assets/fonts/Kelson-ExtraBold.otf"),
    KelsonExtraLight: require("../assets/fonts/Kelson-ExtraLight.otf"),
    KelsomMedium: require("../assets/fonts/Kelson-Medium.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <Provider store={store}>
        <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(messages)" />
        </Stack>
        <StatusBar style="auto" />
        <Toast
          position="bottom"
          config={{
            success: (props) => (
              <SuccessToast
                {...props}
                style={{
                  borderRadius: 20,
                  borderLeftWidth: 0,
                  // borderLeftColor: "#68D391",
                  // borderColor: "#68D391",
                  // borderWidth: 2,
                }}
                text2Style={{
                  fontSize: 15,
                  fontFamily: "KelsonBold",
                  color: "#68D391",
                  textAlign: "center",
                }}
                text2NumberOfLines={10}
              />
            ),
            /*
            Overwrite 'error' type,
            by modifying the existing `ErrorToast` component
          */
            error: (props) => (
              <ErrorToast
                {...props}
                style={{
                  borderRadius: 20,
                  borderLeftWidth: 0,
                  // borderLeftColor: "#FC8181",
                  // borderColor: "#FC8181",
                  // borderWidth: 2,
                }}
                text2Style={{
                  fontSize: 15,
                  fontFamily: "KelsonBold",
                  color: "#FC8181",
                  textAlign: "center",
                }}
                text2NumberOfLines={10}
              />
            ),
          }}
        />
      </Provider>
    </ActionSheetProvider>
  );
}
