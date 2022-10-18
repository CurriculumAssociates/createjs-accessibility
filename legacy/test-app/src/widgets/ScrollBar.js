import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import _ from 'lodash';

const TRACKWIDTH = 10;
const TRACKCOLOR = '#f5f5f5';
const THUMBCOLOR = '#808080';

export default class ScrollBar extends createjs.Container {
  constructor(container, tabIndex, orientation = 'vertical') {
    super();
    _.bindAll(
      this,
      'onMouseDown',
      'onPressMove',
      'onPressUp',
      'onScroll',
      'setFocus'
    );

    this.container = container;

    const { width, height } = this.container.getBounds();
    this.scrollWidth = Math.round(width);
    this.scrollHeight = Math.round(height);

    this.setBounds(0, 0, TRACKWIDTH, this.scrollHeight);
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.SCROLLBAR,
      accessibleOptions: {
        min: 0,
        orientation,
        tabIndex,
        value: 0,
      },
      events: [
        {
          eventName: 'focus',
          listener: this.setFocus,
        },
        {
          eventName: 'scroll',
          listener: this.onScroll,
        },
      ],
    });

    this.contentContainer = this.container.getChildAt(0);
    this.accessible.controls = this.container;

    this.showTrack();
    this.createThumb();
    this.applyMask();

    this.thumbBounds = this.thumb.getBounds();
    this.accessible.max =
      this.scrollHeight - Math.round(this.thumbBounds.height);
    this.factor = this.getFactor();
    this.gapY = 0;

    this.addEvents();
  }

  showTrack() {
    // to just to show on canvas
    const track = new createjs.Shape();
    track.graphics
      .beginFill(TRACKCOLOR)
      .drawRect(0, 0, TRACKWIDTH, this.scrollHeight);
    track.setBounds(0, 0, TRACKWIDTH, this.scrollHeight);

    this.addChild(track);
  }

  createThumb() {
    const { height } = this.contentContainer.getBounds();
    const percent = 1 - (height - this.scrollHeight) / height;
    const thumbHeight = this.scrollHeight * percent;

    const thumb = new createjs.Shape();
    this.thumb = thumb;
    thumb.graphics
      .beginFill(THUMBCOLOR)
      .drawRoundRect(0, 0, TRACKWIDTH, thumbHeight, TRACKWIDTH / 2);
    thumb.setBounds(0, 0, TRACKWIDTH, thumbHeight);

    this.addChild(thumb);
  }

  applyMask() {
    const { x, y } = this.container;
    const shape = new createjs.Shape();
    shape.graphics
      .s('#ff0000')
      .beginStroke(3)
      .drawRect(0, 0, this.scrollWidth, this.scrollHeight);
    shape.x = x;
    shape.y = y;
    this.container.mask = shape;
  }

  addEvents() {
    this.thumb.addEventListener('mousedown', this.onMouseDown);
    this.addEventListener('scroll', this.onScroll);
    this.addEventListener('focus', this.setFocus);
  }

  getFactor() {
    const { height } = this.contentContainer.getBounds();
    const overFlowHeight = height - this.scrollHeight;
    const heightToScroll = this.scrollHeight - this.thumbBounds.height;
    return overFlowHeight / heightToScroll;
  }

  onMouseDown(e) {
    this.dragging = true;
    this.setFocus();
    this.stage.addEventListener('pressmove', this.onPressMove);
    this.stage.addEventListener('pressup', this.onPressUp);
    const cursorPoint = this.stage.globalToLocal(e.stageX, e.stageY);
    const thumbPoint = this.stage.localToGlobal(this.thumb.x, this.thumb.y);
    this.gapY = cursorPoint.y - thumbPoint.y;
  }

  onPressMove(e) {
    if (this.dragging) {
      const cursorPointY = this.stage.globalToLocal(e.stageX, e.stageY).y;
      const thumbY = cursorPointY - this.gapY;
      this.scrollTopTo = thumbY;
    }
  }

  onPressUp() {
    this.dragging = false;
    this.stage.removeEventListener('pressmove', this.onPressMove);
    this.stage.removeEventListener('pressup', this.onPressUp);
  }

  onScroll({ scrollTop }) {
    this.scrollTopTo = scrollTop;
  }

  setFocus() {
    this.accessible.requestFocus();
  }

  set scrollTopTo(scrollTop) {
    const { height } = this.thumbBounds;
    this.thumb.y = Math.max(0, Math.min(scrollTop, this.scrollHeight - height));
    this.accessible.value = this.thumb.y;
    this.accessible.scrollAmount = this.thumb.y;
    this.contentContainer.y = -(this.thumb.y * this.factor);
  }

  set nativeScrollTop(scrollTop) {
    this.accessible.scrollAmount = scrollTop;
  }

  set dragging(value) {
    this.accessible.dragging = value;
  }

  get dragging() {
    return this.accessible.dragging;
  }

  set valueNow(value) {
    this.accessible.valueNow = value;
  }
}
