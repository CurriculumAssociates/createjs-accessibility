import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';


/**
 * See https://www.w3.org/TR/wai-aria/roles#menu
 */
export default class Menu extends createjs.Container {
  constructor(label, menuBarHeight, tabIndex, accessKey) {
    super();
    _.bindAll(this, 'openMenu', 'closeMenu', '_onClick', 'onFocus', 'onBlur');

    AccessibilityModule.register({
      accessibleOptions: {
        expanded: false,
        hasPopUp: true,
        text: label,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.MENUITEM,
    });

    this._focusIndicator = new createjs.Shape();
    this._focusIndicator.visible = false;
    this.addChild(this._focusIndicator);

    this._label = new createjs.Text(label, '16px Arial');
    this._label.y = (menuBarHeight - this._label.getBounds().height) / 2;
    AccessibilityModule.register({
      accessibleOptions: {
        accessKey,
        expanded: false,
        hasPopUp: true,
        text: label,
        tabIndex,
      },
      displayObject: this._label,
      parent: this,
      role: AccessibilityModule.ROLES.MENUITEM,
    });
    this.addChild(this._label);
    const charArr = label.split('');
    const font = '16px Arial';
    const index = _.indexOf(charArr, accessKey);
    const accessKeyText = new createjs.Text(`${accessKey}`, font);
    const accesKeyTextWidth = accessKeyText.getBounds().width;
    let totalWidth = 0;
    for (let i = 0; i < index; i++) {
      const text = new createjs.Text(`${charArr[i]}`, font);
      totalWidth += text.getBounds().width;
    }

    const underlineStartX = this._label.x + totalWidth;
    const {
      x, y, width, height,
    } = this._label.getBounds();
    const underLine = new createjs.Shape();
    underLine.graphics.setStrokeStyle(3);
    underLine.graphics.beginStroke('#FF4500');
    underLine.graphics.moveTo(underlineStartX, height + 2);
    underLine.graphics.lineTo(underlineStartX + accesKeyTextWidth, height + 2);
    underLine.graphics.endStroke();
    this.addChild(underLine);

    this._focusIndicator.graphics
      .beginFill('#31c7ec')
      .drawRect(x, 0, width, menuBarHeight);
    this._itemContainer = new createjs.Container();
    this._itemContainer.y = menuBarHeight;
    this._itemContainer.visible = false;
    AccessibilityModule.register({
      accessibleOptions: { text: label },
      displayObject: this._itemContainer,
      parent: this,
      role: AccessibilityModule.ROLES.MENU,
    });
    this.addChild(this._itemContainer);

    this._itemContainer._bg = new createjs.Shape();
    this._itemContainer.addChild(this._itemContainer._bg);

    this._label.hitArea = new createjs.Shape();
    this._label.hitArea.graphics.beginFill('#ff0000').drawRect(x, y, width, height);
    this._label.addEventListener('click', this._onClick);
    this._label.addEventListener('openMenu', this.openMenu);
    this._label.addEventListener('closeMenu', this.closeMenu);
    this._label.addEventListener('focus', this.onFocus);
    this._label.addEventListener('blur', this.onBlur);
  }

  /**
   * Adds a menu item to the menu
   * @param {!MenuItem} menuItem - Menu item to add
   */
  addMenuItem(menuItem) {
    if (this._itemContainer.children.length === 1) { // note: 1 due to background
      menuItem.y = 0;
    } else {
      const oldLastItem = this._itemContainer.children[this._itemContainer.children.length - 1];
      const tmpBounds = oldLastItem.getBounds();
      menuItem.y = oldLastItem.y + tmpBounds.y + tmpBounds.height;
    }

    this._itemContainer.addChild(menuItem);
    this._itemContainer.accessible.addChild(menuItem);

    const bounds = this._itemContainer.getBounds();
    this._itemContainer._bg.graphics
      .clear()
      .beginFill('#aaaaaa')
      .drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
    this._itemContainer.children.forEach((item) => {
      if (item.setMenuWidth) {
        item.setMenuWidth(bounds.x, bounds.width);
      }
    });
  }

  /**
   * Instructs the popup menu to open
   */
  openMenu() {
    this._itemContainer.visible = true;
    this.accessible.expanded = true;
    this._label.accessible.expanded = true;
  }

  /**
   * Instructs the popup menu to close
   */
  closeMenu() {
    this._itemContainer.visible = false;
    this.accessible.expanded = false;
    this._label.accessible.expanded = false;
  }

  _onClick() {
    this._itemContainer.visible = !this._itemContainer.visible;
    this.accessible.expanded = this._itemContainer.visible;
    this._label.accessible.expanded = this._itemContainer.visible;
    if (this.accessible.expanded) {
      this.dispatchEvent('menuOpened');
    }
  }

  onFocus() {
    this._focusIndicator.visible = true;
  }

  onBlur() {
    this._focusIndicator.visible = false;
  }
}
