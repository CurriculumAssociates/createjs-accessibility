import KeyCodes from 'keycodes-enum';
import _ from 'lodash';
import CompositeData from './CompositeData';

export default class TabListData extends CompositeData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onTabListKeyDown');
    this._reactProps.onKeyDown = this._onTabListKeyDown;
  }
  /**
   *  hierarchical level of the tabs within other structures
   * @access public
   * @param {Number} val - aria-level is an integer greater than or equal to 1
   */

  set level(val) {
    this._reactProps['aria-level'] = val;
  }

  /**
   *  hierarchical level of the tabs within other structures
   * @access public
   * @param {Number} val - aria-level is an integer greater than or equal to 1
   */
  get level() {
    return this._reactProps['aria-level'];
  }

  /**
   * @access public
   * @param {boolean} val - true if more than one tab in the tablist may be selected at a time.
   * false if only one tab can be selected.
   */
  set multiselectable(val) {
    this._reactProps['aria-multiselectable'] = val;
  }

  /**
   * @access public
   * @param {boolean} val - true if more than one tab in the tablist may be selected at a time.
   * false if only one tab can be selected.
   */
  get multiselectable() {
    return this._reactProps['aria-multiselectable'];
  }

  /**
    * Sets the orientation of tablist
    * @access public
    * @param {String} str - "horizontal" for a horizontal tablist, "vertical" for a vertical tablist
    */
  set orientation(str) {
    this._reactProps['aria-orientation'] = str;
  }

  /**
    * Retrieves the orientation of tablist
    * @access public
    * @returns  {String} str "horizontal" for a horizontal tablist,
    "vertical" for a vertical tablist
    */
  get orientation() {
    return this._reactProps['aria-orientation'];
  }

  /**
   * Keydown listener for when the tablist is pressed
   * @access private
   * @param {SyntheticEvent} e - React event
   */
  _onTabListKeyDown(e) {
    if ([KeyCodes.enter, KeyCodes.space].indexOf(e.keyCode) !== -1) {
      const event = new createjs.Event('keyboardClick', false, e.cancelable);
      this._displayObject.dispatchEvent(event);
    }
    if ((e.keyCode === KeyCodes.left || e.keyCode === KeyCodes.right) && this.orientation === 'horizontal') {
      let index = _.findIndex(this._children, tab => tab.accessible.selected);

      if (e.keyCode === KeyCodes.left) {
        index = (this._children.length + index - 1) % this._children.length;
      } else if (e.keyCode === KeyCodes.right) {
        index = (index + 1) % this._children.length;
      }
      const nextTab = this._children[index];
      const event = new createjs.Event('keyboardClick', false, e.cancelable);
      nextTab.dispatchEvent(event);
      e.stopPropagation();
      e.preventDefault();
    }

    if ((e.keyCode === KeyCodes.up || e.keyCode === KeyCodes.down) && this.orientation === 'vertical') {
      const targetId = e.target.id;
      const currIndex = this._domIdToChildIndex(targetId);
      let nextIndex;
      if (e.keyCode === KeyCodes.up) {
        nextIndex = (this._children.length + currIndex - 1) % this._children.length;
      } else {
        nextIndex = (currIndex + 1) % this._children.length;
      }
      this._children[nextIndex].accessible.requestFocus();
      const nextTab = this._children[nextIndex];
      const event = new createjs.Event('keyboardClick', false, e.cancelable);
      nextTab.dispatchEvent(event);
      e.stopPropagation();
      e.preventDefault();
    }
  }
}
