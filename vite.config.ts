import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import { writeFile, readFile, readdir } from 'fs/promises';
import { resolve, join } from 'path';
import tailwindcss from 'tailwindcss';
import JScrewIt from 'jscrewit';

const convertString2Unicode = (s: string) => {
	return s
		.split('')
		.map((char) => {
			const hexVal = char.charCodeAt(0).toString(16);
			return '\\u' + ('000' + hexVal).slice(-4);
		})
		.join('');
};

const encodeFile = async (filePath: string) => {
	const content = await readFile(filePath, 'utf8');
	const encodedContent = JScrewIt.encode(content);
	await writeFile(filePath, encodedContent);
};

export default defineConfig({
	plugins: [
		react(),
		{
			name: 'create-build-files',
			apply: 'build',
			closeBundle: async () => {
				try {
					const redirectsPath = resolve(
						__dirname,
						'dist',
						'_redirects',
					);
					const redirectsContent = '/*    /index.html    200';
					await writeFile(redirectsPath, redirectsContent);

					const htaccessPath = resolve(
						__dirname,
						'dist',
						'.htaccess',
					);
					const htaccessContent = `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
</IfModule>`;
					await writeFile(htaccessPath, htaccessContent);
				} catch (err) {
					console.error('Error creating build files:', err);
				}
			},
		},
		{
			name: 'obfuscate-html-and-js',
			apply: 'build',
			closeBundle: async () => {
				try {
					const indexPath = resolve(__dirname, 'dist', 'index.html');
					const data = await readFile(indexPath, 'utf8');
					const TMPL = `document.write('__UNI__')`;
					const jsString = TMPL.replace(
						/__UNI__/,
						convertString2Unicode(data),
					);
					const jsfuckCode = JScrewIt.encode(jsString);
					const TMPLHTML = `<script type="text/javascript">${jsfuckCode}</script>`;
					await writeFile(indexPath, TMPLHTML);
					const assetsDir = resolve(__dirname, 'dist', 'assets');
					const files = await readdir(assetsDir);
					for (const file of files) {
						if (file.endsWith('.js')) {
							const filePath = join(assetsDir, file);
							await encodeFile(filePath);
						}
					}
				} catch (err) {
					console.error('Error:', err);
				}
			},
		},
	],
	server: { host: '0.0.0.0', proxy: {} },
	build: {
		emptyOutDir: true,
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
