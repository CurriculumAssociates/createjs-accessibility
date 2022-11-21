import _ from 'lodash';
import { breadth } from 'treeverse';
import { ROLES } from './Roles';
import { getTagNameForDisplayObject } from './utils/roleUtils';
import { createElement, updateElement } from './utils/domUtils';
import { AccessibleDisplayObject } from './RoleObjects/AccessibilityObject';

type ElementBounds = {
  height?: number;
  width?: number;
  x: number;
  y: number;
};

type EventHandler = (evt: Event) => void;

export type DisplayObjectReactProps = {
  disabled?: string;
  role?: string;
  style?: {
    [key: string]: string | number;
    display?: string;
    height?: string;
    left?: string;
    margin?: number;
    padding?: number | string;
    position?: string;
    top?: string;
    width?: string;
  };
  [k: string]: string | number | boolean | object | EventHandler;
};

export type DomDataObjectType = {
  tagName: string;
  props: DisplayObjectReactProps;
  childElements: (DomDataObjectType | string)[];
};

/**
 * Update process for translating accessibility information for a stage to a DOM approach
 * that is available to assistive technologies.  Applications should create an instance
 * of this for each stage and provide instances with different parent nodes.  Since the
 * drawing order may not always be convient for accessibility, this manages a separate
 * tree of DisplayObjects.  After the instance is created, the setter for 'root' should
 * be used to specify which DisplayObject will serve as the root of the accessibility tree
 * and other DisplayObjects can be added to that to be included in the accessibility output.
 * This also helps minimize the processing done by this class along with reduce
 * its output to the DOM.
 */
export default class AccessibilityTranslator {
  private _root: AccessibleDisplayObject;

  private rootElem: HTMLElement;

  constructor() {
    _.bindAll(this, 'update');
  }

  /**
   * Sets the DisplayObject to use as the root of the accessibility tree.
   * @param {!createjs.DisplayObject} displayObject - DisplayObject to use as the root of
    the accessibility tree
   */
  set root(displayObject: AccessibleDisplayObject) {
    if (!displayObject.accessible) {
      throw new Error(
        'The root of the accessibility tree must have accessibility information when being added to the tree'
      );
    }
    this._root = displayObject;
  }

  /**
   * Retrieves the root of the accessibility tree
   * @return {createjs.DisplayObject} DisplayObject that is the root of the accessibility tree
   */
  get root(): AccessibleDisplayObject {
    return this._root;
  }

  /**
   * Starts the update of the accessibility DOM.  This should be called each time
   * the accessibility information for all DisplayObjects has been completed(e.g. just after
   * drawing a frame) to make sure that the canvas and accessibility DOM are in sync.
   */
  update(callback = _.noop): void {
    const visit = (node: AccessibleDisplayObject) => {
      let bounds = { x: 0, y: 0 };
      if (node.accessible.parent && node.parent) {
        const { x, y } = node.parent.getBounds();
        bounds = node.parent.localToGlobal(x, y);
      }
      updateElement(
        node,
        this._processDisplayObject(node, bounds),
        node.accessible.domId
      );
      node.accessible.markAsUpdated();
    };
    breadth({
      tree: this.root,
      visit,
      getChildren(node: AccessibleDisplayObject) {
        return node.accessible.children;
      },
      filter(node: AccessibleDisplayObject) {
        return node.accessible.isMarkedForUpdate;
      },
    });
    callback();
  }

