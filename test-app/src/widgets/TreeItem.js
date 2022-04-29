import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class TreeItem extends createjs.Container {
  constructor(label, tabIndex) {
    super();
    _.bindAll(this, 'onFocus', 'onBlur', 'toggleTreeVisibility', 'update');
    AccessibilityModule.register({
      accessibleOptions: {
        tabIndex,
        text: label,
        value: label,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.TREEITEM,
      events: [
        {
          eventName: 'focus',
          listener: this.onFocus,
        },
        {
          eventName: 'blur',
          listener: this.onBlur,
        },
        {
          eventName: 'keyboardClick',
          listener: this.toggleTreeVisibility,
        },
      ],
    });

    this.treeItems = [];
    this.expanded = false;

    this.label = new createjs.Text(label, '16px Arial');
    this.label.set({
      x: 10,
      y: 3,
    });

    const width = 120;
    const height = 25;

    const bg = new createjs.Shape();
    bg.graphics
      .beginStroke('black')
      .beginFill('#cccbbb')
      .dr(0, 0, width, height);
    bg.setBounds(0, 0, width, height);
    this.addChild(bg);

    this.focusRect = new createjs.Shape();
    this.focusRect.graphics.beginFill('black').dr(0, 0, width, height);
    this.addChild(this.focusRect);
    this.focusRect.visible = false;

    this.addChild(this.label);

    this.collapsedArrow = new createjs.Shape();
    let g = this.collapsedArrow.graphics;
    g.beginStroke('black');
    g.beginFill('grey');
    g.moveTo(0, 0);
    g.lineTo(height / 2, height / 2);
    g.lineTo(0, height);
    g.endStroke();
    g.endFill();
    this.collapsedArrow.x = 4;
    this.addChild(this.collapsedArrow);
    this.collapsedArrow.visible = false;

    this.expandedArrow = new createjs.Shape();
    g = this.expandedArrow.graphics;
    g.beginStroke('black');
    g.beginFill('grey');
    g.moveTo(0, 0);
    g.lineTo(height, 0);
    g.lineTo(height / 2, height / 2);
    g.endStroke();
    g.endFill();
    this.addChild(this.expandedArrow);
    this.expandedArrow.y = 4;
    this.expandedArrow.visible = false;
    this.collapsedArrow.addEventListener('click', this.toggleTreeVisibility);
    this.expandedArrow.addEventListener('click', this.toggleTreeVisibility);
  }

  addTreeItem(item) {
    this.collapsedArrow.visible = true;
    this.label.x = 30;
    this.treeItems.push(item);
    _.forEach(this.treeItems, (treeItem, i) => {
      const { height } = treeItem.getBounds();
      treeItem.x = 20;
      treeItem.y = height + i * height;
    });
  }

  addSubTree(subTree) {
    this.addChild(subTree);
    this.accessible.addChild(subTree);
    this.accessible.subTree = subTree;
    this.subTree = subTree;
    this.subTree.visible = false;
  }

  toggleTreeVisibility(evt) {
    if (!_.isEmpty(this.treeItems)) {
      this.expanded = !this.expanded;
      this.subTree.visible = this.expanded;
      this.collapsedArrow.visible = !this.expanded;
      this.expandedArrow.visible = this.expanded;
      this.update();

      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  update() {
    for (let i = 1; i < this.treeItems.length; i++) {
      this.treeItems[i].y =
        this.treeItems[i - 1].y + this.treeItems[i - 1].getBounds().height;
    }
    if (_.isFunction(this.parent.update)) {
      this.parent.update();
    }
  }

  onFocus(evt) {
    this.focusRect.visible = true;
    this.label.color = 'white';
    evt.preventDefault();
    evt.stopPropagation();
  }

  onBlur() {
    this.focusRect.visible = false;
    this.label.color = 'black';
  }
}
