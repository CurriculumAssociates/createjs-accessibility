import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

const CONTENT_AREA_WIDTH = 800;
const CONTENT_AREA_HEIGHT = 600;
const DURATION = 30;

export default class Marquee extends createjs.Container {
  constructor({
    text,
    behaviour = 'scroll',
    direction = 'left',
    loop = -1,
  } = {}) {
    super();
    AccessibilityModule.register({
      accessibleOptions: { text },
      displayObject: this,
      role: AccessibilityModule.ROLES.MARQUEE,
    });
    this.loop = loop;
    this.text = new createjs.Text(text, 'bold 16px Arial', '#000');
    this.text.textAlign = 'center';
    this.text.textBaseline = 'middle';
    this.addChild(this.text);
    const bounds = this.getBounds();
    this.width = bounds.width;
    this.height = bounds.height;

    if (direction === 'up') {
      this.x = CONTENT_AREA_WIDTH * 0.5 - this.width * 0.5;
      this.y = CONTENT_AREA_HEIGHT;
    } else if (direction === 'down') {
      this.x = CONTENT_AREA_WIDTH * 0.5 + this.width * 0.5;
      this.y = 0;
    } else if (direction === 'left') {
      this.x = 0;
      this.y = CONTENT_AREA_HEIGHT * 0.3;
    } else if (direction === 'right') {
      this.x = CONTENT_AREA_WIDTH;
      this.y = CONTENT_AREA_HEIGHT * 0.8;
    }
    let config = {};
    const scroll = {
      right: {
        x: -this.width,
        y: this.y,
      },
      left: {
        x: CONTENT_AREA_WIDTH + this.width,
        y: this.y,
      },
      up: {
        x: this.x,
        y: -this.height,
      },
      down: {
        x: this.x,
        y: CONTENT_AREA_HEIGHT + this.height,
      },
    };

    const slide = {
      right: {
        x: this.width * 0.5,
        y: this.y,
      },
      left: {
        x: CONTENT_AREA_WIDTH - this.width * 0.5,
        y: this.y,
      },
      up: {
        x: this.x,
        y: this.height,
      },
      down: {
        x: this.x,
        y: CONTENT_AREA_HEIGHT - this.height * 6,
      },
    };
    const alternate = {
      right: {
        x: this.width * 0.5,
        y: this.y,
      },
      left: {
        x: CONTENT_AREA_WIDTH - this.width * 0.5,
        y: this.y,
      },
      up: {
        x: this.x,
        y: this.height,
      },
      down: {
        x: this.x,
        y: CONTENT_AREA_HEIGHT - this.height * 6,
      },
    };
    switch (behaviour) {
      case 'scroll':
        config = {
          yoyo: true,
          repeat: loop,
          x: scroll[direction].x,
          y: scroll[direction].y,
        };
        break;
      case 'slide':
        config = {
          yoyo: false,
          repeat: 0,
          x: slide[direction].x,
          y: slide[direction].y,
        };
        break;
      case 'alternate':
        config = {
          yoyo: true,
          repeat: loop,
          x: alternate[direction].x,
          y: alternate[direction].y,
        };
        break;
      default:
        break;
    }
    const tl = new TimelineMax({ yoyo: config.yoyo, repeat: config.repeat });
    tl.to(this, DURATION, config);
  }
}
