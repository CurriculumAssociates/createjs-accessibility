import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { ROLES, getTagNameForDisplayObject } from './Roles';

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
export default class AccessibilityTranslator extends React.Component {
  /**
   * @return {Object} properties accepted by this component.
   * @property {string} className
   * @see https://facebook.github.io/react/docs/component-specs.html#proptypes
   */
  static get propTypes() {
    return {
      stage: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);

    _.bindAll(this, 'update');
  }

  /**
   * Sets the DisplayObject to use as the root of the accessibility tree.
   * @param {!createjs.DisplayObject} displayObject - DisplayObject to use as the root of
    the accessibility tree
   */
  set root(displayObject) {
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
  get root() {
    return this._root;
  }

  /**
   * Starts the update of the accessibility DOM.  This should be called each time
   * the accessibility information for all DisplayObjects has been completed(e.g. just after
   * drawing a frame) to make sure that the canvas and accessibility DOM are in sync.
   */
  update(callback = _.noop) {
    this.forceUpdate(callback);
  }

  _processDisplayObject(displayObject, parentBoundsInGlobalSpace) {
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

    let posGlobalSpace = {
      x: parentBoundsInGlobalSpace.x,
      y: parentBoundsInGlobalSpace.y,
    };
    const posParentSpace = {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    };
    try {
      const bounds = displayObject.getBounds();
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

    const props = _.merge(
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
      displayObject.accessible._reactProps
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

    return React.createElement(tagName, props, ...childElements);
  }

  render() {
    let back = null;
    if (this._root) {
      const tree = this._processDisplayObject(this._root, { x: 0, y: 0 });
      back = (
        <div
          ref={(elem) => {
            this.rootElem = elem;
          }}
        >
          {tree}
        </div>
      );
    }
    return back;
  }
}
