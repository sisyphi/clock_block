/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		screens: {
			xs: '525px',
			...defaultTheme.screens
		},
		extend: {
			colors: {
				offwhite: '#E8E5DE',
				offblack: '#333333'
			}
		}
	},
	plugins: []
};
