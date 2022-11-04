/** @type {import('tailwindcss').Config} */

const tw_colors = require('tailwindcss/colors')

module.exports = {
  important: true,
  prefix: 'tw-',
  content: [
    './projects/dashboard-esg/**/*.{html,ts}',
    './projects/viewer-app/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': 'Source Sans Pro, sans-serif',
        'emoji': 'Twemoji Mozilla',
        'content': 'Source Sans Pro',
        'brand': 'DM Sans',
        'code': 'Source Code Pro, monospace',
        'mono': 'DM Mono, monospace',
        'logo': 'TTFors',
      },
      colors: {
        // useful for old/opal naming
        grey: tw_colors.neutral,
        gray: {
          ...tw_colors.neutral,
          1: tw_colors.neutral['100'],
          2: tw_colors.neutral['200'],
          3: tw_colors.neutral['300'],
          4: tw_colors.neutral['400'],
          5: tw_colors.neutral['500'],
          6: tw_colors.neutral['600'],
        },
        red: {
          ...tw_colors.red,
          1: tw_colors.red['100'],
          2: tw_colors.red['200'],
          3: tw_colors.red['300'],
          4: tw_colors.red['400'],
          5: tw_colors.red['500'],
          6: tw_colors.red['600'],
        },
        orange: {
          ...tw_colors.orange,
          1: tw_colors.orange['100'],
          2: tw_colors.orange['200'],
          3: tw_colors.orange['300'],
          4: tw_colors.orange['400'],
          5: tw_colors.orange['500'],
          6: tw_colors.orange['600'],
        },
        yellow: {
          ...tw_colors.yellow,
          1: tw_colors.yellow['100'],
          2: tw_colors.yellow['200'],
          3: tw_colors.yellow['300'],
          4: tw_colors.yellow['400'],
          5: tw_colors.yellow['500'],
          6: tw_colors.yellow['600'],
        },
        green: {
          ...tw_colors.green,
          1: tw_colors.green['100'],
          2: tw_colors.green['200'],
          3: tw_colors.green['300'],
          4: tw_colors.green['400'],
          5: tw_colors.green['500'],
          6: tw_colors.green['600'],
        },
        neutral: {
          ...tw_colors.neutral,
          2: tw_colors.neutral['50'],
        },
        coolgrey: tw_colors.gray,
        primary: {
          5: tw_colors.black,
          500: tw_colors.black,
          'DEFAULT': tw_colors.black,
        },
        accent: {
          ...tw_colors.sky,
          1: tw_colors.sky['100'],
          2: tw_colors.sky['200'],
          3: tw_colors.sky['300'],
          4: tw_colors.sky['400'],
          5: tw_colors.sky['500'],
          6: tw_colors.sky['600'],
          7: tw_colors.sky['700'],
          'DEFAULT': tw_colors.sky['500'],
        },
        warn: {
          ...tw_colors.red,
          5: tw_colors.red['500'],
          6: tw_colors.red['600'],
          7: tw_colors.red['700'],
        },
        transparent: {
          500: tw_colors.transparent,
          'DEFAULT': tw_colors.transparent,
        },
        // temporary workaround to keep using same vars as opal
        black: {
          'DEFAULT': tw_colors.black,
          5: tw_colors.black,
          500: tw_colors.black,
        },
        white: {
          'DEFAULT': tw_colors.white,
          5: tw_colors.white,
          500: tw_colors.white,
        },
        grey: {
          ...tw_colors.neutral,
          1: tw_colors.neutral['100'],
          2: tw_colors.neutral['200'],
          3: tw_colors.neutral['300'],
          4: tw_colors.neutral['400'],
          5: tw_colors.neutral['500'],
          6: tw_colors.neutral['600'],
          'DEFAULT': tw_colors.neutral["600"],
        },
        // to be removed after full tw migration, using shades on b/w is pointless

        // temporary workaround to keep using same vars as opal (better traent color name and shades below)
        traentblue: {
          50: '#eaeffd',
          100: '#cad6fa',
          200: '#aabdf6',
          300: '#89a4f3',
          400: '#698bf0',
          500: '#2859e9',
          600: '#1647d7',
          700: '#133cb7',
          800: '#0f3296',
          900: '#091c56',
        },
        traentwhite: {
          500: '#F4FAFF',
        },
        traentblack: {
          500: '#222222',
        },
        // to be removed after opal is removed

        iris: {
          50: '#f7f8fe',
          100: '#dbe1fb',
          200: '#c0caf8',
          300: '#a4b2f5',
          400: '#899bf1',
          500: '#526deb',
          600: '#3756e8',
          700: '#1b3fe5',
          800: '#1737ca',
          900: '#142fae',
        },
        ottanio: {
          50: '#d0f5fa',
          100: '#E0F6F8',
          200: '#b4eff7',
          300: '#98e9f5',
          400: '#7de4f2',
          500: '#13A4B8',
          600: '#17c5dd',
          700: '#14adc1',
          800: '#1194a6',
          900: '#0e7b8a'
        },
        brown: {
          50:  '#fff6ee',
          100: '#fbddc2',
          200: '#f1bf9a',
          300: '#eaa26e',
          400: '#e48541',
          500: '#a75418',
          600: '#7a3e12',
          700: '#4e270b',
          800: '#211105Z',
          900: '#211105',
        },
        traent: {
          50: '#eaeffd',
          100: '#cad6fa',
          200: '#aabdf6',
          300: '#89a4f3',
          400: '#698bf0',
          500: '#2859e9',
          600: '#1647d7',
          700: '#133cb7',
          800: '#0f3296',
          900: '#091c56',
          white: '#F4FAFF',
          black: '#222222',
        },
      },
      borderWidth: {
        1: '1px',
      },
      // old sizes, shouldn't be used
      boxShadow: {
        1: '0 0 4px #0000001a',
        2: '0 0 5px #0003',
        3: '0 0 6px #0000004d',
      },
      opacity: {
        '15': '.15',
        '35': '.35',
        '45': '.45',
        '55': '.55',
        '65': '.65',
        '85': '.85',
      },
    },
  },
  plugins: [
    // create css vars inside `:root` with the full palette
    function ({ addBase, theme }) {
      // suggested prefix after migration: `color` or `tw-color`
      function extractColorVars (colorObj, colorGroup = '', prefix = 'opal') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];
          const cssVariable = colorKey === "DEFAULT" ? `--${prefix}${colorGroup}` : `--${prefix}${colorGroup}-${colorKey}`;
          // const cssVariable = colorKey === "DEFAULT" ? `--${colorGroup}` : `--${colorGroup}-${colorKey}`;

          const newVars =
            typeof value === 'string'
              ? { [cssVariable]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    },
  ],
}
