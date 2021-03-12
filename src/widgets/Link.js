import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class Link extends createjs.Container {
  constructor(options) {
    super();
    AccessibilityModule.register({
      accessibleOptions: options,
      displayObject: this,
      role: AccessibilityModule.ROLES.LINK,
    });

    this.accessible.download = options.download;
    this.accessible.href = options.href;
    this.accessible.hrefLang = options.hreflang;
    this.accessible.media = options.media;
    this.accessible.rel = options.rel;
    this.accessible.target = options.target;
    this.accessible.type = options.type;
    if (options.text) {
      this._text = new createjs.Text(options.text, '16px Arial', '#0921EA');
      this._text.addEventListener('click', () => {
        window.open(this.accessible.href);
        this._text.color = '#542189';
      });
      const hit = new createjs.Shape();
      hit.graphics.beginFill('#000').drawRect(0, 0, this._text.getMeasuredWidth(), this._text.getMeasuredHeight());
      this._text.hitArea = hit;
      this.addChild(this._text);
      this.accessible.text = options.text;
    }
  }
}
