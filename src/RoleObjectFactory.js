import _ from 'lodash';
import { ROLES } from './Roles';
import CompositeData from './RoleObjects/CompositeData';

// role objects in alphabetical order by class name
import AccessibilityObject from './RoleObjects/AccessibilityObject';
import ArticleData from './RoleObjects/ArticleData';
import ButtonData from './RoleObjects/ButtonData';
import CellData from './RoleObjects/CellData';
import CheckBoxData from './RoleObjects/CheckBoxData';
import DialogData from './RoleObjects/DialogData';
import DocumentData from './RoleObjects/DocumentData';
import FormData from './RoleObjects/FormData';
import ImgData from './RoleObjects/ImgData';
import GridData from './RoleObjects/GridData';
import GridCellData from './RoleObjects/GridCellData';
import GroupData from './RoleObjects/GroupData';
import HeadingData from './RoleObjects/HeadingData';
import LinkData from './RoleObjects/LinkData';
import ListItemData from './RoleObjects/ListItemData';
import MathData from './RoleObjects/MathData';
import MenuBarData from './RoleObjects/MenuBarData';
import MenuData from './RoleObjects/MenuData';
import MenuItemData from './RoleObjects/MenuItemData';
import MenuItemCheckBoxData from './RoleObjects/MenuItemCheckBoxData';
import MenuItemRadioData from './RoleObjects/MenuitemRadioData';
import MultiLineTextBoxData from './RoleObjects/MultiLineTextBoxData';
import MultiSelectListBoxData from './RoleObjects/MultiSelectListBoxData';
import OptionData from './RoleObjects/OptionData';
import OrderedListData from './RoleObjects/OrderedListData';
import ProgressData from './RoleObjects/ProgressBarData';
import RadioData from './RoleObjects/RadioData';
import RadioGroupData from './RoleObjects/RadioGroupData';
import RowData from './RoleObjects/RowData';
import ScrollBarData from './RoleObjects/ScrollBarData';
import SearchBoxData from './RoleObjects/SearchBoxData';
import SectionData from './RoleObjects/SectionData';
import SeparatorData from './RoleObjects/SeparatorData';
import SingleLineTextBoxData from './RoleObjects/SingleLineTextBoxData';
import SingleSelectListBoxData from './RoleObjects/SingleSelectListBoxData';
import SliderData from './RoleObjects/SliderData';
import SpinButtonData from './RoleObjects/SpinButtonData';
import SwitchData from './RoleObjects/SwitchData';
import TabData from './RoleObjects/TabData';
import TableData from './RoleObjects/TableData';
import TableHeaderData from './RoleObjects/TableHeaderData';
import TabListData from './RoleObjects/TabListData';
import TimerData from './RoleObjects/TimerData';
import TreeData from './RoleObjects/TreeData';
import TreeItemData from './RoleObjects/TreeItemData';
import ToolBarData from './RoleObjects/ToolBarData';

/**
 * Adds the appropriate AccessibilityObject or one of its subclasses for the given role to
 * the provided DisplayObject for annotating the DisplayObject with accessibility information.
 * @param { Object} config - config oject for accessibility information
 * @param {createjs.DisplayObject} config.displayObject
 *  DisplayObject to add accessibility annotations to
 * @param {String} config.role - Entry from ROLES for which WAI-ARIA role the DisplayObject performs
 * @param {number} [config.containerIndex] - An optional value for the layer index to
 * add the DisplayObject
 * @param {String} [config.domIdPrefix] - Optional parameter for the prefix to use for the DOM
 * id in the translated display object.  Defaults to 'acc_'
 * @param {Object} [config.events] - event object with field eventName and listener to bind event while registering displayObject
 * @param {createjs.DisplayObject} [config.parent] - DisplayObject to add the current
 * DisplayObject to as a child. Note the order of registration is important, the parent
 * object will need to be registered with the module before the child.
 */
