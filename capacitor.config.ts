import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ng.aurabridge.health',
  appName: 'AuraBridge Health',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    url: 'https://v0-aura-pharm-app.vercel.app',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ["camera", "photos"]
    }
  }
};

export default config;
