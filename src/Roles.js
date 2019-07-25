import _ from 'lodash';

/**
 * Various accessibility roles (see https://www.w3.org/TR/wai-aria/roles for details)
 */
const ROLES = {
  NONE: 'none', // special role meaning that there is no particular ARIA role assigned (e.g. a generic container, displayed text)

  // widgets or composite widgets
  ALERT: 'alert',
  ALERTDIALOG: 'alertdialog',
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
  DIALOG: 'dialog',
  GRIDCELL: 'gridcell',
  LINK: 'link',
  LOG: 'log',
  MARQUEE: 'marquee',
  MENUITEM: 'menuitem',
  MENUITEMCHECKBOX: 'menuitemcheckbox',
  MENUITEMRADIO: 'menuitemradio',
  MULTILINETEXTBOX: 'multilinetextbox',
  OPTION: 'option',
  PROGRESSBAR: 'progressbar',
  RADIO: 'radio',
  SCROLLBAR: 'scrollbar',
  SEARCHBOX: 'searchbox',
  SINGLELINETEXTBOX: 'singlelinetextbox',
  SLIDER: 'slider',
  SPINBUTTON: 'spinbutton',
  STATUS: 'status',
  SWITCH: 'switch',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  TIMER: 'timer',
  TOOLTIP: 'tooltip',
  TREEITEM: 'treeitem',

  // composite widgets
  COMBOBOX: 'combobox',
  GRID: 'grid',
  MULTISELECTLISTBOX: 'multiselectlistbox',
  SINGLESELECTLISTBOX: 'singleselectlistbox',
  MENU: 'menu',
  MENUBAR: 'menubar',
  RADIOGROUP: 'radiogroup',
  TABLIST: 'tablist',
  TREE: 'tree',
  TREEGRID: 'treegrid',

  // document structure
  ARTICLE: 'article',
  COLUMNHEADER: 'columnheader',
  CELL: 'cell',
  DEFINITION: 'definition',
  DIRECTORY: 'directory',
  DOCUMENT: 'document',
  FEED: 'feed',
  GROUP: 'group',
  HEADING1: 'heading1', // the aria role is just "heading" but to convert the role to a tag, the additional information of which level is needed as well
  HEADING2: 'heading2',
  HEADING3: 'heading3',
  HEADING4: 'heading4',
  HEADING5: 'heading5',
  HEADING6: 'heading6',
  IMG: 'img',
  UNORDEREDLIST: 'unorderedlist',
  ORDEREDLIST: 'orderedlist',
  LISTITEM: 'listitem',
  MATH: 'math',
  NOTE: 'note',
  PRESENTATION: 'presentation',
  PARAGRAPH: 'paragraph',
  REGION: 'region',
  ROW: 'row',
  ROWGROUP: 'rowgroup',
  ROWHEADER: 'rowheader',
  SEPARATOR: 'separator',
  TABLE: 'table',
  TABLEBODY: 'tableBody',
  TABLEFOOT: 'tableFoot',
  TABLEHEAD: 'tableHead',
  TERM: 'term',
  TOOLBAR: 'toolbar',
  FIGURE: 'figure',
  FIGCAPTION: 'figcaption',

  // landmarks
  APPLICATION: 'application',
  BANNER: 'banner',
  COMPEMENTARY: 'complementary',
  CONTENTINFO: 'contentinfo',
  FORM: 'form',
  MAIN: 'main',
  NAVIGATION: 'navigation',
  SEARCH: 'search',

  // support for formatted text
  SPAN: 'span',
  FORMAT_TEXT_BOLD: 'bold',
  FORMAT_TEXT_CODE: 'code',
  FORMAT_TEXT_DELETE: 'delete',
  FORMAT_TEXT_EMPHASIZE: 'emphasize',
  FORMAT_TEXT_ITALIC: 'italic',
  FORMAT_TEXT_INSERT: 'insert',
  FORMAT_TEXT_KBD: 'keybordtext',
  FORMAT_TEXT_PREFORMAT: 'preformated',
  FORMAT_TEXT_STRIKETHROUGH: 'strikethrough',
  FORMAT_TEXT_SAMPLE: 'sample',
  FORMAT_TEXT_SMALL: 'small',
  FORMAT_TEXT_STRONG: 'strong',
  FORMAT_TEXT_SUBSCRIPT: 'subscript',
  FORMAT_TEXT_SUPERSCRIPT: 'superscript',
  FORMAT_TEXT_TIME: 'time',
  FORMAT_TEXT_UNDERLINE: 'underline',
  FORMAT_TEXT_VARIABLE: 'variable',
};
Object.freeze(ROLES);

// roles not present in here use <div>
const ROLE_TAG_MAPPING = {
  article: 'article',
  button: 'button',
  link: 'a',
  form: 'form',
  option: 'option',
  img: 'img',
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  heading4: 'h4',
  heading5: 'h5',
  heading6: 'h6',
  menubar: 'ul',
  menu: 'ul',
  menuitem: 'li',
  multiselectlistbox: 'select',
  singleselectlistbox: 'select',
  singlelinetextbox: 'input',
  multilinetextbox: 'textarea',
  unorderedlist: 'ul',
  orderedlist: 'ol',
  listitem: 'li',
  menuitemcheckbox: 'li',
  menuitemradio: 'li',
  checkbox: 'input',
  radio: 'input',
  searchbox: 'input',
  slider: 'input',
  spinbutton: 'input',
  switch: 'button',
  table: 'table',
  tableBody: 'tbody',
  tableFoot: 'tfoot',
  tableHead: 'thead',
  row: 'tr',
  columnheader: 'th',
  rowheader: 'th',
  cell: 'td',
  progressbar: 'progress',
  grid: 'table',
  gridcell: 'td',
  figure: 'figure',
  figcaption: 'figcaption',
  tree: 'ul',
  treegrid: 'table',
  treeitem: 'li',
  separator: 'hr',
  definition: 'dd',
  term: 'dt',
  navigation: 'nav',
  bold: 'b',
  code: 'code',
  delete: 'del',
  emphasize: 'em',
  italic: 'i',
  insert: 'ins',
  keybordtext: 'kbd',
  paragraph: 'p',
  preformated: 'pre',
  strikethrough: 's',
  sample: 'samp',
  small: 'small',
  strong: 'strong',
  subscript: 'sub',
  superscript: 'sup',
  time: 'time',
  underline: 'u',
  variable: 'var',
  span: 'span',
  contentinfo: 'footer',
  complementary: 'aside',
  timer: 'time',
  main: 'main',
};
Object.freeze(ROLE_TAG_MAPPING);

/**
 * Determines the HTML tag name for a DisplayObject based on its accessibility information
 * @param {!createjs.DisplayObject} displayObject - DisplayObject to determine the tag to use
 * @return {String} HTML tag name
 */
function getTagNameForDisplayObject(displayObject) {
  const role = _.get(displayObject, 'accessible.role', ROLES.NONE);
  let tagName = ROLE_TAG_MAPPING[role] || 'div';

  if (role === ROLES.MENUITEM && displayObject.accessible.parent.role === ROLES.MENUITEM) {
    // the DisplayObject is for a popup menu (e.g. child of a menu bar), so this DisplayObject
    // is grouping the label and menu
    tagName = 'span';
  }

  return tagName;
}

export { ROLES, getTagNameForDisplayObject };