  _processDisplayObject = (
    displayObject: AccessibleDisplayObject,
    parentBoundsInGlobalSpace: ElementBounds
  ): DomDataObjectType => {
    if (!displayObject.accessible) {
      return;
    }
    const { accessible } = displayObject;
    const { role } = accessible;
    const tagName = getTagNameForDisplayObject(displayObject);
    const children = accessible.children || [];

    let { text } = accessible;
    if (
      role === ROLES.MENUBAR ||
      role === ROLES.MENU ||
      ((role === ROLES.MENUITEM ||
        role === ROLES.MENUITEMCHECKBOX ||
        role === ROLES.MENUITEMRADIO) &&
        children.length > 0)
    ) {
      text = null;
    }

    let posGlobalSpace: ElementBounds = {
      x: parentBoundsInGlobalSpace.x,
      y: parentBoundsInGlobalSpace.y,
    };
    const posParentSpace: ElementBounds = {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    };
    try {
      const bounds: ElementBounds = displayObject.getBounds();
      posGlobalSpace = displayObject.localToGlobal(bounds.x, bounds.y);
      const lowerRight = displayObject.localToGlobal(
        bounds.x + bounds.width,
        bounds.y + bounds.height
      );
      posParentSpace.x =
        (posGlobalSpace.x - parentBoundsInGlobalSpace.x) *
        (1 / displayObject.stage.scaleX);
      posParentSpace.y =
        (posGlobalSpace.y - parentBoundsInGlobalSpace.y) *
        (1 / displayObject.stage.scaleY);
      posParentSpace.width =
        (lowerRight.x - posGlobalSpace.x) * (1 / displayObject.stage.scaleX);
      posParentSpace.height =
        (lowerRight.y - posGlobalSpace.y) * (1 / displayObject.stage.scaleY);
      if (posParentSpace.width < 0) {
        posParentSpace.width = -posParentSpace.width;
        posParentSpace.x -= posParentSpace.width;
      }
      if (posParentSpace.height < 0) {
        posParentSpace.height = -posParentSpace.height;
        posParentSpace.y -= posParentSpace.height;
      }
    } catch (err) {
      // ignore, this is mainly for the case of undefined bounds
    }

    const childElements = [];
    if (text) {
      childElements.push(text);
    }
    if (children.length > 0) {
      children.forEach((child) => {
        childElements.push(this._processDisplayObject(child, posGlobalSpace));
      });
    }

    const props: DisplayObjectReactProps = _.merge(
      {
        style: {
          position: 'absolute',
          left: `${posParentSpace.x}px`,
          top: `${posParentSpace.y}px`,
          width: `${posParentSpace.width}px`,
          height: `${posParentSpace.height}px`,
          margin: 0,
          padding: 0,
        },
      },
      displayObject.accessible.reactProps
    );
    if (
      (tagName === 'div' && role !== ROLES.NONE) ||
      role === ROLES.MENUBAR ||
      role === ROLES.MENUITEMCHECKBOX ||
      role === ROLES.MENUITEMRADIO ||
      role === ROLES.MENU ||
      role === ROLES.MENUITEM ||
      role === ROLES.SWITCH ||
      role === ROLES.SPINBUTTON ||
      role === ROLES.GRID ||
      role === ROLES.GRIDCELL ||
      role === ROLES.TREE ||
      role === ROLES.TREEGRID ||
      role === ROLES.TREEITEM ||
      role === ROLES.DEFINITION ||
      role === ROLES.TERM
    ) {
      props.role = role;
    } else if (role === ROLES.SINGLESELECTLISTBOX) {
      props.role = 'listbox';
    } else if (role === ROLES.SINGLESELECTOPTION) {
      props.role = 'option';
    }
    if (displayObject.accessible.disabledWithInference) {
      props.disabled = 'disabled';
      props['aria-disabled'] = true;
    }

    if (!displayObject.accessible.visibleWithInference) {
      props.style.display = 'none';
    }

    if (!displayObject.visible && props['aria-hidden'] === undefined) {
      props['aria-hidden'] = true;
    }

    return { tagName, props, childElements };
  };

  createDomTree() {
    if (this._root) {
      const { tagName, props, childElements } = this._processDisplayObject(
        this._root,
        { x: 0, y: 0 }
      );
      const rootElem = document.getElementById('root');
      this.rootElem = rootElem;
      rootElem.replaceChildren(createElement(tagName, props, childElements));
    }
  }
}
