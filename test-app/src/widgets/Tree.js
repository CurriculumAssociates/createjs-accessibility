import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class Tree extends createjs.Container {
  constructor() {
    super();
    AccessibilityModule.register({
      accessibleOptions: { required: true },
      displayObject: this,
      role: AccessibilityModule.ROLES.TREE,
    });
  }

  update() {
    for (let i = 1; i < this.children.length; i++) {
      this.children[i].y =
        this.children[i - 1].y + this.children[i - 1].getBounds().height;
    }
    if (_.isFunction(this.parent.update)) {
      this.parent.update();
    }
  }
}
