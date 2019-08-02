import _ from 'lodash';

/**
 * Container for the accessibility information for a DisplayObject.
 */
export default class AccessibilityObject {
  constructor(displayObject, role, domIdPrefix) {
    _.bindAll(this, '_onKeyDown', '_onKeyUp');
    this._displayObject = displayObject;
    this._children = [];
    this._role = role;
    this._domId = domIdPrefix + displayObject.id;
    this._areKeyEventsEnabled = false;
    /**
     * Fields with relatively fixed values that should go into the React props for the
     * element translation of this object.  This is done as an object for easy merging
     * with the rest of the props
     * @access private
     */
    this._reactProps = {
      key: this._displayObject.id,
      id: this.domId,
      onFocus: (evt) => {
        const cancelled = this._displayObject.dispatchEvent('focus', false, true);

        if (cancelled) {
          evt.stopPropagation();
          evt.preventDefault();
        }
      },
      onBlur: (evt) => {
        const cancelled = this._displayObject.dispatchEvent('blur', false, true);
        if (cancelled) {
          evt.stopPropagation();
          evt.preventDefault();
        }
      },
    };

    /**
     * string that describes the DisplayObject for the AT
     * @access public
     */
    this.text = undefined;
  }

  /**
   * Adds the specified DisplayObject as a child of the DisplayObject associated with this
   * AccessibilityObject in the accessibility tree.  The specified DisplayObject must have
   * accessibility information already present.  Different subclasses may limit the valid roles
   * for the specified DisplayObject.
   * todo: list role restrictions
   * @access public
   * @param {createjs.DisplayObject} displayObject - accessibility annotated DisplayObject to
   * add as a child in the accessibility tree
   */
  addChild(displayObject) {
    if (!displayObject.accessible) {
      throw new Error('DisplayObjects added to the accessibility tree must have accessibility information when being added to the tree');
    }

    if (displayObject.accessible._parent) {
      displayObject.accessible._parent.removeChild(displayObject);
    }
    this._children.push(displayObject);
    displayObject.accessible._parent = this;
  }

  /**
   * Adds the specified DisplayObject as a child of the DisplayObject associated with this
   * AccessibilityObject in the accessibility tree at the specified index.  The specified
   * DisplayObject must have accessibility information already present.  Different subclasses
   * may limit the valid roles for the specified DisplayObject (see addChild's function comment
   * for list of role restrictions).
   * @access public
   * @param {createjs.DisplayObject} displayObject - accessibility annotated DisplayObject to add
   * as a child in the accessibility tree
   * @param {Number} index - 0 based index that the DisplayObject should have in the array of
   * children once added
   */
  addChildAt(displayObject, index) {
    if (!displayObject.accessible) {
      throw new Error('DisplayObjects added to the accessibility tree must have accessibility information when being added to the tree');
    }

    if (displayObject.accessible._parent) {
      displayObject.accessible._parent.removeChild(displayObject);
    }
    this._children.splice(index, 0, displayObject);
    displayObject.accessible._parent = this;
  }

  /**
   * Removes all children of this AccessibilityObject from the accessibility tree.
   * @access public
   */
  removeAllChildren() {
    this._children.forEach((child) => {
      child.accessible._parent = null;
    });
    this._children = [];
  }

  /**
   * Removes the specified child of this AccessibilityObject from the accessibility tree.
   * @access public
   * @param {createjs.DisplayObject} displayObject - child DisplayObject to remove
   */
  removeChild(displayObject) {
    const index = _.findIndex(this._children, test => test === displayObject);
    this.removeChildAt(index);
  }

  /**
   * Removes the child at the specified index of this AccessibilityObject
   * from the accessibility tree.
   * @access public
   * @param {Number} index - index of the child to remove
   */
  removeChildAt(index) {
    if (index >= 0 && index < this._children.length) {
      this._children[index].accessible._parent = null;
      this._children.splice(index, 1);
    }
  }

  /**
   * Requests that focus be sent to the DOM entry for associated DisplayObject
   * @access public
   */
  requestFocus() {
    const elem = document.getElementById(this._domId);
    if (elem) {
      // handle elements that won't be visible until the next render pass
      if (this.visibleWithInference && getComputedStyle(elem).display === 'none') {
        this._forceShow();
      }
      // handle elements that won't be enabled until the next render pass
      if (this.enabled && elem.getAttribute('disabled') !== null) {
        elem.removeAttribute('disabled');
      }

      elem.focus();
    }
  }

