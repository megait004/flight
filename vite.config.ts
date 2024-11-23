import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	server: { host: '0.0.0.0', proxy: { '/api': 'http://localhost:5000' } },
	build: {
		emptyOutDir: true,
		minify: 'terser',
		cssMinify: 'lightningcss',
		terserOptions: {
			compress: true,
			sourceMap: false,
		},
	},
	resolve: {
		alias: [
			{
				find: '@assets',
				replacement: resolve(__dirname, 'src/assets'),
			},
			{
				find: '@components',
				replacement: resolve(__dirname, 'src/components'),
			},
			{
				find: '@pages',
				replacement: resolve(__dirname, 'src/pages'),
			},
			{
				find: '@public',
				replacement: resolve(__dirname, 'public'),
			},
			{
				find: '@utils',
				replacement: resolve(__dirname, 'src/utils'),
			},
			{
				find: '@routes',
				replacement: resolve(__dirname, 'src/routes'),
			},
		],
	},
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
});
