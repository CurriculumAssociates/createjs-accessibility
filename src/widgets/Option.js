import AccessibilityModule from 'createjs-accessibility';

const VERT_PAD = 2;

export default class Option extends createjs.Container {
  constructor(label, width, height) {
    super();
    AccessibilityModule.register({
      accessibleOptions: {
        text: label,
        value: label,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.OPTION,
    });

    this.selected = false;

    const fontSize = height - VERT_PAD * 2;
    this.setBounds(0, 0, width, height);

    this._bg = new createjs.Shape();
    this._bg.graphics.beginFill('#ffffff').drawRect(0, 0, width, height);
    this.addChild(this._bg);

    this._highlight = new createjs.Shape();
    this._highlight.graphics.beginFill('#31c7ec').drawRect(0, 0, width, height);
    this._highlight.visible = false;
    this.addChild(this._highlight);

    this._label = new createjs.Text(label, `${fontSize}px Arial`);
    this._label.y = VERT_PAD;
    this.addChild(this._label);
  }

  highlight() {
    this._highlight.visible = true;
  }

  unhighlight() {
    this._highlight.visible = false;
  }

  isHighlighted() {
    return this._highlight.visible;
  }

  get value() {
    return this._label.text;
  }
}