  /**
   * Sets whether keydown/keyup events should be sent to the DisplayObject.
   * The constructor default is that these events are not sent.
   * @access public
   * @param {boolean} enable - true if the keydown/keyup events should be sent to the DisplayObject.
   * false otherwise.
   */
  set enableKeyEvents(enable) {
    if (this._areKeyEventsEnabled && !enable) {
      this._reactProps.onKeyDown = undefined;
      this._reactProps.onKeyUp = undefined;
    } else if (!this._areKeyEventsEnabled && enable) {
      this._reactProps.onKeyDown = this._onKeyDown;
      this._reactProps.onKeyUp = this._onKeyUp;
    }

    this._areKeyEventsEnabled = enable;
  }

  /**
   * Retrieves whether keydown/keyup events are currently configured to be
   * sent to the DisplayObject.
   * @access public
   * @returns {boolean} true if the keydown/keyup events should be sent to the DisplayObject.
   * false otherwise.
   */
  get enableKeyEvents() {
    return this._areKeyEventsEnabled;
  }

  /**
   * Sets the keyboard shortcut to click the DisplayObject
   * @access public
   * @param {String} keycode - string containing the letter to use for the keyboard shortcut
   */
  set accessKey(keycode) {
    this._reactProps.accessKey = keycode;
  }

  /**
   * Retrieves the keyboard shortcut to click the DisplayObject
   * @access public
   * @returns {String} string containing the letter to use for the keyboard shortcut
   */
  get accessKey() {
    return this._reactProps.accessKey;
  }

  /**
   * The spellcheck attribute specifies whether the element is to have its spelling
   * and grammar checked or not.
   * @access public
   * @param { boolean } bool
   */
  set spellcheck(bool) {
    this._reactProps.spellCheck = bool;
  }

  /**
   * The spellcheck attribute specifies whether the element is to have its spelling and
   * grammar checked or not.
   * @access public
   * @returns {boolean} boolean: true or false
   */
  get spellcheck() {
    return this._reactProps.spellCheck;
  }


  /**
   * Sets the title for the DisplayObject
   * @access public
   * @param {String} title - string mouse hover show text of title as tooltip
   */
  set title(title) {
    this._reactProps.title = title;
  }

  /**
   * Retrieves the title for the DisplayObject
   * @access public
   * @returns {String} string mouse hover show text of title as tooltip
   */
  get title() {
    return this._reactProps.title;
  }

  /**
   * The lang attribute specifies the language of the element's content.
   * @access public
   * @returns {String} lang: eg. "en" for English, "es" for Spanish, "fr" for French, and so on.
   * https://www.w3schools.com/tags/ref_language_codes.asp has the full list of valid values.
   */
  get lang() {
    return this._reactProps.lang;
  }

  /**
   * The lang attribute specifies the language of the element's content.
   * @access public
   * @param {String} lang: eg. "en" for English, "es" for Spanish, "fr" for French, and so on.
   * https://www.w3schools.com/tags/ref_language_codes.asp has the full list of valid values.
   */
  set lang(lang) {
    this._reactProps.lang = lang;
  }

  /**
   * The dir attribute specifies the text direction of the element's content.
   * @access public
   * @param {String} direction
   * ltr: Left-to-right text direction, rtl: Right-to-left text direction
   * auto: Let the browser figure out the text direction, based on the content
   */
  set dir(direction) {
    this._reactProps.dir = direction;
  }

  /**
   * The dir attribute specifies the text direction of the element's content.
   * @access public
   * @returns {String} direction
   * ltr: Left-to-right text direction, rtl: Right-to-left text direction, auto: Let the browser
   * figure out the text direction, based on the content
   */
  get dir() {
    return this._reactProps.dir;
  }

  /**
   * Sets whether ATs should present the region as a whole or parts
   * @access public
   * @param {boolean} enable - true if ATs should present the region as a whole,
   * false for parts.  undefined to unset the field.
   */
  set atomic(enable) {
    this._reactProps['aria-atomic'] = enable;
  }

