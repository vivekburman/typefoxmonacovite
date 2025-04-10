import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 4001
	},
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
        plugins: [
            importMetaUrlPlugin
        ]
    }
  },
})
