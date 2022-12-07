import { getHexColorFromName } from '@traent/ts-utils';

export const defaultLabelColor = {
  text: getHexColorFromName('grey', 300),
  bg: getHexColorFromName('grey', 100),
};

export const getLabelColorFromHex = (color?: string) => {
  if (!color) {
    return defaultLabelColor;
  }
  const labelColor = labelColors.find((lc) => lc.text === color);
  return labelColor || { text: color, bg: defaultLabelColor.bg };
};

// Important:
// Since only the tag's text color is persisted, if we drop a value from the `labelColors` array
// we are not able to calculate the background of pre-existent tags (fallback to the default bg color).

export const labelColors = [
  defaultLabelColor,
  {
    text: getHexColorFromName('orange', 300),
    bg: getHexColorFromName('orange', 100),
  },
  {
    text: getHexColorFromName('red', 300),
    bg: getHexColorFromName('red', 100),
  },
  {
    text: getHexColorFromName('purple', 300),
    bg: getHexColorFromName('purple', 100),
  },
  {
    text: getHexColorFromName('violet', 300),
    bg: getHexColorFromName('violet', 100),
  },
  {
    text: getHexColorFromName('blue', 300),
    bg: getHexColorFromName('blue', 100),
  },
  {
    text: getHexColorFromName('ottanio', 300),
    bg: getHexColorFromName('ottanio', 100),
  },
  {
    text: getHexColorFromName('green', 300),
    bg: getHexColorFromName('green', 100),
  },
  {
    text: getHexColorFromName('lime', 200),
    bg: getHexColorFromName('lime', 100),
  },
  {
    text: getHexColorFromName('brown', 300),
    bg: getHexColorFromName('brown', 100),
  },
];