  /**
   * Retrieves whether ATs should present the region as a whole or parts
   * @access public
   * @returns {boolean} true if ATs should present the region as a whole, false
   * for parts, undefined if the field is unset.
   */
  get atomic() {
    return this._reactProps['aria-atomic'];
  }

  /**
   * Sets whether the element or its children in the accessibility tree are currently being updated
   * @access public
   * @param {boolean} updating - true if updating is in progress, false if there
   * are no more expected updates, undefined to unset the field.
   */
  set busy(updating) {
    this._reactProps['aria-busy'] = updating;
  }

  /**
   * Retrieves whether the element or its children in the accessibility tree are
   * currently being updated
   * @access public
   * @returns {boolean} true if updating is in progress, false if there are no more
   * expected updates, undefined if the field is unset.
   */
  get busy() {
    return this._reactProps['aria-busy'];
  }

  /**
   * Retrieves the array of DisplayObjects that are children of this one in the accessibility tree
   * @access public
   * @return {Array<createjs.DisplayObject>} array of child DisplayObjects
   */
  get children() {
    return this._children;
  }

  /**
   * Sets which DisplayObject's contents or presence is controlled by this one.
   * @access public
   * @param {createjs.DisplayObject} displayObject - DisplayObject controlled by this one.
   * undefined to unset the field.
   */
  set controls(displayObject) {
    if (displayObject && !displayObject.accessible) {
      throw new Error('DisplayObject being controlled by another must have accessibility information');
    }
    this._controls = displayObject;
    this._reactProps['aria-controls'] = displayObject ? displayObject.accessible.domId : undefined;
  }

  /**
   * Retrieves which DisplayObject has their content or presence controlled by this one.
   * @access public
   * @returns {createjs.DisplayObject} DisplayObject controlled by this one
   */
  get controls() {
    return this._controls;
  }

  /**
   * Retrieves the DOM id for the tranlated DisplayObject controlled by this one.
   * @access public
   * @returns {String} id for the translated controlled DisplayObject
   */
  get controlsId() {
    return this._reactProps['aria-controls'];
  }

  /**
   * Sets which DisplayObject's accessibility information describes this one.
   * @access public
   * @param {createjs.DisplayObject} displayObject - describing DisplayObject.
   * undefined to unset the field.
   */
  set describedBy(displayObject) {
    if (displayObject && !displayObject.accessible) {
      throw new Error('DisplayObject describing another must have accessibility information');
    }
    this._describedBy = displayObject;
    this._reactProps['aria-describedby'] = displayObject ? displayObject.accessible.domId : undefined;
  }

  /**
   * Retrieves which DisplayObject has accessibility information describing this one.
   * @access public
   * @returns {createjs.DisplayObject} describing DisplayObject
   */
  get describedBy() {
    return this._describedBy;
  }

  /**
   * Retrieves the DOM id of the translated DisplayObject that has accessibility information
   * describing this one.
   * @access public
   * @returns {String} id of the translated describing DisplayObject
   */
  get describedById() {
    return this._reactProps['aria-describedby'];
  }

  /**
   * Retrieves the value of the id attribute used in the DOM for the DisplayObject's accessibility
   * information
   * @access public
   * @returns {String} id of the DOM element
   */
  get domId() {
    return this._domId;
  }

  /**
   * Sets which drop effects can be performed when dropping a draggable object onto this one.  See https://www.w3.org/TR/wai-aria/states_and_properties#aria-dropeffect for valid values
   * @access public
   * @param {String} effects - Space separate list of drop effects.  undefined to unset this field.
   */
  set dropEffects(effects) {
    this._reactProps['aria-dropeffect'] = effects;
  }

  /**
   * Retrieves which drop effects can be performed when dropping a draggable object onto this one.
   * @access public
   * @returns {String} Space separate list of drop effects.  undefined if this field is unset.
   */
  get dropEffects() {
    return this._reactProps['aria-dropeffect'];
  }

  /**
   * Sets whether the element is enabled
   * @access public
   * @param {boolean} enable - true if the element should be enabled, false
   * if the element should be disabled.  undefined to unset the field.
   */
  set enabled(enable) {
    this._reactProps['aria-disabled'] = enable === undefined ? undefined : !enable;
  }

