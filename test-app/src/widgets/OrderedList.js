import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class OrderedList extends createjs.Container {
  constructor(options, tabIndex) {
    super();
    AccessibilityModule.register({
      acccessibleOptions: { tabIndex },
      displayObject: this,
      role: AccessibilityModule.ROLES.ORDEREDLIST,
    });

    if (options.reversed) {
      this.accessible.reversed = true;
    }
    if (options.start) {
      this.accessible.start = options.start;
    }
    if (options.type) {
      this.accessible.type = options.type;
    }
  }

  /**
   * Adds a list item to the list
   * @param {!ListItem} listItem - List item to add
   * @param {Number} y - List item y
   * @param {String} value - List item value
   */
  addListItem(listItem, y, value = listItem.value) {
    let label;
    if (this.accessible.reversed) {
      label = new createjs.Text(
        `${String.fromCharCode(
          this.accessible.type.charCodeAt(0) +
            parseInt(this.accessible.start, 10) -
            value -
            1
        )}.`,
        '16px Arial'
      );
    } else {
      label = new createjs.Text(
        `${String.fromCharCode(
          this.accessible.type.charCodeAt(0) +
            parseInt(this.accessible.start, 10) +
            value -
            1
        )}.`,
        '16px Arial'
      );
    }
    label.y = y;
    this.addChild(label);

    this.addChild(listItem);
    this.accessible.addChild(listItem);
    listItem.x = 22;
    listItem.y = y;
    listItem.value = value;
  }
}
