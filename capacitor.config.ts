import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Thin Android/iOS shell that loads the live Lovable deployment.
 * Keeps TanStack Start server functions (e.g. Face++ Detect) working on-device.
 */
const config: CapacitorConfig = {
  appId: "com.zeusammonra.aeroflighttrivia",
  appName: "ZEUS AMMON-RA 11",
  webDir: "www",
  server: {
    url: "https://aero-flight-trivia.lovable.app",
    cleartext: false,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
    },
  },
};

export default config;
