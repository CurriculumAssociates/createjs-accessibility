import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import RangeData from './RangeData';

export default class ScrollBarData extends RangeData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, 'onKeyDown');
    this._reactProps.onKeyDown = this.onKeyDown;
    this.incrementor = 20;
    this._scrollAmt = 0;
  }

  set controls(value) {
    this._reactProps['aria-controls'] = value;
  }

  get controls() {
    return this._reactProps['aria-controls'];
  }

  set orientation(value) {
    this._reactProps['aria-orientation'] = value;
  }

  get orientation() {
    return this._reactProps['aria-orientation'];
  }

  set scrollAmount(value) {
    this._scrollAmt = value;
  }

  onKeyDown(e) {
    if (this.orientation !== 'horizontal') {
      if (e.keyCode === KeyCodes.up || e.keyCode === KeyCodes.down) {
        e.stopPropagation();
        e.preventDefault();
        if (e.keyCode === KeyCodes.up) {
          this._scrollAmt -= this.incrementor;
        } else {
          this._scrollAmt += this.incrementor;
        }
        const event = new createjs.Event('scroll', false, e.cancelable);
        event.scrollTop = this._scrollAmt;
        this._displayObject.dispatchEvent(event);
      }
    } else if (e.keyCode === KeyCodes.left || e.keyCode === KeyCodes.right) {
      e.stopPropagation();
      e.preventDefault();
      if (e.keyCode === KeyCodes.left) {
        this._scrollAmt -= this.incrementor;
      } else {
        this._scrollAmt += this.incrementor;
      }
      const event = new createjs.Event('scroll', false, e.cancelable);
      event.scrollLeft = this._scrollAmt;
      this._displayObject.dispatchEvent(event);
    }
  }
}
