import { AttributeName, Attributes, createElement, EventListeners } from "../../dom";

/**
 * Various accessibility roles (see https://www.w3.org/TR/wai-aria/roles for details)
 */
 export const Role: Readonly<Record<string, string>> = {
  // special role meaning that there is no particular aria role assigned (e.g. a generic container, displayed text)
  none: 'none',

  // widgets or composite widgets
  alert: 'alert',
  alertdialog: 'alertdialog',
  button: 'button',
  checkbox: 'checkbox',
  dialog: 'dialog',
  gridcell: 'gridcell',
  link: 'link',
  log: 'log',
  marquee: 'marquee',
  menuitem: 'menuitem',
  menuitemcheckbox: 'menuitemcheckbox',
  menuitemradio: 'menuitemradio',
  multilinetextbox: 'multilinetextbox',
  singleselectoption: 'singleselectoption',
  multiselectoption: 'multiselectoption',
  progressbar: 'progressbar',
  radio: 'radio',
  scrollbar: 'scrollbar',
  searchbox: 'searchbox',
  singlelinetextbox: 'singlelinetextbox',
  slider: 'slider',
  spinbutton: 'spinbutton',
  status: 'status',
  switch: 'switch',
  tab: 'tab',
  tabpanel: 'tabpanel',
  timer: 'timer',
  tooltip: 'tooltip',
  treeitem: 'treeitem',

  // composite widgets
  combobox: 'combobox',
  grid: 'grid',
  multiselectlistbox: 'multiselectlistbox',
  singleselectlistbox: 'singleselectlistbox',
  menu: 'menu',
  menubar: 'menubar',
  radiogroup: 'radiogroup',
  tablist: 'tablist',
  tree: 'tree',
  treegrid: 'treegrid',

  // document structure
  article: 'article',
  columnheader: 'columnheader',
  cell: 'cell',
  definition: 'definition',
  directory: 'directory',
  document: 'document',
  feed: 'feed',
  group: 'group',
  heading: 'heading',
  img: 'img',
  unorderedlist: 'unorderedlist',
  orderedlist: 'orderedlist',
  listitem: 'listitem',
  math: 'math',
  note: 'note',
  presentation: 'presentation',
  paragraph: 'paragraph',
  region: 'region',
  row: 'row',
  rowheader: 'rowheader',
  separator: 'separator',
  table: 'table',
  tablebody: 'tablebody',
  tablefoot: 'tablefoot',
  tablehead: 'tablehead',
  term: 'term',
  toolbar: 'toolbar',
  figure: 'figure',
  figcaption: 'figcaption',

  // landmarks
  application: 'application',
  banner: 'banner',
  compementary: 'complementary',
  contentinfo: 'contentinfo',
  form: 'form',
  main: 'main',
  navigation: 'navigation',
  search: 'search',

  // support for formatted text
  span: 'span',
  format_text_bold: 'bold',
  format_text_code: 'code',
  format_text_delete: 'delete',
  format_text_emphasize: 'emphasize',
  format_text_italic: 'italic',
  format_text_insert: 'insert',
  format_text_kbd: 'keybordtext',
  format_text_preformat: 'preformated',
  format_text_strikethrough: 'strikethrough',
  format_text_sample: 'sample',
  format_text_small: 'small',
  format_text_strong: 'strong',
  format_text_subscript: 'subscript',
  format_text_superscript: 'superscript',
  format_text_time: 'time',
  format_text_underline: 'underline',
  format_text_variable: 'variable',
};

export type AriaRole = keyof typeof Role;

export interface RoleElementDescriptor {
  allowedChildren: AriaRole[];
  allowedAttributes: AttributeName[];
  requiredAttributes: AttributeName[];
  tagName: string | ((attributes: Attributes) => string);
}

export type RoleElementDescriptorMapping = {
  [key in AriaRole]: RoleElementDescriptor;
};

export const RoleMapping: Readonly<RoleElementDescriptorMapping> =
  createRoleToElementMapping({
    none: {
      allowedChildren: Object.keys(Role),
      allowedAttributes: [],
      requiredAttributes: [],
      tagName: 'div',
    },
    button: {
      allowedChildren: [],
      allowedAttributes: ['ariaPressed'],
      requiredAttributes: [],
      tagName: 'button',
    },
  });

export function createRoleToElementMapping(
  roleElementDescriptors: RoleElementDescriptorMapping
): RoleElementDescriptorMapping {
  for (const [role, descriptor] of Object.entries(roleElementDescriptors)) {
    const { allowedChildren, allowedAttributes, requiredAttributes, tagName } =
      descriptor;

    roleElementDescriptors[role] = {
      allowedChildren: allowedChildren,
      allowedAttributes: allowedAttributes.concat(sharedAllowedAttributes),
      requiredAttributes: requiredAttributes.concat(sharedRequiredAttributes),
      tagName,
    };
  }

  return roleElementDescriptors;
}

export const sharedRequiredAttributes = ['id', 'role'] as AttributeName[];

export const sharedAllowedAttributes = [
  'dir',
  'label',
  'lang',
  'tabIndex',
  'title',
  'autofocus',
  'ariaExpanded',
] as AttributeName[];

