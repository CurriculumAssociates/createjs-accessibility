import AccessibilityModule from 'createjs-accessibility';

export default class UnorderedList extends createjs.Container {
  constructor(tabIndex) {
    super();
    AccessibilityModule.register({
      accessibleOptions: { tabIndex },
      displayObject: this,
      role: AccessibilityModule.ROLES.UNORDEREDLIST,
    });
  }

  /**
   * Adds a list item to the list
   * @param {!ListItem} listItem - List item to add
   * @param {Number} y - List item y
   * @param {String} value - List item value
   */
  addListItem(listItem, y, value) {
    const bullet = new createjs.Text(String.fromCharCode(8226), '16px Arial');
    bullet.y = y;
    this.addChild(bullet);
    this.addChild(listItem);
    this.accessible.addChild(listItem);
    listItem.x = 22;
    listItem.y = y;
  }
}
