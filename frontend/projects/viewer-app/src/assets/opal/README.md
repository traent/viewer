# OPAL

> A SCSS utility's library


## Installation

Run `npm install`.

## Build library

Run `npm run build`.

This will generate a `dist` folder containing `index.css` file to use inside other applications.

## Glossary

* \<d\> = direction: `t` for top, `b` for bottom, `r` for right, `l` for left. Sometimes also `x` and `y` are supported.

* \<s\> = size: a number identifying the measure reference.

## Classes

### Text, background and border colors

```
DEF: (text|border)-<color>[-<shade>]
DEF: bg-<color>[-<shade>]
     optionally together with: bg-opacity-<s>
```
Examples of text, background and border classes:
```
text-primary, bg-accent-300, border-grey
```

Text, background and borders colors are set based on `<color>` and, optionally, `<shade>`.

`<shade>` is one of the material shades (100, 200, 300, ..., 900).

When `bg-<color>...` class is set, the color opacity can be altered adding `bg-opacity-<s>` class, where `<s>` represent the opacity percent (0-100).

### Margins and paddings

```
DEF: (m|p)[<d>]-[n-]<s>
```
Examples of padding and margin classes:
```
pt-3, mx-4, mt-auto, p-5, mb-n-2
```

Use `m` for margin and `p` for padding.

Optional direction is supported: `x` (left and right), `y` (top and bottom), `t`, `b`, `l`, `r`

Size refers to design guidelines and are calculated as `4px * <s>`, so `p-4` means `padding: 16px`.
 `auto` size is also supported.`

For negative values, use `n-` before size.

### Sizes

```
DEF: [w|h|s]-<s>
```
Examples of width, height and size classes:
```
w-30, h-3t, s-screen, s-10, s-inherit
```

Use `h` for height, `w` for width and `s` for both width and height.

[//]: # (FIXME: Following paragraph is a proposal)

Size can be expressed in pixel (number) or twelfths (`[1-12]t`).
For pixel no other suffix is required, for sizes in twelfths the `t` suffix is required, so `w-40` means `width: 40px` and `w-40t` means `width: (4 / 12 * 100)%`.

There are some particular sizes like: `auto`, `screen` (100vh or 100vw), `inherit`, `full` (100%)

### Sizes

```
DEF: [w|h|s]-<s>
```
Examples of width, height and size classes:
```
w-30, h-3t, s-screen, s-10, s-inherit
```

Use `h` for height, `w` for width and `s` for both width and height.

Size can be expressed in pixel (number) or twelfths (`[1-12]t`).
For pixel no other suffix is required, for sizes in twelfths the `t` suffix is required, so `w-40` means `width: 40px` and `w-40t` means `width: (4 / 12 * 100)%`.


There are some particular sizes like: `auto`, `screen` (100vh or 100vw), `inherit`, `full` (100%)


### Border radius

```
DEF: radius[-<d>]-<s>
```
Examples of width, height and size classes:
```
radius-0, radius-top-4, radius-right-12
```

Size can be 0, 2, 4, 8 or 12 (pixels).

Optional direction can be `top`, `bottom`, `left` and `right`.
If specified, 2 corners radius are set.

### Displays

```
DEF: d-(inline|block|inline-block|none)
```
Examples of display classes:
```
d-block, d-inline, d-none
```

For `display: flex` take a look to "Flex" utility section.

### Flex

```
DEF: fx[-r]-(row|column)
DEF: fx-align-(start|end|center|baseline|stretch)
DEF: fx-self-align-(start|end|center|baseline|stretch)
DEF: fx-b-<s>
DEF: fx-g-<s>
DEF: fx-s-<s>
DEF: fx-justify-(start|end|center|between|around|evenly)
DEF: fx-(wrap|nowrap|wrap-reverse)
```
Examples of flex classes:
```
fx-row, fx-r-row, fx-column, fx-r-column
fx-align-start, fx-align-end, fx-align-center
fx-self-align-start, fx-self-align-end, fx-self-align-center
fx-b-0, fx-b-1 (basis)
fx-g-1, fx-g-2 (grow)
fx-s-0, fx-s-1 (shrink)
fx-justify-start, fx-justify-end, fx-justify-center
fx-wrap, fx-nowrap, fx-wrap-reverse
```

The `fx-` classes refers to flex properties. The flex classes mapping is quite simple.

Please take a look to [this link](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) for all flex properties definitions.

### Glass

```
DEF: glass-(1...5)
```
Examples of glass classes:
```
glass-1, glass-2, glass-3
```

These classes add a backdrop filter to the element background for the glass effect.

### Overflow

```
DEF: overflow[-(x|y)]-(auto|hidden|visiblescroll)
```
Examples of overflow classes:
```
overflow-hidden, overflow-x-visible, overflow-y-scroll
```

These classes are responsible to set the overflow attribute(s)

### Positions

```
DEF: pos-(static|abs|fix|rel|sticky)
```
Examples of overflow classes:
```
pos-static, pos-abs, pos-fix
```

These classes are responsible to set the position attribute


### Shadows

```
DEF: shadow-(none|1|2|3)
```
Examples of shadow classes:
```
shadow-none, shadow-1, shadow-2
```
Apply the design style-guide shadows.

### Text

```
DEF: body-(1|2|3|4)
DEF: h(1...6)
DEF: text-(normal|uppercase|capitalize)
DEF: text-nowrap
DEF: text-(300|400|600|700|light|semi-bold|bold)
DEF: text-style-(normal|italic|oblique)
DEF: ellipsed
```
Examples of text-style classes:
```
text-left, text-right, text-center
body-1, body-2, body-3, body-4
h1, h2, h3
text-no-case, text-uppercase, text-capitalize
text-nowrap
text-300, text-400, text-semi-bold
text-style-italic, text-style-normal
ellipsed
```

The semantic of the text classes is the following

* `text-(left|right|center|justify)`: apply the relative text alignment style
* `body-(1|2|3|4)`: apply the relative body text style as described in the styleguide
* `h(1...6)`: apply the relative heading text style as described in the styleguide. By default `<h1>, <h2> ...` HTML tags are styled as `.h(1...6)`.
* `text-(no-case|uppercase|capitalize)`: apply the case transformation attribute (value `none` is used with `"no-case"` text to avoid conflicts)
* `text-nowrap`: Set the `white-space: nowrap` attribute
* `text-(300|400|600|700|light|semi-bold|bold)`: apply font-weight attribute
* `ellipsed`: show the text as single-line overflow ellipsis

### Z-index

```
DEF: z-index-(0|1|...|40)
```
Examples of z-index classes:
```
z-index-0, z-index-1, z-index-2
```
Set the z-index attribute.
