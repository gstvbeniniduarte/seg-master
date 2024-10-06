import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import playformCompress from '@playform/compress';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  integrations: [playformCompress()]
});