import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import eslintPlugin from 'vite-plugin-eslint';

import icon from 'astro-icon';

export default defineConfig({
  site: 'https://desdejupiter.me',
  vite: {
    plugins: [tailwindcss(), eslintPlugin()],
    server: {
      allowedHosts: ['215e-2806-109f-10-6cd2-e83b-c5a3-f7be-266c.ngrok-free.app'],
    },
  },
  integrations: [icon()],
});
