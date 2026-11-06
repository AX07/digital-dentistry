/** Tailwind config. Rebuild with `npm run build:css`.
 *  Colours are CSS variables set in index.html and clinic.config.js, so palettes change without a rebuild. */
const v = name => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: ['./index.html', './clinic.config.js', './assets/core.js'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: v('ink'), soft: v('ink-soft') },
        ground: v('ground'),
        surface: { DEFAULT: v('surface'), 2: v('surface-2') },
        accent: { DEFAULT: v('accent'), deep: v('accent-deep'), soft: v('accent-soft') },
        alt: { DEFAULT: v('alt'), soft: v('alt-soft') },
        'on-accent': v('on-accent'),
        deep: v('deep'),
      },
      fontFamily: { display: ['var(--font-display)'], sans: ['var(--font-body)'] },
      maxWidth: { frame: '1280px' },
    },
  },
};
