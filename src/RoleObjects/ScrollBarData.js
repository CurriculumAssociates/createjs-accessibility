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
   * @returns  {String} str "horizontal" for a horizontal slider,
   * "vertical" for a vertical scrollbar
   */
  get orientation() {
    return this._reactProps['aria-orientation'];
  }

  /**
   * @inheritdoc
   */
  _onKeyDown(evt) {
    if (this.enableKeyEvents) {
      super._onKeyDown(evt);
      if (evt.defaultPrevented) {
        return;
      }
    }

    if (this.orientation !== 'horizontal') {
      if (evt.keyCode === KeyCodes.up || evt.keyCode === KeyCodes.down) {
        evt.stopPropagation();
        evt.preventDefault();
        if (evt.keyCode === KeyCodes.up) {
          this.value = Math.max(this.value - this.increment, this.min);
        } else {
          this.value = Math.min(this.value + this.increment, this.max);
        }
        const event = new createjs.Event('scroll', false, evt.cancelable);
        event.scrollTop = this.value;
        this._displayObject.dispatchEvent(event);
      }
    } else if (evt.keyCode === KeyCodes.left || evt.keyCode === KeyCodes.right) {
      evt.stopPropagation();
      evt.preventDefault();
      if (evt.keyCode === KeyCodes.left) {
        this.value = Math.max(this.value - this.increment, this.min);
      } else {
        this.value = Math.min(this.value + this.increment, this.max);
      }
      const event = new createjs.Event('scroll', false, evt.cancelable);
      event.scrollLeft = this.value;
      this._displayObject.dispatchEvent(event);
    }
  }
}
