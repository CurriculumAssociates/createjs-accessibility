import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import Button from './Button';

export default class SpinButton extends createjs.Container {
  constructor({
    options, textContainer, callback, tabIndex,
  }) {
    super();
    const { maxValue, minValue } = options;
    this.tabIndex = tabIndex;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.targetContainer = textContainer;
    this.callback = callback;

    this._width = options.width;
    this._height = options.height;
    this.currentValue = Number(textContainer.text);
    textContainer.text = this.currentValue;

    AccessibilityModule.register({
      accessibleOptions: {
        max: maxValue,
        min: minValue,
        readOnly: false,
        required: true,
        tabIndex,
        value: this.currentValue,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.SPINBUTTON,
      events: [
        {
          eventName: 'increment',
          listener: this.onIncrement,
        },
        {
          eventName: 'decrement',
          listener: this.onDecrement,
        },
        {
          eventName: 'change',
          listener: this.onChange,
        },
      ],
    });

    this.setBounds(0, 0, this.width, this.height);
    this.createButtons();
  }

  createButtons() {
    const options = {
      type: 'button',
      value: '+',
      name: 'Increment',
      enabled: true,
      autoFocus: false,
      width: this.width,
      height: this.height * 0.5,
    };
    // Increment button
    this.incBtn = new Button(options, -1, this.onIncrement.bind(this));
    this.addChild(this.incBtn);

    // Decrement button
    options.value = '-';
    options.name = 'Decrement';
    this.decBtn = new Button(options, -1, this.onDecrement.bind(this));
    this.addChild(this.decBtn);

    this.decBtn.y = this.height * 0.5;
  }

  onIncrement() {
    this.currentValue = ((this.currentValue + 1) > this.maxValue)
      ? this.maxValue : this.currentValue + 1;
    this.updateTargetValue();
  }

  onDecrement() {
    this.currentValue = ((this.currentValue - 1) < this.minValue)
      ? this.minValue : this.currentValue - 1;
    this.updateTargetValue();
  }

  onChange(evt) {
    this.currentValue = evt.value;
    this.updateTargetValue();
  }

  updateTargetValue() {
    this.targetContainer.text = this.currentValue;
    this.accessible.value = this.currentValue;
    this.callback();
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}
