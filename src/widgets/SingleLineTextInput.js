import $ from 'jquery';
import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

const PAD = 2;
const MODES = {
  INSERT: 0,
  OVERWRITE: 1,
};

export default class SingleLineTextInput extends createjs.Container {
  constructor(width, height, tabIndex, placeholderText = '') {
    super();
    _.bindAll(this, 'onFocus', 'onBlur', '_onCanvasKeyDown', '_onValueChanged', '_onSelectionChanged', '_onMouseDown', '_onMouseMove', '_onMouseUp');

    AccessibilityModule.register({
      accessibleOptions: { tabIndex },
      displayObject: this,
      role: AccessibilityModule.ROLES.SINGLELINETEXTBOX,
      events: [
        {
          eventName: 'valueChanged',
          listener: this._onValueChanged,
        },
        {
          eventName: 'selectionChanged',
          listener: this._onSelectionChanged,
        },
        {
          eventName: 'focus',
          listener: this.onFocus,
        },
        {
          eventName: 'blur',
          listener: this.onBlur,
        },
        {
          eventName: 'mousedown',
          listener: this._onMouseDown,
        },
        {
          eventName: 'pressmove',
          listener: this._onMouseMove,
        },
        {
          eventName: 'pressup',
          listener: this._onMouseUp,
        },
      ],
    });

    this.setBounds(0, 0, width, height);

    const bg = new createjs.Shape();
    bg.graphics.beginStroke('#000000').setStrokeStyle(1).beginFill('#ffffff').drawRect(0, 0, width, height);
    this.addChild(bg);

    this._selectionDisplay = new createjs.Shape();
    this._selectionDisplay.visible = false;
    this.addChild(this._selectionDisplay);

    const fontSize = height - PAD * 2;
    this._text = new createjs.Text('', `${fontSize}px Arial`);
    this._text.x = PAD;
    this._text.y = PAD;
    this.addChild(this._text);

    this._cursor = new createjs.Shape();
    this._cursor.graphics.beginStroke('#000000').setStrokeStyle(1).moveTo(0, PAD).lineTo(0, fontSize);
    this._cursor.x = PAD;
    this._cursor.visible = false;
    this.addChild(this._cursor);

    this._cursorIndex = 0;
    this._selection = { start: -1, end: -1 };
    this._height = height;

    // Adding placeholder
    const placeholder = new createjs.Text(placeholderText, '20px Arial Bold');
    placeholder.set({ x: 5, y: 5 });
    placeholder.alpha = 0.5;
    this.addChild(placeholder);
    this.placeholder = placeholder;
    this.accessible.placeholder = placeholderText;

    this.addEventListener('click', this.onFocus);
    // todo: handle mouse based blur causing event

    this._mode = MODES.INSERT;
  }

  /**
   * Internal function for updating the string displayed in the text input
   * @access private
   * @param {String} str - string to display
   */
  _updateDisplayString(str) {
    this._text.text = str;
    this.accessible.value = str;
    this.placeholder.visible = _.isEmpty(str);
  }

