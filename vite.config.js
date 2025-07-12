import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api/seacat-pki': {
				target: 'http://localhost:8910',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/seacat-pki/, '/'),
			},
		},
	},
})
