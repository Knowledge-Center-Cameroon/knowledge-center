# Aptos webfont

Place the Aptos webfont files you are licensed to use in this folder.

Expected filenames (variable fonts recommended):
- Aptos-Variable.woff2 (normal/roman)
- Aptos-Italic-Variable.woff2 (italic)

If you only have static weights, you can use these names instead and adjust CSS accordingly:
- Aptos-Regular.woff2
- Aptos-Italic.woff2
- Aptos-Bold.woff2
- Aptos-BoldItalic.woff2

Why this is needed:
- Browsers and devices that don’t have Aptos installed will download these webfonts from your site so your typography stays consistent.
- Ensure you have the right to self-host Aptos. If not, use an Adobe Fonts kit that includes Aptos and replace the @font-face src URLs with the kit URLs.
