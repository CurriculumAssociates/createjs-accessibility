import _ from 'lodash';
import AccessibilityModule from 'createjs-accessibility';

const PADDING = 15;

export default class Tooltip extends createjs.Container {
  constructor({ target, content, position = 'right' }) {
    super();
    _.bindAll(this, 'show', 'hide');
    AccessibilityModule.register({
      accessibleOptions: {
        text: content,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.TOOLTIP,
    });
    if (!target.accessible) {
      throw new Error('Target must be accessible');
    }
    this.target = target;
    target.accessible.describedby = this.accessible._domId;
    this._createContent(content);
    this._setPosition(position);
    target.addEventListener('focus', this.show);
    target.addEventListener('blur', this.hide);
    target.addEventListener('mouseover', this.show);
    target.addEventListener('mouseout', this.hide);
    this.hide();
  }

  _createContent(text) {
    const content = new createjs.Text().set({
      text,
      color: 'white',
      font: '16px Arial',
      lineWidth: 300,
    });
    this.addChild(content);
    this.target.accessible.title = text;

    content.set({
      x: 5,
      y: 5,
    });

    const { width, height } = content.getBounds();
    const background = new createjs.Shape();
    background.graphics.beginFill('black').drawRoundRect(0, 0, width + 10, height + 10, 5);
    this.addChildAt(background, 0);
  }

  _setPosition(position) {
    const { x, y } = this.target;
    const { width, height } = this.target.getBounds();
    let xPos = x;
    let yPos = y;
    switch (position) {
      case 'left':
        xPos -= this.getBounds().width + PADDING;
        break;
      case 'top':
        yPos -= this.getBounds().height + PADDING;
        break;
      case 'bottom':
        yPos += height + PADDING;
        break;
      case 'right':
      default:
        xPos += width + PADDING;
        break;
    }
    this.set({ x: xPos, y: yPos });
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
