import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import playformCompress from '@playform/compress';
import partytown from '@astrojs/partytown';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  integrations: [partytown({
    config: {
      forward: ["dataLayer.push"],
    },
  }), playformCompress()]
});