import _ from 'lodash';
import AccessibilityModule from 'createjs-accessibility';

export default class FormatText extends createjs.Container {
  constructor(prefixText, value, role, fontType = '', fontSize, fontFamily = 'Arial') {
    super();

    const { ROLES } = AccessibilityModule;
    const flag = role === ROLES.FORMAT_TEXT_PREFORMAT;
    AccessibilityModule.register({
      displayObject: this,
      role: flag ? ROLES.FORMAT_TEXT_PREFORMAT : ROLES.PARAGRAPH,
    });
    const prefix = new createjs.Text(prefixText, `22px ${fontFamily}`);
    this.addChild(prefix);
    AccessibilityModule.register({
      displayObject: prefix,
      parent: this,
      role: ROLES.SPAN,
    });

    const label = new createjs.Text(value, `${fontType} ${fontSize} ${fontFamily}`);
    this.addChild(label);
    AccessibilityModule.register({
      displayObject: label,
      parent: this,
      role,
    });
    label.set({ x: prefix.getBounds().width, y: prefix.getBounds().y });
    label.fontSize = fontSize.split('px')[0];
    this.label = label;
    this.formatText(role);
  }

  getTextHeight(textObj) {
    const { lines } = textObj.getMetrics();

    return lines.length * this.label.fontSize;
  }

  formatText(role) {
    const drawLine = (x1, y1, x2, y2) => {
      const line = new createjs.Shape();
      line.graphics.setStrokeStyle(2);
      line.graphics.beginStroke('#000');
      line.graphics.moveTo(x1, y1);
      line.graphics.lineTo(x2, y2);
      return line;
    };

    const { ROLES } = AccessibilityModule;
    switch (role) {
      case ROLES.FORMAT_TEXT_STRIKETHROUGH: {
        const x1 = this.label.x;
        const y1 = this.label.y + this.getTextHeight(this.label) * 0.5 + 2;
        const x2 = this.label.x + this.label.getMeasuredWidth();
        const y2 = this.label.y + this.getTextHeight(this.label) * 0.5 + 2;

        const strikethrough = drawLine(x1, y1, x2, y2);
        this.addChild(strikethrough);
      }
        break;

      case ROLES.FORMAT_TEXT_DELETE:
        {
          const x1 = this.label.x;
          const y1 = this.label.y + this.getTextHeight(this.label) * 0.5 + 2;
          const x2 = this.label.x + this.label.getMeasuredWidth();
          const y2 = this.label.y + this.getTextHeight(this.label) * 0.5 + 2;
          const deleted = drawLine(x1, y1, x2, y2);
          this.addChild(deleted);
        }
        break;

      case ROLES.FORMAT_TEXT_INSERT:
      case ROLES.FORMAT_TEXT_UNDERLINE:
        {
          const x1 = this.label.x;
          const y1 = this.label.y + this.getTextHeight(this.label);
          const x2 = this.label.x + this.label.getMeasuredWidth();
          const y2 = this.label.y + this.getTextHeight(this.label);
          const inserted = drawLine(x1, y1, x2, y2);
          this.addChild(inserted);
        }
        break;

      case ROLES.FORMAT_TEXT_SMALL:
        this.label.font = 'smaller';
        this.label.y = this.label.y + this.getTextHeight(this.label) * 0.5;
        break;

      case ROLES.FORMAT_TEXT_SUBSCRIPT:
        this.label.font = 'smaller';
        this.label.y += this.getTextHeight(this.label);
        break;

      case ROLES.FORMAT_TEXT_SUPERSCRIPT:
        this.label.font = 'smaller';
        this.label.textBaseline = 'top';
        break;

      case ROLES.FORMAT_TEXT_TIME:
        const date = new Date();
        this.label.accessible._reactProps.dateTime = date;
        break;
      default:
        break;
    }
  }
}
