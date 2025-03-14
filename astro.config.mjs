import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import eslintPlugin from 'vite-plugin-eslint';

import icon from 'astro-icon';

export default defineConfig({
  site: 'https://desdejupiter.me',
  vite: {
    plugins: [tailwindcss(), eslintPlugin()],
  },
  integrations: [icon()],
});
