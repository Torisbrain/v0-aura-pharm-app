import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aurabridge.health',
  appName: 'AuraBridge Health',
  webDir: 'out',
  server: {
    url: 'https://v0-aura-pharm-app.vercel.app',
    cleartext: true,
    allowNavigation: ['*.vercel.app', '*.supabase.co', 'api.paystack.co']
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#16a34a',
      showSpinner: false,
    },
  },
};

export default config;
