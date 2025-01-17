import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'letsread',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    "url": "http://localhost:3000"
  }
};

export default config;
