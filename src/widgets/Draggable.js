import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import MenuItem from './MenuItem.js';
import Button from './Button.js';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class Draggable extends createjs.Container {
  constructor(options, dropArr, tabIndex, callBack) {
    super();
    _.bindAll(this, 'onDragStart', 'onDrag', 'onDragEnd', 'moveToTarget', 'cancelMoving', 'showHideMenu', 'toggleMenuVisibility', 'navigateMenu');
    this.dropTargets = dropArr;
    this.tabIndex = tabIndex;
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.NONE,
    });
    this._createButton(options, tabIndex, callBack);
    this._createDropTargetMenu();
    this._addInteraction();
  }

  //
  _createButton(options, tabIndex, callBack) {
    this.button = new Button(options, tabIndex, callBack);
    this.addChild(this.button);
    this.accessible.addChild(this.button);
  }

  // crateing drop zones menu
  _createDropTargetMenu() {
    const menuItemContainer = new createjs.Container();
    this.addChild(menuItemContainer);
    AccessibilityModule.register({
      accessibleOptions: {
        text: 'Drop zones',
      },
      displayObject: menuItemContainer,
      parent: this,
      role: AccessibilityModule.ROLES.MENU,
    });

    // drop zone menu item
    for (let i = 0; i < this.dropTargets.length; i++) {
      const menuItem = new MenuItem(this.dropTargets[i].label, this.tabIndex++);
      menuItem.label = this.dropTargets[i].label;
      menuItem.y = menuItem.getBounds().height * i;
      menuItemContainer.addChild(menuItem);
      menuItemContainer.accessible.addChild(menuItem);

      // Adding interaction
      menuItem.addEventListener('mousedown', this.moveToTarget);
      menuItem.addEventListener('keyboardClick', this.moveToTarget);
    }

    // cancel moving menu item
    const cancelItem = new MenuItem('cancel', this.tabIndex++);
    cancelItem.y = cancelItem.getBounds().height * this.dropTargets.length;
    menuItemContainer.addChild(cancelItem);
    menuItemContainer.accessible.addChild(cancelItem);

    cancelItem.addEventListener('mousedown', this.cancelMoving);
    cancelItem.addEventListener('keyboardClick', this.cancelMoving);

    menuItemContainer.y = this.button.height;
    this.menuItemContainer = menuItemContainer;
    this.toggleMenuVisibility(false);
  }

  cancelMoving() {
    this.toggleMenuVisibility(false);
  }

  moveToTarget(evt) {
    const { currentTarget } = evt;
    const dropTarget = _.find(this.dropTargets, drop => drop.label === currentTarget.label);
    if (!dropTarget.placed) {
      this.drop(dropTarget);
    } else {
      this.swap(dropTarget);
    }
    this.toggleMenuVisibility(false);
  }

  _addInteraction() {
    this.addEventListener('mousedown', this.onDragStart);
    this.addEventListener('pressmove', this.onDrag);
    this.addEventListener('pressup', this.onDragEnd);
    this.button.addEventListener('keyboardClick', this.showHideMenu);
  }

  // when draggable is picked up
  onDragStart(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    // if draggable is picked when its already in drop zone
    if (!_.isUndefined(this.targetId)) {
      const dropTarget = _.find(this.dropTargets, drop => drop.id === this.targetId);
      dropTarget.placed = false;
      this.targetId = undefined;
    }

    this.accessible.grabbed = true;
    this.hGap = evt.stageX - this.x;
    this.vGap = evt.stageY - this.y;
    this.parent.addChild(this);
  }

  // while dragging
  onDrag(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    this.set({
      x: (evt.stageX - this.hGap),
      y: (evt.stageY - this.vGap),
    });
  }

  // on leaving drag
  onDragEnd(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    this.accessible.grabbed = false;
    _.forEach(this.dropTargets, (dropTarget) => {
      if (this.checkCollision(this, dropTarget) && !dropTarget.placed) {
        this.drop(dropTarget);
      } else if (this.checkCollision(this, dropTarget)) {
        this.swap(dropTarget);
      }
    });

    if (_.isUndefined(this.targetId)) {
      this.revert();
    }
  }

  // To check collision between dropzone and draggable
  checkCollision(rect1, rect2) {
    const rect1Bounds = rect1.getBounds();
    rect1.set({ width: rect1Bounds.width, height: rect1Bounds.height });

    const rect2Bounds = rect2.getBounds();
    rect2.set({ width: rect2Bounds.width, height: rect2Bounds.height });

    return !(rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x || rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y);
  }

  // drop current draggable into respective drop zone
  drop(dropTarget) {
    this.set({
      x: dropTarget.x,
      y: dropTarget.y,
    });
    dropTarget.placed = true;
    dropTarget.draggable = this;
    this.targetId = dropTarget.id;
  }

  // swap the draggable with previous one on drop zone
  swap(dropTarget) {
    const previousDrag = dropTarget.draggable;
    this.drop(dropTarget);
    previousDrag.set({
      x: previousDrag.origX,
      y: previousDrag.origY,
    });
    previousDrag.targetId = undefined;
  }

  // revert back to original posiiton
  revert() {
    this.set({
      x: this.origX,
      y: this.origY,
    });

    if (!_.isUndefined(this.targetId)) {
      this.targetId = undefined;
    }
  }

  // Hnadles visibility of menu items
  toggleMenuVisibility(boolean = true) {
    this.menuItemContainer.visible = boolean;
    this.menuItemContainer.children.forEach(child => child.visible = boolean);

    // To navigate between drop zone menu items
    if (boolean) {
      this.currentIndex = -1;
      document.addEventListener('keydown', this.navigateMenu);
    } else {
      document.removeEventListener('keydown', this.navigateMenu);
    }
  }

  // To navigate between drop zone menu items
  navigateMenu(evt) {
    if (evt.keyCode === KeyCodes.up || evt.keyCode === KeyCodes.down) {
      let nextIndex;
      if (evt.keyCode === KeyCodes.up) {
        nextIndex = (this.currentIndex - 1 < 0) ? this.currentIndex : this.currentIndex - 1;
      } else {
        nextIndex = (this.currentIndex + 1 > this.menuItemContainer.children.length - 1) ? this.currentIndex : this.currentIndex + 1;
      }

      if (nextIndex >= 0) {
        this.menuItemContainer.children[nextIndex].accessible.requestFocus();
        this.currentIndex = nextIndex;
      }

      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  showHideMenu(evt) {
    this.toggleMenuVisibility(!this.menuItemContainer.visible);
  }
}
