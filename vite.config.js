import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // gh-pages publishes this folder; it also holds CNAME and .nojekyll from public/.
    build: { outDir: 'build' },
    server: { port: 3000 },
});
