const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
	content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-manrope)", ...fontFamily.sans],
			},
		},
	},
	plugins: [],
}