  /**
   * Retrieves whether the element is enabled
   * @access public
   * @returns {boolean} true if the element is enabled, false if the element
   * is disabled.  undefined if the field is unset.
   */
  get enabled() {
    return this._reactProps['aria-disabled'] === undefined ? undefined : !this._reactProps['aria-disabled'];
  }

  /**
   * Retrieves whether the DisplayObject is disabled for interaction,
   * taking into account the automatic field determination done when translating to the DOM.
   * @access public
   * @returns {boolean} true if disabled, false otherwise
   */
  get disabledWithInference() {
    return this._reactProps['aria-disabled'] !== undefined
      ? this._reactProps['aria-disabled']
      : (!this._displayObject.mouseEnabled
        && (this._displayObject.hasEventListener('click')
          || this._displayObject.hasEventListener('mousedown')
          || this._displayObject.hasEventListener('pressup')));
  }

  /**
   * Sets which DisplayObject is next in an alternative reading order
   * @access public
   * @param {createjs.DisplayObject} displayObject - DisplayObject to flow to.
   * undefined to unset the field.
   */
  set flowTo(displayObject) {
    if (displayObject && !displayObject.accessible) {
      throw new Error('DisplayObject to flow to must have accessibility information');
    }
    this._flowTo = displayObject;
    this._reactProps['aria-flowto'] = displayObject ? displayObject.accessible.domId : undefined;
  }

  /**
   * Retrieves the DisplayObject that is next in the alternative reading order
   * @access public
   * @returns {createjs.DisplayObject} DisplayObject to flow to
   */
  get flowTo() {
    return this._flowTo;
  }

  /**
   * Retrieves the DOM id of the translated DisplayObject that is next in an
   * alternative reading order
   * @access public
   * @returns {String} id to flow to
   */
  get flowToId() {
    return this._reactProps['aria-flowto'];
  }

  /**
   * Sets whether the DisplayObject is picked up for a drag and drop interaction
   * @access public
   * @param {boolean} dragging - true if being dragged, false for not being dragged but
   * supports it, undefined for not being dragged and doesn't support it
   */
  set grabbed(dragging) {
    this._reactProps['aria-grabbed'] = dragging;
  }

  /**
   * Retrieves whether the DisplayObject is picked up for a drag and drop interaction
   * @access public
   * @returns {boolean} true if being dragged, false for not being dragged but supports it,
   * undefined for not being dragged and doesn't support it
   */
  get grabbed() {
    return this._reactProps['aria-grabbed'];
  }

  /**
   * Sets whether additional content will be displayed by interacting with the DisplayObject
   * @access public
   * @param {string} popup - see https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup for valid values.  undefined to unset the field.
   */
  set hasPopUp(popup) {
    this._reactProps['aria-haspopup'] = popup;
  }

  /**
   * Retrieves whether additional content will be displayed by interacting with the DisplayObject
   * @access public
   * @returns {string} see https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup for valid values.  undefined if this field is unset.
   */
  get hasPopUp() {
    return this._reactProps['aria-haspopup'];
  }

  /**
   * Sets whether the DisplayObject is perceivable to any type of user.
   * Note: if this field is unset (undefined) and the DisplayObject's .visible
   * field a falsey value, then the translated DOM entry will have 'aria-hidden'
   * set to true.  If you want to prevent this automatic field determination,
   * then this field should be set to true or false.
   * @access public
   * @param {boolean} hide - true if not perceivable, false for perceivable.
   * undefined to unset the field.
   */
  set hidden(hide) {
    this._reactProps['aria-hidden'] = hide;
  }

  /**
   * Retrieves whether the DisplayObject is perceivable to any type of user.
   * @access public
   * @returns {boolean} true if not perceivable, false for perceivable.
   * undefined if this field is unset.
   */
  get hidden() {
    return this._reactProps['aria-hidden'];
  }

  /**
   * Retrieves whether the DisplayObject is perceivable to any type of user,
   * taking into account the automatic field determination done when translating to the DOM.
   * @access public
   * @returns {boolean} true if not perceivable, false for perceivable
   */
  get hiddenWithInference() {
    return this._reactProps['aria-hidden'] || (!this._displayObject.visible && this._reactProps['aria-hidden'] === undefined);
  }

