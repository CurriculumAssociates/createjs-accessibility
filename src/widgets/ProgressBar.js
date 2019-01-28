import _ from 'lodash';
import AccessibilityModule from 'createjs-accessibility';

export default class ProgressBar extends createjs.Container {
  constructor({ valueMax = 100, value = 0, width = 400, height = 8, onProgress = _.noop } = {}) {
    super();
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.PROGRESSBAR,
    });
    _.bindAll(this, 'startProgress', 'onFocus', 'onBlur');
    this.valueMax = valueMax;
    this.valueNow = value;
    this._width = width;
    this._height = height;
    this.strokeWidth = 2;
    this.focusIndicatorStrokeWidth = 3;
    this.radius = 4;
    this.setBounds(0, 0, width, height);
    this.onProgress = onProgress;
    this.setupProgressBar();
    this.addEventListener('focus', this.onFocus);
    this.addEventListener('blur', this.onBlur);
  }

  onFocus() {
    this.addChild(this.focusIndicator);
  }

  onBlur() {
    this.removeChild(this.focusIndicator);
  }


  setupProgressBar() {
    const { width, height, strokeWidth, focusIndicatorStrokeWidth, radius } = this;

    const padding = 8;
    const _width = width + (padding + focusIndicatorStrokeWidth);
    const _height = height + (padding + focusIndicatorStrokeWidth);
    this.focusIndicator = new createjs.Shape();
    this.focusIndicator.graphics.ss(focusIndicatorStrokeWidth).s('#7ec0f8').rr(0, 0, _width, _height, radius);
    this.focusIndicator.x -= (padding + focusIndicatorStrokeWidth) / 2;
    this.focusIndicator.y = this.focusIndicator.x;


    const holder = new createjs.Shape();
    holder.graphics.ss(strokeWidth).s('#cccccc').f('#ededed').rr(0, 0, width, height, radius);
    this.addChild(holder);

    this.indicator = new createjs.Shape();
    this.indicator.graphics.f('#319bf5').rr(0, 0, width, height, radius);
    this.addChild(this.indicator);
    this.indicator.scaleX = 0;
  }

  startProgress() {
    let percent = ++this.valueNow / this.valueMax;
    this.indicator.scaleX = percent;
    percent = Math.round(percent * 100);
    this.onProgress(percent, 'progress');
    if (percent < 100) {
      setTimeout(this.startProgress, (1 / 24) * 1000);
    } else {
      this.onProgress(percent, 'completed');
    }
  }

  set valueMax(value) {
    this._valueMax = value;
    this.accessible.valueMax = value;
  }

  get valueMax() {
    return this._valueMax;
  }

  set valueNow(value) {
    this._value = value;
    this.accessible.valueNow = value;
  }

  get valueNow() {
    return this._value;
  }

  get width() {
    return this._width + this.strokeWidth;
  }

  get height() {
    return this._height + this.strokeWidth;
  }
}
