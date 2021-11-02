import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class ListItem extends createjs.Container {
  constructor(options, tabIndex) {
    super();

    if (options.value) {
      this.value = options.value;
    }
    if (options.text) {
      this._text = new createjs.Text(options.text, '16px Arial');
      this.addChild(this._text);
    }

    AccessibilityModule.register({
      accessibleOptions: { tabIndex, text: options.text },
      displayObject: this,
      role: AccessibilityModule.ROLES.LISTITEM,
    });
  }
}