function createAccessibilityObjectForRole(config) {
  const {
    accessibleOptions,
    containerIndex,
    displayObject,
    domIdPrefix = 'acc_',
    events,
    parent,
    role,
  } = config;

  if (!displayObject) {
    throw new Error('No DisplayObject specified.');
  }

  if (parent && !parent.accessible) {
    throw new Error('The parent object must be registered with the module.');
  }

  if (displayObject.accessible) {
    // todo: allow changing the role of a DisplayObject
  }

  let accessibilityObject;
  switch (role) {
    // roles resulting in AccessibilityObject in alphabetical order by enum entry
    case ROLES.FIGCAPTION:
    case ROLES.FORMAT_TEXT_BOLD:
    case ROLES.FORMAT_TEXT_CODE:
    case ROLES.FORMAT_TEXT_DELETE:
    case ROLES.FORMAT_TEXT_EMPHASIZE:
    case ROLES.FORMAT_TEXT_ITALIC:
    case ROLES.FORMAT_TEXT_INSERT:
    case ROLES.FORMAT_TEXT_KBD:
    case ROLES.FORMAT_TEXT_PREFORMAT:
    case ROLES.FORMAT_TEXT_STRIKETHROUGH:
    case ROLES.FORMAT_TEXT_SAMPLE:
    case ROLES.FORMAT_TEXT_SMALL:
    case ROLES.FORMAT_TEXT_STRONG:
    case ROLES.FORMAT_TEXT_SUBSCRIPT:
    case ROLES.FORMAT_TEXT_SUPERSCRIPT:
    case ROLES.FORMAT_TEXT_TIME:
    case ROLES.FORMAT_TEXT_UNDERLINE:
    case ROLES.FORMAT_TEXT_VARIABLE:
    case ROLES.HEADING1:
    case ROLES.HEADING2:
    case ROLES.HEADING3:
    case ROLES.HEADING4:
    case ROLES.HEADING5:
    case ROLES.HEADING6:
    case ROLES.MAIN:
    case ROLES.NONE:
    case ROLES.PARAGRAPH:
    case ROLES.PRESENTATION:
    case ROLES.SPAN:
    case ROLES.SEARCH:
    case ROLES.TABLEBODY:
    case ROLES.TABLEFOOT:
    case ROLES.TABLEHEAD:
      accessibilityObject = new AccessibilityObject(displayObject, role, domIdPrefix);
      break;

      // rest of the roles in alphabetical order by its class entry

    case ROLES.APPLICATION:
      accessibilityObject = new CompositeData(displayObject, role, domIdPrefix);
      break;

    case ROLES.ARTICLE:
      accessibilityObject = new ArticleData(displayObject, role, domIdPrefix);
      break;

    case ROLES.BUTTON:
      accessibilityObject = new ButtonData(displayObject, role, domIdPrefix);
      break;

    case ROLES.CELL:
      accessibilityObject = new CellData(displayObject, role, domIdPrefix);
      break;

    case ROLES.CHECKBOX:
      accessibilityObject = new CheckBoxData(displayObject, role, domIdPrefix);
      break;

    case ROLES.DIALOG:
      accessibilityObject = new DialogData(displayObject, role, domIdPrefix);
      break;

    case ROLES.DOCUMENT:
      accessibilityObject = new DocumentData(displayObject, role, domIdPrefix);
      break;

    case ROLES.FORM:
      accessibilityObject = new FormData(displayObject, role, domIdPrefix);
      break;

    case ROLES.GRID:
    case ROLES.TREEGRID:
      accessibilityObject = new GridData(displayObject, role, domIdPrefix);
      break;

    case ROLES.GRIDCELL:
      accessibilityObject = new GridCellData(displayObject, role, domIdPrefix);
      break;

    case ROLES.GROUP:
      accessibilityObject = new GroupData(displayObject, role, domIdPrefix);
      break;

    case ROLES.HEADING1: // eslint-disable-line no-duplicate-case
    case ROLES.HEADING2: // eslint-disable-line no-duplicate-case
    case ROLES.HEADING3: // eslint-disable-line no-duplicate-case
    case ROLES.HEADING4: // eslint-disable-line no-duplicate-case
    case ROLES.HEADING5: // eslint-disable-line no-duplicate-case
    case ROLES.HEADING6: // eslint-disable-line no-duplicate-case
      accessibilityObject = new HeadingData(displayObject, role, domIdPrefix);
      break;

    case ROLES.IMG:
      accessibilityObject = new ImgData(displayObject, role, domIdPrefix);
      break;

    case ROLES.LINK:
      accessibilityObject = new LinkData(displayObject, role, domIdPrefix);
      break;

    case ROLES.LISTITEM:
      accessibilityObject = new ListItemData(displayObject, role, domIdPrefix);
      break;

    case ROLES.MATH:
      accessibilityObject = new MathData(displayObject, role, domIdPrefix);
      break;
    case ROLES.MENU:
      accessibilityObject = new MenuData(displayObject, role, domIdPrefix);
      break;

    case ROLES.MENUBAR:
      accessibilityObject = new MenuBarData(displayObject, role, domIdPrefix);
      break;

    case ROLES.MENUITEM:
      accessibilityObject = new MenuItemData(displayObject, role, domIdPrefix);
      break;

    case ROLES.MENUITEMCHECKBOX:
      accessibilityObject = new MenuItemCheckBoxData(displayObject, role, domIdPrefix);
      break;

    case ROLES.MENUITEMRADIO:
      accessibilityObject = new MenuItemRadioData(displayObject, role, domIdPrefix);
      break;

    case ROLES.MULTILINETEXTBOX:
      accessibilityObject = new MultiLineTextBoxData(displayObject, role, domIdPrefix);
      break;

    case ROLES.MULTISELECTLISTBOX:
      accessibilityObject = new MultiSelectListBoxData(displayObject, role, domIdPrefix);
      break;

    case ROLES.SINGLESELECTOPTION:
    case ROLES.MULTISELECTOPTION:
      accessibilityObject = new OptionData(displayObject, role, domIdPrefix);
      break;

    case ROLES.ORDEREDLIST:
      accessibilityObject = new OrderedListData(displayObject, role, domIdPrefix);
      break;

    case ROLES.PROGRESSBAR:
      accessibilityObject = new ProgressData(displayObject, role, domIdPrefix);
      break;

    case ROLES.RADIO:
      accessibilityObject = new RadioData(displayObject, role, domIdPrefix);
      break;

    case ROLES.RADIOGROUP:
      accessibilityObject = new RadioGroupData(displayObject, role, domIdPrefix);
      break;

    case ROLES.ROW:
      accessibilityObject = new RowData(displayObject, role, domIdPrefix);
      break;

    case ROLES.SCROLLBAR:
      accessibilityObject = new ScrollBarData(displayObject, role, domIdPrefix);
      break;

    case ROLES.SEARCHBOX:
      accessibilityObject = new SearchBoxData(displayObject, role, domIdPrefix);
      break;

    case ROLES.ALERT:
    case ROLES.ALERTDIALOG:
    case ROLES.BANNER:
    case ROLES.COMPEMENTARY:
    case ROLES.CONTENTINFO:
    case ROLES.DEFINITION:
    case ROLES.DIRECTORY:
    case ROLES.FEED:
    case ROLES.FIGURE:
    case ROLES.LOG:
    case ROLES.MARQUEE:
    case ROLES.NAVIGATION:
    case ROLES.NOTE:
    case ROLES.REGION:
    case ROLES.STATUS:
    case ROLES.TABPANEL:
    case ROLES.TERM:
    case ROLES.TOOLTIP:
    case ROLES.UNORDEREDLIST:
      accessibilityObject = new SectionData(displayObject, role, domIdPrefix);
      break;

    case ROLES.SEPARATOR:
      accessibilityObject = new SeparatorData(displayObject, role, domIdPrefix);
      break;

    case ROLES.SINGLELINETEXTBOX:
      accessibilityObject = new SingleLineTextBoxData(displayObject, role, domIdPrefix);
      break;

    case ROLES.SINGLESELECTLISTBOX:
      accessibilityObject = new SingleSelectListBoxData(displayObject, role, domIdPrefix);
      break;

    case ROLES.SLIDER:
      accessibilityObject = new SliderData(displayObject, role, domIdPrefix);
      break;

    case ROLES.SPINBUTTON:
      accessibilityObject = new SpinButtonData(displayObject, role, domIdPrefix);
      break;

    case ROLES.SWITCH:
      accessibilityObject = new SwitchData(displayObject, role, domIdPrefix);
      break;

    case ROLES.TABLE:
      accessibilityObject = new TableData(displayObject, role, domIdPrefix);
      break;

    case ROLES.COLUMNHEADER:
    case ROLES.ROWHEADER:
      accessibilityObject = new TableHeaderData(displayObject, role, domIdPrefix);
      break;

    case ROLES.TAB:
      accessibilityObject = new TabData(displayObject, role, domIdPrefix);
      break;

    case ROLES.TABLIST:
      accessibilityObject = new TabListData(displayObject, role, domIdPrefix);
      break;

    case ROLES.TIMER:
      accessibilityObject = new TimerData(displayObject, role, domIdPrefix);
      break;

    case ROLES.TREE:
      accessibilityObject = new TreeData(displayObject, role, domIdPrefix);
      break;

    case ROLES.TREEITEM:
      accessibilityObject = new TreeItemData(displayObject, role, domIdPrefix);
      break;

    case ROLES.TOOLBAR:
      accessibilityObject = new ToolBarData(displayObject, role, domIdPrefix);
      break;

    default:
      throw new Error(`Invalid role of "${role}"`);
  }

  displayObject.accessible = accessibilityObject;

  if (events) {
    _.forEach(events, (event) => {
      const { eventName, listener } = event;
      displayObject.on(eventName, listener);
    });
  }

  if (accessibleOptions) {
    _.forEach(accessibleOptions, (val, key) => {
      displayObject.accessible[key] = val;
    });
  }

  if (parent) {
    if (containerIndex) {
      parent.accessible.addChildAt(displayObject, containerIndex);
    } else {
      parent.accessible.addChild(displayObject);
    }
  }
}

export { createAccessibilityObjectForRole };