  /**
   * Sets if/how the entered value is considered invalid
   * @access public
   * @param {String} reason - A string from https://www.w3.org/TR/wai-aria/states_and_properties#aria-invalid for why the entered value is considered invalid.  undefined to unset the field.
   */
  set invalid(reason) {
    this._reactProps['aria-invalid'] = reason;
  }

  /**
   * Retrieves if/how the entered value is considered invalid
   * @access public
   * @returns {String} A string from https://www.w3.org/TR/wai-aria/states_and_properties#aria-invalid for why the entered value is considered invalid.  undefined if this field is unset.
   */
  get invalid() {
    return this._reactProps['aria-invalid'];
  }

  /**
   * Sets the string to use as a label
   * @access public
   * @param {String} str - string to use as a label.  undefined if the field is to be cleared
   */
  set label(str) {
    this._reactProps['aria-label'] = str;
  }

  /**
   * Retrieves the string that is used for label
   * @access public
   * @returns {String} the string label.  undefined if this field is unset.
   */
  get label() {
    return this._reactProps['aria-label'];
  }

  /**
   * Sets which other DisplayObject labels the DisplayObject
   * @access public
   * @param {createjs.DisplayObject} displayObject - DisplayObject that labels this one.
   * undefined if the field is to be cleared
   */
  set labelledBy(displayObject) {
    if (displayObject && !displayObject.accessible) {
      throw new Error('DisplayObjects used to label another DisplayObject must have accessibility information when being provided as a label');
    }
    if (displayObject === this._displayObject) {
      throw new Error('An object cannot be used as its own labelledBy');
    }
    this._labelledBy = displayObject;
    this._reactProps['aria-labelledby'] = displayObject ? displayObject.accessible.domId : undefined;
  }

  /**
   * Retrieves the DisplayObject that is used for labelling this one
   * @access public
   * @returns {createjs.DisplayObject} DisplayObject that is used for a label.
   * undefined if this field is unset.
   */
  get labelledBy() {
    return this._labelledBy;
  }

  /**
   * Retrieves the DOM id of the translated DisplayObject that is used for labelling this one
   * @access public
   * @returns {String} id of the label.  undefined if this field is unset.
   */
  get labelledById() {
    return this._reactProps['aria-labelledby'];
  }

  /**
   * Sets the priority level of the user being informed of updates to the translated
   * DOM element or its children
   * @access public
   * @param {String} level - See https://www.w3.org/TR/wai-aria/states_and_properties#aria-live for values and their meaning.  undefined if the field is to be cleared
   */
  set live(level) {
    this._reactProps['aria-live'] = level;
  }

  /**
   * Retrieves the priority level of the user being informed of updates to the translated
   * DOM element or its children
   * @access public
   * @returns {String} priority level.  undefined if this field is unset.
   */
  get live() {
    return this._reactProps['aria-live'];
  }

  /**
   * Sets which DisplayObjects that are not children in the accessibility tree but have
   *  a child relationship with this one
   * @access public
   * @param {Array<createjs.DisplayObject>} displayObjects - array of DisplayObjects that
   * should have a child relationship without being children in the accessibility tree.
   * undefined if the field is to be cleared
   */
  set owns(displayObjects) {
    if (displayObjects) {
      let ids = '';
      displayObjects.forEach((displayObject) => {
        if (!displayObject.accessible) {
          throw new Error('DisplayObjects owned by another DisplayObject must have accessibility information');
        } else {
          ids = `${ids} ${displayObject.accessible.domId}`;
        }
      });
      this._reactProps['aria-owns'] = ids;
      this._owns = displayObjects;
    } else {
      this._reactProps['aria-owns'] = undefined;
      this._owns = undefined;
    }
  }

  /**
   * Retrieves which DisplayObjects that are not children in the accessibility tree but
   * have a child relationship with this one
   * @access public
   * @returns {Array<createjs.DisplayObject>} array of DisplayObjects that should have
   * a child relationship without being children in the accessibility tree.
   * undefined if this field is unset.
   */
  get owns() {
    return this._owns;
  }

