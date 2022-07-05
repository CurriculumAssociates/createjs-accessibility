import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class Link extends createjs.Container {
  constructor(options) {
    super();
    _.bindAll(this, '_onFocus', '_onBlur', '_onClick');
    AccessibilityModule.register({
      accessibleOptions: options,
      displayObject: this,
      role: AccessibilityModule.ROLES.LINK,
      events: [
        {
          eventName: 'focus',
          listener: this._onFocus,
        },
        {
          eventName: 'blur',
          listener: this._onBlur,
        },
        {
          eventName: 'keyboardClick',
          listener: this._onClick,
        },
      ],
    });

    this._focusIndicator = new createjs.Shape();
    this._focusIndicator.visible = false;

    this.addChild(this._focusIndicator);

    this.accessible.download = options.download;
    this.accessible.href = options.href;
    this.accessible.hrefLang = options.hreflang;
    this.accessible.media = options.media;
    this.accessible.rel = options.rel;
    this.accessible.target = options.target;
    this.accessible.type = options.type;
    this.accessible.tabIndex = options.tabIndex;
    if (options.text) {
      this._text = new createjs.Text(options.text, '16px Arial', '#0921EA');
      this._text.addEventListener('click', this._onClick);

      const { x, width, height } = this._text.getBounds();
      const paddingTopLeft = -3;
      const paddingWidthHeight = 5;
      this._focusIndicator.graphics
        .setStrokeStyle(2)
        .beginStroke('#000000')
        .drawRect(
          x + paddingTopLeft,
          paddingTopLeft,
          width + paddingWidthHeight,
          height + paddingWidthHeight
        );

      this._text.addEventListener('focus', this._onFocus);
      this._text.addEventListener('blur', this._onBlur);

      const hit = new createjs.Shape();
      hit.graphics
        .beginFill('#000')
        .drawRect(
          0,
          0,
          this._text.getMeasuredWidth(),
          this._text.getMeasuredHeight()
        );
      this._text.hitArea = hit;
      this.addChild(this._text);
      this.accessible.text = options.text;
    }
  }

  _onClick() {
    window.open(this.accessible.href, '_blank');
    this._text.color = '#542189';
  }

  _onFocus() {
    this._focusIndicator.visible = true;
  }

  _onBlur() {
    this._focusIndicator.visible = false;
  }
}
