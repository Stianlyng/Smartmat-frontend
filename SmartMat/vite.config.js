import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import fs from 'fs';
import path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  server: {
    https: true,
    port: 443,
  },
  plugins: [
    vue(),
    vueJsx(),
    basicSsl({
      httpsOptions: {
        key: fs.readFileSync(path.resolve(__dirname, './ssl/private-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, './ssl/cert.pem')),
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});