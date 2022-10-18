import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class Article extends createjs.Container {
  constructor({ position, size } = {}) {
    super();
    AccessibilityModule.register({
      accessibleOptions: { position, size },
      displayObject: this,
      role: AccessibilityModule.ROLES.ARTICLE,
    });
    this._y = 0;
  }

  /**
   * Adds a new text section to the article
   * @param {AccessibilityObject} text - text to add to the article
   */
  addSection(text) {
    text.y = this._y;
    this._y += text.getBounds().height;
    this._y += text.getMeasuredLineHeight();
    this.addChild(text);
    this.accessible.addChild(text);
  }
}
