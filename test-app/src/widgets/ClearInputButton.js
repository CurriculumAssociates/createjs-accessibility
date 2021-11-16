import _, { noop } from 'lodash';
import Button from './Button';

export default class ClearInputButton extends Button {
  constructor(options, tabIndex, callBack = _.noop) {
    super(options, tabIndex, callBack);
  }

  _fillBackground(color) {
    this.background.graphics.beginFill(color).drawCircle(0, 0, this.height * 0.5);
  }

  _onMouseDown() {
    noop();
  }

  _onMouseUp() {
    noop();
  }

  _addBackground() {
    this.background = new createjs.Shape();
    this._fillBackground('grey');
    this.addChild(this.background);
  }

  _addFocusIndicator() {
    this.focusIndicator = new createjs.Shape();
    this.focusIndicator.name = 'focusIndicator';
    this.focusIndicator.graphics.beginStroke('black').setStrokeStyle(3).drawCircle(0, 0, this.height * 0.55);
    this.addChild(this.focusIndicator);
    this.focusIndicator.visible = false;
  }

  _addText() {
    this.text = new createjs.Text('x', `${this.height}px Arial`, 'white');
    const textBounds = this.text.getBounds();
    this.text.set({ x: -(textBounds.width * 0.5), y: -(textBounds.height * 0.5) });
    this.addChild(this.text);
  }
}
