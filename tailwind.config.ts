import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{ts,tsx}', './index.html', './src/**/*.css'],
	theme: {
		extend: {
			fontFamily: {
				roboto: ['Roboto', 'sans-serif'],
			},
		},
	},
	important: true,
	plugins: [],
};

export default config;