  /**
   * Event handler for when the text is changed in the DOM translation
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onValueChanged(evt) {
    this._text.text = evt.newValue;
    this.placeholder.visible = _.isEmpty(evt.newValue);
  }

  /**
   * Event handler for when the selection of text in the DOM translation is changed
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onSelectionChanged(evt) {
    this._selection.start = evt.selectionStart;
    this._selection.end = evt.selectionEnd;
    this._cursorIndex = evt.selectionDirection === 'backward' ? this._selection.start : this._selection.end;
    this._cursorToIndex();
    this._updateSelection();
  }

  onFocus(evt) {
    if (!this._cursorTimeline) {
      this._cursor.visible = true;
      this._cursorTimeline = new TimelineMax({ repeat: -1 });
      this._cursorTimeline.call(() => {
        this._cursor.visible = false;
      }, null, null, '+=1');
      this._cursorTimeline.call(() => {
        this._cursor.visible = true;
      }, null, null, '+=1');
    }

    if (evt.type === 'click') {
      // prep for keyboard input
      const canvas = $(this.stage.canvas);
      canvas.focus();
      canvas.on('keydown', this._onCanvasKeyDown);

      // determine cursor x coordinate based on click position vs letters
      const tmp = this._mouseXToLetterIndexAndPos(evt.stageX);
      this._cursorIndex = tmp.index;
      this._cursor.x = tmp.x;
    }
  }

  onBlur() {
    this._cursor.visible = false;
    if (this._cursorTimeline) {
      this._cursorTimeline.kill();
      this._cursorTimeline = undefined;
    }
    $(this.stage.canvas).off('keydown', this._onCanvasKeyDown);
  }

  _incrementCursorPos() {
    this._cursorIndex = Math.min(this._cursorIndex + 1, this._text.text.length);
    this._cursorToIndex();
  }

  _decrementCursorPos() {
    this._cursorIndex = Math.max(this._cursorIndex - 1, 0);
    this._cursorToIndex();
  }

  _onCanvasKeyDown(evt) {
    let evtHandled = false;
    if ((evt.key >= 'a' && evt.key <= 'z') || (evt.key >= '0' && evt.key <= '9')) {
      const char = evt.shiftKey ? evt.key.toUpperCase() : evt.key;
      if (this._isSelectionActive()) {
        this._updateDisplayString([this._text.text.slice(0, this._selection.start), char, this._text.text.slice(this._selection.end)].join(''));
        this._cursorIndex = this._selection.start + 1;
        this._clearSelection();
      } else {
        if (this._mode === MODES.INSERT) {
          this._updateDisplayString([this._text.text.slice(0, this._cursorIndex), char, this._text.text.slice(this._cursorIndex)].join(''));
        } else {
          this._updateDisplayString([this._text.text.slice(0, this._cursorIndex), char, this._text.text.slice(this._cursorIndex + 1)].join(''));
        }
        ++this._cursorIndex;
      }
      this._cursorToIndex();
      evtHandled = true;
    } else if (evt.keyCode === KeyCodes.insert) {
      this._mode = this._mode === MODES.INSERT ? MODES.OVERWRITE : MODES.INSERT;
      evtHandled = true;
    } else if (evt.shiftKey && (evt.keyCode === KeyCodes.right || evt.keyCode === KeyCodes.left)) {
      if (evt.keyCode === KeyCodes.right) {
        this._selection.start = this._selection.start === -1
          ? this._cursorIndex : this._selection.start;
        this._incrementCursorPos();
        this._selection.end = this._cursorIndex;
      } else {
        this._selection.end = this._selection.end === -1 ? this._cursorIndex : this._selection.end;
        this._decrementCursorPos();
        this._selection.start = this._cursorIndex;
      }
      this._updateSelection();
    } else if (evt.keyCode === KeyCodes.right || evt.keyCode === KeyCodes.left) {
      this._clearSelection();
      if (evt.keyCode === KeyCodes.right) {
        this._incrementCursorPos();
      } else {
        this._decrementCursorPos();
      }
      evtHandled = true;
    } else if (evt.keyCode === KeyCodes.home) {
      if (evt.shiftKey) {
        this._selection.start = 0;
        this._selection.end = this._cursorIndex;
        this._updateSelection();
      } else {
        this._clearSelection();
      }
      this._cursorIndex = 0;
      this._cursorToIndex();
      evtHandled = true;
    } else if (evt.keyCode === KeyCodes.end) {
      if (evt.shiftKey) {
        this._selection.start = this._cursorIndex;
        this._selection.end = this._text.text.length;
        this._updateSelection();
      } else {
        this._clearSelection();
      }
      this._cursorIndex = this._text.text.length;
      this._cursorToIndex();
      evtHandled = true;
    } else if (evt.keyCode === KeyCodes.delete) {
      if (this._isSelectionActive()) {
        this._updateDisplayString([this._text.text.slice(0, this._selection.start), this._text.text.slice(this._selection.end)].join(''));
        this._cursorIndex = this._selection.start;
        this._clearSelection();
        this._cursorToIndex();
      } else if (this._cursorIndex < this._text.text.length) {
        this._updateDisplayString([this._text.text.slice(0, this._cursorIndex), this._text.text.slice(this._cursorIndex + 1)].join(''));
        this._cursorToIndex();
      }
      evtHandled = true;
    } else if (evt.keyCode === KeyCodes.backspace) {
      if (this._isSelectionActive()) {
        this._updateDisplayString([this._text.text.slice(0, this._selection.start), this._text.text.slice(this._selection.end)].join(''));
        this._cursorIndex = this._selection.start;
        this._clearSelection();
        this._cursorToIndex();
      } else if (this._cursorIndex > 0) {
        this._updateDisplayString([this._text.text.slice(0, this._cursorIndex - 1), this._text.text.slice(this._cursorIndex)].join(''));
        --this._cursorIndex;
        this._cursorToIndex();
      }
      evtHandled = true;
    }

    if (evtHandled) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  _cursorToIndex() {
    this._cursor.x = this._text._getMeasuredWidth(this._text.text.substring(0,
      this._cursorIndex)) + this._text.x;
  }

  _isSelectionActive() {
    return this._selection.start !== this._selection.end;
  }

  _clearSelection() {
    this._selection.start = -1;
    this._selection.end = -1;
    this._updateSelection();
  }


  _updateSelection() {
    if (this._isSelectionActive()) {
      const selectedStartText = this._text.text.substring(0, this._selection.start);
      const startMeasureWidth = this._text._getMeasuredWidth(selectedStartText);
      const startX = (this._selection.start <= 0 ? 0 : startMeasureWidth) + this._text.x;
      const selectedEndText = this._text.text.substring(0, this._selection.end);
      const width = this._text._getMeasuredWidth(selectedEndText) - startX + PAD;
      this._selectionDisplay.visible = true;
      this._selectionDisplay.graphics.clear().beginFill('#31c7ec').drawRect(startX, 1, width, this._height - 2);
    } else {
      this._selectionDisplay.visible = false;
    }
  }

  _mouseXToLetterIndexAndPos(x) {
    const back = {
      index: -1,
      x: PAD,
    };

    const localPos = this.globalToLocal(x, 0);
    const textBounds = this._text.getBounds();
    if (!textBounds) {
      back.x = PAD;
      back.index = 0;
    } else if (localPos.x >= textBounds.width) {
      back.x = textBounds.width + this._text.x;
      back.index = this._text.text.length;
    } else {
      back.x = textBounds.width + this._text.x;
      back.index = this._text.text.length;
      let prevWidth = PAD;
      for (let i = 1; i <= this._text.text.length; i++) {
        const substr = this._text.text.substring(0, i);
        const width = this._text._getMeasuredWidth(substr);
        if (width > localPos.x) {
          back.x = prevWidth + this._text.x;
          back.index = i - 1;
          break;
        }
        prevWidth = width;
      }
    }

    return back;
  }

  _onMouseDown(evt) {
    this._selection.start = this._mouseXToLetterIndexAndPos(evt.stageX).index;
    this._cursorIndex = this._selection.start;
  }

  _onMouseMove(evt) {
    const tmp = this._mouseXToLetterIndexAndPos(evt.stageX);
    this._selection.end = tmp.index;
    this._cursorIndex = this._selection.end;
    this._cursor.x = tmp.x;
    this._updateSelection();
  }

  _onMouseUp(evt) {
    const tmp = this._mouseXToLetterIndexAndPos(evt.stageX);
    this._selection.end = tmp.index;
    this._cursorIndex = this._selection.end;
    this._cursor.x = tmp.x;
    this._updateSelection();
  }
}
