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
	build: {
		// Enable minification
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
			},
		},
		// Optimize chunk sizes
		rollupOptions: {
			output: {
				// Split vendor chunks
				manualChunks: {
					vendor: ['react', 'react-dom'],
					jsonEditor: ['json-edit-react'],
				},
				// Optimize chunk naming
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
			},
		},
		// Enable source maps for debugging (disable for production)
		sourcemap: false,
		// Optimize CSS
		cssCodeSplit: true,
		// Reduce chunk size warnings threshold
		chunkSizeWarningLimit: 1000,
		// Enable tree shaking
		target: 'esnext',
		// Optimize dependencies
		commonjsOptions: {
			include: [/node_modules/],
		},
	},
	// Optimize dependencies
	optimizeDeps: {
		include: ['react', 'react-dom', 'json-edit-react'],
	},
})
