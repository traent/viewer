/** @type {import('tailwindcss').Config} */

const tw_traent = require('../../../../apps/projects/traent-design-system/tailwind/tw-base-theme');
const tw_plugins = require('../../../../apps/projects/traent-design-system/tailwind/tw-plugins');

module.exports = {
  prefix: 'tw-',
  content: [
    "./projects/viewer-app/src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      ...tw_traent.theme,
      colors: {
        ...tw_traent.theme.colors,
        // TODO: to be removed after opal removal
        grey: tw_traent.theme.colors.neutral,
        gray: {
          ...tw_traent.theme.colors.neutral,
          1: tw_traent.theme.colors.neutral['100'],
          2: tw_traent.theme.colors.neutral['200'],
          3: tw_traent.theme.colors.neutral['300'],
          4: tw_traent.theme.colors.neutral['400'],
          5: tw_traent.theme.colors.neutral['500'],
          6: tw_traent.theme.colors.neutral['600'],
        },
        red: {
          ...tw_traent.theme.colors.red,
          1: tw_traent.theme.colors.red['100'],
          2: tw_traent.theme.colors.red['200'],
          3: tw_traent.theme.colors.red['300'],
          4: tw_traent.theme.colors.red['400'],
          5: tw_traent.theme.colors.red['500'],
          6: tw_traent.theme.colors.red['600'],
        },
        orange: {
          ...tw_traent.theme.colors.orange,
          1: tw_traent.theme.colors.orange['100'],
          2: tw_traent.theme.colors.orange['200'],
          3: tw_traent.theme.colors.orange['300'],
          4: tw_traent.theme.colors.orange['400'],
          5: tw_traent.theme.colors.orange['500'],
          6: tw_traent.theme.colors.orange['600'],
        },
        yellow: {
          ...tw_traent.theme.colors.yellow,
          1: tw_traent.theme.colors.yellow['100'],
          2: tw_traent.theme.colors.yellow['200'],
          3: tw_traent.theme.colors.yellow['300'],
          4: tw_traent.theme.colors.yellow['400'],
          5: tw_traent.theme.colors.yellow['500'],
          6: tw_traent.theme.colors.yellow['600'],
        },
        green: {
          ...tw_traent.theme.colors.green,
          1: tw_traent.theme.colors.green['100'],
          2: tw_traent.theme.colors.green['200'],
          3: tw_traent.theme.colors.green['300'],
          4: tw_traent.theme.colors.green['400'],
          5: tw_traent.theme.colors.green['500'],
          6: tw_traent.theme.colors.green['600'],
        },
        neutral: {
          ...tw_traent.theme.colors.neutral,
          2: tw_traent.theme.colors.neutral['50'],
        },
        coolgrey: tw_traent.theme.colors.gray,
        primary: {
          5: tw_traent.theme.colors.black,
          500: tw_traent.theme.colors.black,
          'DEFAULT': tw_traent.theme.colors.black,
        },
        accent: {
          ...tw_traent.theme.colors.sky,
          1: tw_traent.theme.colors.sky['100'],
          2: tw_traent.theme.colors.sky['200'],
          3: tw_traent.theme.colors.sky['300'],
          4: tw_traent.theme.colors.sky['400'],
          5: tw_traent.theme.colors.sky['500'],
          6: tw_traent.theme.colors.sky['600'],
          7: tw_traent.theme.colors.sky['700'],
          'DEFAULT': tw_traent.theme.colors.sky['500'],
        },
        warn: {
          ...tw_traent.theme.colors.red,
          5: tw_traent.theme.colors.red['500'],
          6: tw_traent.theme.colors.red['600'],
          7: tw_traent.theme.colors.red['700'],
        },
        transparent: { ...tw_traent.theme.colors.transparent },
        // temporary workaround to keep using same vars as opal
        black: {
          ...tw_traent.theme.colors.black,
          5: tw_traent.theme.colors.black['500'],
        },
        white: {
          ...tw_traent.theme.colors.white,
          5: tw_traent.theme.colors.white['500'],
        },
        grey: {
          ...tw_traent.theme.colors.neutral,
          1: tw_traent.theme.colors.neutral['100'],
          2: tw_traent.theme.colors.neutral['200'],
          3: tw_traent.theme.colors.neutral['300'],
          4: tw_traent.theme.colors.neutral['400'],
          5: tw_traent.theme.colors.neutral['500'],
          6: tw_traent.theme.colors.neutral['600'],
          'DEFAULT': tw_traent.theme.colors.neutral["600"],
        },
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({ ':root': { ...tw_plugins.extractPalette(theme('colors')) } });
    },
  ],
}
