import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import Radio from './Radio';

export default class RadioGroup extends createjs.Container {
  constructor({ radioData, name, callBack = _.noop }) {
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
    this.options.forEach((data, i) => {
      const radio = new Radio({
        name: data.name,
        value: data.value,
        position: data.position,
        size: data.size,
        tabIndex: 0,
      });
      radio.y = 35 * (i + 1);
      this.addChild(radio);
      this.accessible.addChild(radio);

      const labelText = new createjs.Text(
        data.value,
        'bold 18px Arial',
        '#000'
      );
      labelText.x = 30;
      labelText.y = 35 * (i + 1);
      this.addChild(labelText);
      AccessibilityModule.register({
        displayObject: labelText,
        parent: this,
        role: AccessibilityModule.ROLES.NONE,
        accessibleOptions: {
          text: labelText.text,
        },
      });
      this.radioOption.push(radio);
    });
    this.addInteractionOnRadio();
  }

  addInteractionOnRadio() {
    this.radioOption.forEach((radio) => {
      radio.addEventListener('click', this.onOptionClick);
      radio.addEventListener('keyboardClick', this.onOptionClick);
      radio.addEventListener('focus', () => {
        radio.focus = true;
      });
      radio.addEventListener('blur', () => {
        radio.focus = false;
      });
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
