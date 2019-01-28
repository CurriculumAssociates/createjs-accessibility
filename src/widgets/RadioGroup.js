import _ from 'lodash';
import Radio from './Radio.js';
import AccessibilityModule from 'createjs-accessibility';

export default class RadioGroup extends createjs.Container {
  constructor({ radioData, name, tabIndex, callBack = _.noop }) {
    super();
    _.bindAll(this, 'onOptionClick');
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.RADIOGROUP,
    });
    this.name = name;
    this.callBack = callBack;
    this.options = radioData;
    this.radioOption = [];
    this.tabIndex = tabIndex;
    this.options.forEach((data, i) => {
      const radio = new Radio({ name: data.name, value: data.value, position: data.position, size: data.size, tabIndex: this.tabIndex++ });
      radio.y = 35 * (i + 1);
      this.addChild(radio);
      this.accessible.addChild(radio);

      const labelText = new createjs.Text(data.value, 'bold 18px Arial', '#000');
      labelText.x = 30;
      labelText.y = 35 * (i + 1);
      this.addChild(labelText);
      AccessibilityModule.register({
        displayObject: labelText,
        parent: this,
        role: AccessibilityModule.ROLES.NONE,
      });
      this.radioOption.push(radio);
    });
    this.addInteractionOnRadio();
  }

  addInteractionOnRadio() {
    this.radioOption.forEach((radio, i) => {
      radio.addEventListener('click', this.onOptionClick);
      radio.addEventListener('keyboardClick', this.onOptionClick);
      radio.addEventListener('focus', () => radio.focus = true);
      radio.addEventListener('blur', () => radio.focus = false);
    });
  }

  onOptionClick(evt) {
    this.radioOption.forEach((opt) => {
      opt.checked = false;
    });
    evt.currentTarget.checked = true;
    this.callBack();
  }
}
