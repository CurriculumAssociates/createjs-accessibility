import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import _ from 'lodash';

export default class Slider extends createjs.Container {
  constructor(min, max, width, height, orientation, step, value, tabIndex, callBack = () => {}) {
    super();
    _.bindAll(this, '_mousedown', '_mousemove', '_pressUp', '_onFocus', '_onBlur', 'moveSliderTo');
    this.setBounds(0, 0, width, height);
    this.width = width || 100;
    this.height = height || 20;
    this.valueMax = max;
    this.valueMin = min || 0;
    this.unitValue = (this.width / (this.valueMax - this.valueMin)); // 500/100=5
    this.orientation = orientation;
    this.step = step || 1;
    this.valueNow = value;
    this.trackColor = '#ccc';
    this.thumbColor = '#666';
    this.thumbWidth = 10;
    this.thumbHeight = 100;
    this.isDown = false;
    this.callBack = callBack;
    AccessibilityModule.register({
      accessibleOptions: {
        max,
        min,
        orientation,
        step,
        value,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.SLIDER,
      events: [
        {
          eventName: 'valueChanged',
          listener: this.moveSliderTo,
        },
        {
          eventName: 'keyboardClick',
          listener: this.moveSliderTo,
        },
        {
          eventName: 'focus',
          listener: this._onFocus,
        },
        {
          eventName: 'blur',
          listener: this._onBlur,
        },
      ],
    });
    this._createSlider();
  }

  _createSlider() {
    this.track = new createjs.Shape();
    this.track.graphics.setStrokeStyle(5);
    this.track.graphics.beginFill(this.trackColor);
    this.track.graphics.beginStroke(this.trackColor);
    this.track.graphics.moveTo(0, 0);
    this.track.graphics.lineTo(this.width, 0);
    this.track.graphics.endStroke();
    this.addChild(this.track);

    this.thumb = new createjs.Shape();
    this.thumb.graphics.beginFill(this.trackColor).drawCircle(0, 0, 5);
    this.focusCircle = new createjs.Shape();
    this.focusCircle.graphics.setStrokeStyle(3).beginStroke('#5FC1FA').drawCircle(this.thumb.x, this.thumb.y, 6);
    this.focusCircle.setBounds(this.thumb.x, this.thumb.y, this.width + 5, this.height + 5);
    this.addChild(this.focusCircle);
    this.focusCircle.visible = false;

    this.addChild(this.thumb);
    this.accessible.thumb = this.thumb;


    this.sliderText = new createjs.Text(this.valueNow, 'bold 24px Arial', '#000');
    this.sliderText.textAlign = 'center';
    this.sliderText.textBaseline = 'middle';
    this.sliderText.x = 200 / 2;
    this.sliderText.y = 50 / 2;
    this.addChild(this.sliderText);
    this.moveSliderTo(this.valueNow, true);

    this.thumb.addEventListener('mousedown', this._mousedown);
    this.thumb.addEventListener('pressmove', this._mousemove);
    this.thumb.addEventListener('pressup', this._pressUp);
  }

  _onFocus() {
    this.focusCircle.x = this.thumb.x;
    this.focusCircle.visible = true;
  }

  _onBlur() {
    this.focusCircle.x = this.thumb.x;
    this.focusCircle.visible = false;
  }

  moveSliderTo(evt, bool) {
    let value = evt;
    if (typeof evt === 'object') {
      value = evt.newValue;
    }
    if (value >= this.valueMax) {
      value = this.valueMax;
    }
    if (value <= this.valueMin) {
      value = this.valueMin;
    }
    this.valueNow = value;
    this.accessible.value = this.valueNow;
    this.thumb.x = this.valueNow * this.unitValue;
    this.focusCircle.x = this.thumb.x;
    this.text = this.valueNow;
    if (!bool) {
      this.callBack();
    }
  }


  _mousedown(event) {
    event.preventDefault();
    event.stopPropagation();
    const posX = _.min([
      event.stageX - this.x,
      this.width,
    ]);
    this.thumb.set({
      x: (posX < 0)
        ? 0
        : posX,
    });
    this.focusCircle.x = this.thumb.x;
  }

  _mousemove(event) {
    event.preventDefault();
    event.stopPropagation();
    const posX = _.min([
      event.stageX - this.x,
      this.width,
    ]);
    this.thumb.set({
      x: (posX < 0)
        ? 0
        : posX,
    });
    this.valueNow = Math.round(this.thumb.x / this.unitValue);
    this.text = this.valueNow;
    this.focusCircle.x = this.thumb.x;
    this.accessible.value = this.valueNow;
    this.callBack();
  }

  set text(val) {
    this.sliderText.text = val;
  }

  _pressUp(event) {
    event.preventDefault();
    event.stopPropagation();
    this.valueNow = Math.round(this.thumb.x / this.unitValue);
    this.callBack();
  }
}
