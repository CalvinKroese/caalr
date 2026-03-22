import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://caalr.netlify.app',
  output: 'static',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  build: {
    assets: '_assets',
  },
});
