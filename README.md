# react-texty

A straight forward text component with tooltip support when it's truncated

## Install

```bash
# Yarn
yarn add react-texty

# NPM
npm install --save react-texty
```

## Props

- **tagName** `string` Tag name for the component, defaults to `div`
- **children** `node`, Should be string or inline element
- **tooltip** `node` Tooltip for the truncated text if set, or the children will be used
- **tooltipClassName** `string` Classname for the tooltip
- **tooltipStyle** `object` Style for the tooltip
- **tooltipMaxWidth** `number` Max width of the tooltip, defaults to `300`
- **showDelay** `number` Delay milliseconds to show when mouse enter, defaults to `150`
- **hideDelay** `number` Delay milliseconds to hide when mouse leave, defaults to `150`
- **hideArrow** `bool` Whether to show the tooltip arrow, defaults to `false`
- **placement** `top|top-start|top-end|bottom|bottom-start|bottom-end` The placement of the tooltip, defaults to `top`
- **container** `HTMLElement` The HTML Element to append the tooltip, defaults to `document.body`

**In most cases you don't need to set the `container` manually**

## Usage

```jsx
import Text from 'react-texty'
// import the styles
import 'react-texty/styles.css'

// just use it as a normal text node
<Text>Hello world</Text>
<Text tagName="a">Hello world</Text>
<Text tooltip="Something else">Hello world</Text>
```

## License

MIT © [Neo Nie](https://github.com/nihgwu)
