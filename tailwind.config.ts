import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			/* Typography System: Poppins for headings (h1-h6), Montserrat for body/ui text */
			fontFamily: {
				'sans': ['Montserrat', 'system-ui', 'Segoe UI', 'sans-serif'],
				'heading': ['Poppins', 'system-ui', 'Segoe UI', 'sans-serif'],
				'body': ['Montserrat', 'system-ui', 'Segoe UI', 'sans-serif'],
			},
			fontSize: {
				/* Semantic heading scale: 96/80/64/48/36/24/20/16/14/12px */
				'h1': ['2.75rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
				'h2': ['2.25rem', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.01em' }],
				'h3': ['1.875rem', { lineHeight: '1.3', fontWeight: '700' }],
				'h4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
				'h5': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
				'h6': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
				'body-lg': ['1.0625rem', { lineHeight: '1.6', fontWeight: '400' }],
				'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
				'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
				'body-xs': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Brand colors
				'kc-blue': {
					DEFAULT: 'hsl(var(--kc-blue))',
					dark: 'hsl(var(--kc-blue-dark))',
					light: 'hsl(var(--kc-blue-light))'
				},
				'kc-red': {
					DEFAULT: 'hsl(var(--kc-red))',
					dark: 'hsl(var(--kc-red-dark))',
					light: 'hsl(var(--kc-red-light))'
				},
				'kc-black': 'hsl(var(--kc-black))',
				'kc-gray': 'hsl(var(--kc-gray))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				/* Consistent spacing scale: 4px grid */
				'0.5': '0.125rem',
				'1': '0.25rem',
				'2': '0.5rem',
				'3': '0.75rem',
				'4': '1rem',
				'6': '1.5rem',
				'8': '2rem',
				'12': '3rem',
				'16': '4rem',
				'20': '5rem',
				'24': '6rem',
			},
			gap: {
				/* Consistent gap/gap utilities */
				'2': '0.5rem',
				'3': '0.75rem',
				'4': '1rem',
				'6': '1.5rem',
				'8': '2rem',
				'12': '3rem',
				'16': '4rem',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				/* Subtle hover and fade animations */
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'slide-up': {
					from: { transform: 'translateY(4px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out'
			},
			/* Shadow scale: professional depth hierarchy */
			boxShadow: {
				'elegant': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				'card': '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
				'hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
				'elevated': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
