import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import RangeData from './RangeData';

export default class ScrollBarData extends RangeData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onKeyDown');
    this._reactProps.onKeyDown = this._onKeyDown;

    /**
     * Amount to increment or decrement the value by when the arrow keys are pressed
     * @access public
     */
    this.increment = 20;

    // setup defaults per WAI-ARIA
    this.min = 0;
    this.max = 100;
    this.value = (this.max + this.min) / 2;
  }

  /**
   * @inheritdoc
   */
  set enableKeyEvents(enable) {
    super.enableKeyEvents = enable;
    this._reactProps.onKeyDown = this._onKeyDown;
  }

  /**
   * @inheritdoc
   */
  get enableKeyEvents() {
    return super.enableKeyEvents;
  }

  /**
   * Sets the orientation
   * @access public
   * @param {String} str - "horizontal" for a horizontal slider, "vertical" for a vertical scrollbar
   */
  set orientation(str) {
    this._reactProps['aria-orientation'] = str;
  }

  /**
   * Retrieves the orientation
   * @access public
   * @returns  {String} str "horizontal" for a horizontal slider, "vertical" for a vertical scrollbar
   */
  get orientation() {
    return this._reactProps['aria-orientation'];
  }

  /**
   * @inheritdoc
   */
  _onKeyDown(e) {
    if (this.enableKeyEvents) {
      super._onKeyDown(evt);
      if (evt.defaultPrevented) {
        return;
      }
    }

    if (this.orientation !== 'horizontal') {
      if (e.keyCode === KeyCodes.up || e.keyCode === KeyCodes.down) {
        e.stopPropagation();
        e.preventDefault();
        if (e.keyCode === KeyCodes.up) {
          this.value = Math.max(this.value - this.increment, this.min);
        } else {
          this.value = Math.min(this.value + this.increment, this.max);
        }
        const event = new createjs.Event('scroll', false, e.cancelable);
        event.scrollTop = this.value;
        this._displayObject.dispatchEvent(event);
      }
    } else if (e.keyCode === KeyCodes.left || e.keyCode === KeyCodes.right) {
      e.stopPropagation();
      e.preventDefault();
      if (e.keyCode === KeyCodes.left) {
        this.value = Math.max(this.value - this.increment, this.min);
      } else {
        this.value = Math.min(this.value + this.increment, this.max);
      }
      const event = new createjs.Event('scroll', false, e.cancelable);
      event.scrollLeft = this.value;
      this._displayObject.dispatchEvent(event);
    }
  }
}
