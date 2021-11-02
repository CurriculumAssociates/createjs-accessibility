import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

const ITEM_PADDING = 2;

export default class TabList extends createjs.Container {
  constructor(width, height, orientation) {
    super();
    this._tabList = [];
    this.setBounds(0, 0, width, height);
    AccessibilityModule.register({
      accessibleOptions: { orientation },
      displayObject: this,
      role: AccessibilityModule.ROLES.TABLIST,
    });
  }

  /**
   * Adds a tabs to the tablist
   * @param {!Tool} tab - tab button
   */
  addTab(tab) {
    let x;
    if (this._tabList.length === 0) {
      x = ITEM_PADDING;
    } else {
      const lastItem = this._tabList[this._tabList.length - 1];
      const bounds = lastItem.getBounds();
      x = lastItem.x + bounds.x + bounds.width + ITEM_PADDING;
    }
    tab.x = x;
    this._tabList.push(tab);
    this.addChild(tab);
    this.accessible.addChild(tab);
  }
}
