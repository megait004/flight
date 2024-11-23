import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{ts,tsx}', './index.html', './src/**/*.css'],
	theme: {
		extend: {
			fontFamily: {
				montserrat: ['Montserrat', 'sans-serif'],
			},
			keyframes: {
				wiggle: {
					'0%': { transform: 'rotate(-8deg) scale(1)' },
					'15%': { transform: 'rotate(10deg) scale(1.1)' },
					'30%': { transform: 'rotate(-12deg) scale(1)' },
					'45%': { transform: 'rotate(10deg) scale(1.1)' },
					'60%': { transform: 'rotate(-8deg) scale(1)' },
					'75%': { transform: 'rotate(8deg) scale(1.1)' },
					'85%': { transform: 'rotate(-6deg) scale(1)' },
					'92%': { transform: 'rotate(4deg) scale(1.05)' },
					'100%': { transform: 'rotate(0deg) scale(1)' },
				},
			},
			animation: {
				wiggle: 'wiggle 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
			},
		},
	},
	important: true,
	plugins: [],
};

export default config;