  /**
   * Retrieves a space separated list of the DOM ids of the translated DisplayObjects
   * that are not children in the accessibility tree that have a child relationship with this one
   * @access public
   * @returns {String} space separate list of DOM ids.  undefined if this field is unset.
   */
  get ownsIds() {
    return this._reactProps['aria-owns'];
  }

  /**
   * Retrieves the AccessibilityObject that is this one's parent in an accessibility tree.
   * null if this is currently not in an accessibility tree.
   * @access public
   * @return {AccessibilityObject} Parent AccessibilityObject in an accessibility tree
   */
  get parent() {
    return this._parent;
  }

  /**
   * Retrieves the React props for the element translation of this object.
   * @access package
   */
  get reactProps() {
    return this._reactProps;
  }

  /**
   * Sets which notifications should be sent for live regions
   * @access public
   * @param {String} str - space separated list of values from https://www.w3.org/TR/wai-aria/states_and_properties#aria-relevant.  undefined if the field is to be cleared
   */
  set relevant(str) {
    this._reactProps['aria-relevant'] = str;
  }

  /**
   * Retrieves a space separated list of notifications for live regions.
   * @access public
   * @returns {String} space separated list of values.  undefined if this field is unset.
   */
  get relevant() {
    return this._reactProps['aria-relevant'];
  }

  /**
   * Retrieves the entry in the ROLES enum for which ARIA role is used
   * @access public
   * @returns {String} string describing the DisplayObject to the AT
   */
  get role() {
    return this._role;
  }

  /**
   * Sets the tab index for the DisplayObject
   * @access public
   * @param {Number} index - number to use as the tab index
   */
  set tabIndex(index) {
    this._reactProps.tabIndex = index;
  }

  /**
   * Retrieves the tab index for the DisplayObject
   * @access public
   * @returns {Number} number used as the tab index
   */
  get tabIndex() {
    return this._reactProps.tabIndex;
  }

  /**
   * Sets whether the DisplayObject should be displayed in the DOM translation.
   * Note: if this field is unset (undefined) and the DisplayObject's .visible field
   * a falsey value, then the translated DOM entry will have 'display' set to 'none'.
   * If you want to prevent this automatic field determination, then this field should
   * be set to true or false.
   * @access public
   * @param {boolean} vis - true if DOM translation should be displayed, false for hidden.
   * undefined to unset the field.
   */
  set visible(vis) {
    this._visible = vis;
  }

  /**
   * Retrieves whether the DisplayObject should be displayed in the DOM translation.
   * @access public
   * @returns {boolean} true if visible, false for hidden.  undefined if this field is unset.
   */
  get visible() {
    return this._visible;
  }

  /**
   * Retrieves whether the DisplayObject is displayed in the DOM translation, taking into
   * account the automatic field determination done when translating to the DOM.
   * @access public
   * @returns {boolean} true if not visible, false if hidden
   */
  get visibleWithInference() {
    return (this.visible === undefined) ? this._displayObject.visible : this.visible === true;
  }

  /**
   * Makes the DOM entry visible immediately.  This does not affect the value used
   * during the next render of the accessibility tree.
   * @access package
   */
  _forceShow() {
    document.getElementById(this._domId).style.display = '';
  }

  /**
   * Finds the index into this.children for the specified DOM id
   * @access package
   * @param {String} id - DOM id of the element to find
   * @returns {Number} index into this.children.  -1 if no match is found
   */
  _domIdToChildIndex(id) {
    return _.findIndex(this._children, displayObject => id === displayObject.accessible._domId);
  }

  /**
   * Event listener for keydown events
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onKeyDown(evt) {
    const event = new createjs.Event('keydown', false, evt.cancelable);
    event.keyCode = evt.keyCode;
    this._displayObject.dispatchEvent(event);
    if (event.propagationStopped) {
      evt.stopPropagation();
    }
    if (event.defaultPrevented) {
      evt.preventDefault();
    }
  }

  /**
   * Event listener for keyup events
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onKeyUp(evt) {
    const event = new createjs.Event('keyup', false, evt.cancelable);
    event.keyCode = evt.keyCode;
    this._displayObject.dispatchEvent(event);
    if (event.propagationStopped) {
      evt.stopPropagation();
    }
    if (event.defaultPrevented) {
      evt.preventDefault();
    }
  }
}
