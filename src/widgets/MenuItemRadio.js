import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import _ from 'lodash';
import Radio from './Radio';
import MenuItem from './MenuItem';

/**
 * See https://www.w3.org/TR/wai-aria/#menuitemradio
 */

export default class MenuItemRadio extends MenuItem {
  constructor(label, tabIndex, callBack = () => {}) {
    super(label, tabIndex);
    _.bindAll(this, 'keyboardClick', 'click');
    this.radio = new Radio({
      name: 'demo',
      value: 'test',
      outerRadius: 6,
      innerRadius: 2,
      highlighterBorder: 2,
      tabIndex: this._nextTab++,
    });
    this.radio.x = 20;
    this.addChild(this.radio);
    this.callBack = callBack;
    this.radio.addEventListener('click', callBack);
    this.radio.addEventListener('keyboardClick', callBack);
    this.radio.addEventListener('focus', () => { this.radio.focus = true; });
    this.radio.addEventListener('blur', () => { this.radio.focus = false; });
    AccessibilityModule.register({
      accessibleOptions: {
        tabIndex,
        text: label,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.MENUITEMRADIO,
      events: [
        {
          eventName: 'keyboardClick',
          listener: this.keyboardClick,
        },
        {
          eventName: 'click',
          listener: this.click,
        },
      ],
    });

    const radioBounds = this.radio.getBounds();
    this._label.x = radioBounds.x + radioBounds.width + 25;
    this._label.y = radioBounds.y;
  }

  keyboardClick(evt) {
    this.radio.dispatchEvent('keyboardClick');
    this.accessible.checked = evt.currentTarget.radio.checked;
  }

  click(evt) {
    this.radio.dispatchEvent('click');
    this.accessible.checked = evt.currentTarget.radio.checked;
  }
}
