export default [
  'button:enabled:not([readonly])',
  'select:enabled:not([readonly])',
  'textarea:enabled',
  'input:enabled:not([readonly])',

  'a[href]',
  'area[href]',

  'iframe',
  'object',
  'embed',

  '[tabindex]',
  '[contenteditable]',
  '[autofocus]',
];
