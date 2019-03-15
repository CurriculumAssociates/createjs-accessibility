import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

const ITEM_PADDING = 50;

export default class ToolBar extends createjs.Container {
  constructor(width, height) {
    super();
    this._toolMenus = [];
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.TOOLBAR,
    });
  }

  /**
   * Adds a menu to the menu bar
   * @param {!Tool} tool - tool to add
   */
  addTool(tool) {
    let x;
    if (this._toolMenus.length === 0) {
      x = ITEM_PADDING;
    } else {
      const lastItem = this._toolMenus[this._toolMenus.length - 1];
      const bounds = lastItem.getBounds();
      x = lastItem.x + bounds.x + bounds.width + ITEM_PADDING;
    }
    tool.x = x;
    this._toolMenus.push(tool);
    this.addChild(tool);
    this.accessible.addChild(tool);
  }
}
