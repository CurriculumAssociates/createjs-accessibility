import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

const ITEM_PADDING = 10;

/**
 * See https://www.w3.org/TR/wai-aria/roles#menubar.  The structuring of DisplayObjects in the menu bar, menu, and menu item widgets is based on https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-2/menubar-2.html
 */
export default class MenuBar extends createjs.Container {
  constructor(width, height, label) {
    super();

    this._bg = new createjs.Shape();
    this.addChild(this._bg);
    this.resize(width, height);

    this._menus = [];

    AccessibilityModule.register({
      accessibleOptions: { text: label },
      displayObject: this,
      role: AccessibilityModule.ROLES.MENUBAR,
    });
  }

  /**
   * Resizes the menu bar to the specified dimensions
   * @param {!Number} width - width of the window in pixels
   * @param {!Number} height - height of the window in pixels
   */
  resize(width, height) {
    this.setBounds(0, 0, width, height);
    this._bg.graphics
      .clear()
      .beginFill('#aaaaaa')
      .drawRect(0, 0, width, height)
    ;
  }

  /**
   * Adds a menu to the menu bar
   * @param {!Menu} menu - Menu to add
   */
  addMenu(menu) {
    let x;
    if (this._menus.length === 0) {
      x = ITEM_PADDING;
    } else {
      const lastItem = this._menus[this._menus.length - 1];
      const bounds = lastItem.getBounds();
      x = lastItem.x + bounds.x + bounds.width + ITEM_PADDING;
    }
    menu.x = x;

    menu.addEventListener('menuOpened', () => {
      this._closeMenus(menu);
    });

    this._menus.push(menu);
    this.addChild(menu);
    this.accessible.addChild(menu);
  }

  _closeMenus(menu) {
    this._menus.forEach((iterMenu) => {
      if (iterMenu !== menu) {
        iterMenu.closeMenu();
      }
    });
  }
}
