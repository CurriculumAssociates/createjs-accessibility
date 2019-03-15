import $ from 'jquery';
import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import TimelineMax from 'TimelineMax';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

const PAD = 2;
const MODES = {
  INSERT: 0,
  OVERWRITE: 1,
};

export default class MultiLineTextInput extends createjs.Container {
  constructor(width, height, fontSize, tabIndex) {
    super();
    _.bindAll(this, 'onFocus', 'onBlur', '_onCanvasKeyDown', '_onValueChanged', '_onSelectionChanged', '_onMouseDown', '_onMouseMove', '_onMouseUp');
    AccessibilityModule.register({
      accessibleOptions: { tabIndex },
      displayObject: this,
      role: AccessibilityModule.ROLES.MULTILINETEXTBOX,
    });
    this.addEventListener('valueChanged', this._onValueChanged);
    this.addEventListener('selectionChanged', this._onSelectionChanged);
    this.addEventListener('focus', this.onFocus);
    this.addEventListener('blur', this.onBlur);
    this.addEventListener('mousedown', this._onMouseDown);
    this.addEventListener('pressmove', this._onMouseMove);
    this.addEventListener('pressup', this._onMouseUp);

    this.setBounds(0, 0, width, height);

    const bg = new createjs.Shape();
    bg.graphics.beginStroke('#000000').setStrokeStyle(1).beginFill('#ffffff').drawRect(0, 0, width, height);
    this.addChild(bg);

    this._selectionDisplay = new createjs.Shape();
    this._selectionDisplay.visible = false;
    this.addChild(this._selectionDisplay);

    this._text = new createjs.Text('', `${fontSize}px Arial`);
    this._text.x = PAD;
    this._text.y = PAD;
    this._text.lineWidth = width - PAD * 2; // note: createjs requires spaces to do the wrapping
    this.addChild(this._text);

    this._cursor = new createjs.Shape();
    this._cursor.graphics.beginStroke('#000000').setStrokeStyle(1).moveTo(0, PAD).lineTo(0, fontSize);
    this._cursor.x = PAD;
    this._cursor.visible = false;
    this.addChild(this._cursor);

    this._cursorIndex = 0;
    this._selection = { start: -1, end: -1 };
    this._height = height;

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
  }

  /**
   * Event handler for when the text is changed in the DOM translation
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onValueChanged(evt) {
    this._text.text = evt.newValue;
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

      // determine cursor coordinate based on click position vs letters
      const tmp = this._mousePosToLetterIndexAndPos(evt.stageX, evt.stageY);
      this._cursorIndex = tmp.index;
      this._cursor.x = tmp.x;
      this._cursor.y = tmp.y;
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
    if ((evt.key >= 'a' && evt.key <= 'z') || (evt.key >= '0' && evt.key <= '9') || evt.key === ' ' || evt.keyCode === KeyCodes.enter) {
      let char = evt.shiftKey ? evt.key.toUpperCase() : evt.key;
      if (evt.keyCode === KeyCodes.enter) {
        char = '\n';
      }
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
        this._selection.start = this._selection.start === -1 ? this._cursorIndex : this._selection.start;
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
        // todo
      } else if (this._cursorIndex < this._text.text.length) {
        this._updateDisplayString([this._text.text.slice(0, this._cursorIndex), this._text.text.slice(this._cursorIndex + 1)].join(''));
        this._cursorToIndex();
      }
      evtHandled = true;
    } else if (evt.keyCode === KeyCodes.backspace) {
      if (this._isSelectionActive()) {
        // todo
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
    const lineData = this._getLineData();
    if (lineData.length === 0) {
      this._cursor.x = this._text.x;
      this._cursor.y = 0;
      return;
    }
    const lineIndex = _.findLastIndex(lineData, line => this._cursorIndex >= line.startIndex);
    this._cursor.x = this._text._getMeasuredWidth(this._text.text.substring(lineData[lineIndex].startIndex, this._cursorIndex)) + this._text.x;
    this._cursor.y = lineData[lineIndex].top;
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
      const lineData = this._getLineData();
      const startLineIndex = _.findLastIndex(lineData, line => this._selection.start >= line.startIndex);
      const endLineIndex = _.findLastIndex(lineData, line => this._selection.end >= line.startIndex);
      const startX = this._text._getMeasuredWidth(this._text.text.substring(lineData[startLineIndex].startIndex, this._selection.start)) + this._text.x;
      const endX = this._text._getMeasuredWidth(this._text.text.substring(lineData[endLineIndex].startIndex, this._selection.end)) + this._text.x;
      if (startLineIndex === endLineIndex) {
        this._selectionDisplay.graphics.clear().beginFill('#31c7ec').drawRect(startX, lineData[startLineIndex].top, endX - startX, lineData[startLineIndex].bottom - lineData[startLineIndex].top);
      } else {
        this._selectionDisplay.graphics.clear().beginFill('#31c7ec');
        this._selectionDisplay.graphics.drawRect(startX, lineData[startLineIndex].top, this._text.lineWidth - startX + this._text.x, lineData[startLineIndex].bottom - lineData[startLineIndex].top);
        this._selectionDisplay.graphics.drawRect(this._text.x, lineData[endLineIndex].top, endX - this._text.x, lineData[endLineIndex].bottom - lineData[endLineIndex].top);
        for (let i = startLineIndex + 1; i < endLineIndex; i++) {
          const height = lineData[i].bottom - lineData[i].top;
          this._selectionDisplay.graphics.drawRect(this._text.x, lineData[i].top, this._text.lineWidth, height);
        }
      }
      this._selectionDisplay.visible = true;
    } else {
      this._selectionDisplay.visible = false;
    }
  }

  _getLineData() {
    const back = [];

    const fullString = this._text.text;
    const words = fullString.split(/(\s)/); // note: must match createjs line wrapping regex
    let partial = '';
    let prevBottom = 0;
    for (let i = 0; i < words.length; i++) {
      const prevLength = partial.length;
      partial += words[i];

      this._text.text = partial;
      const bounds = this._text.getBounds();
      if (bounds) {
        const bottom = bounds.y + bounds.height;
        if (bottom > prevBottom) {
          back.push({
            startIndex: prevLength,
            top: prevBottom + this._text.y,
            bottom: bottom + this._text.y,
          });
          prevBottom = bottom;
        }
      }
    }

    return back;
  }

  _mousePosToLetterIndexAndPos(x, y) {
    const back = {
      index: -1,
      x: PAD,
      y: PAD,
    };

    const localPos = this.globalToLocal(x, y);
    const lineData = this._getLineData();
    if (lineData.length === 0) {
      back.index = 0;
      return back;
    }
    let lineIndex = _.findIndex(lineData, data => localPos.y <= data.bottom);
    if (lineIndex === -1) {
      lineIndex = lineData.length - 1;
    }
    back.y = lineData[lineIndex].top;

    const endIndex = lineIndex === (lineData.length - 1) ? this._text.text.length : lineData[lineIndex + 1].startIndex;
    let match = false;
    let prevWidth = PAD;
    for (let i = lineData[lineIndex].startIndex + 1; i <= endIndex && !match; i++) {
      const substr = this._text.text.substring(lineData[lineIndex].startIndex, i);
      const width = this._text._getMeasuredWidth(substr);
      if (width > localPos.x) {
        back.x = prevWidth + this._text.x;
        back.index = i - 1;
        match = true;
      }
      prevWidth = width;
    }
    if (!match) {
      back.x = prevWidth;
      back.index = this._text.text.length;
    }

    return back;
  }

  _onMouseDown(evt) {
    this._selection.start = this._mousePosToLetterIndexAndPos(evt.stageX, evt.stageY).index;
    this._selection.end = this._selection.start;
    this._cursorIndex = this._selection.start;
  }

  _onMouseMove(evt) {
    const tmp = this._mousePosToLetterIndexAndPos(evt.stageX, evt.stageY);
    if (tmp.index <= this._selection.start) {
      this._selection.start = tmp.index;
      this._cursorIndex = this._selection.start;
    } else {
      this._selection.end = tmp.index;
      this._cursorIndex = this._selection.end;
    }
    this._cursor.x = tmp.x;
    this._cursor.y = tmp.y;
    this._updateSelection();
  }

  _onMouseUp(evt) {
    const tmp = this._mousePosToLetterIndexAndPos(evt.stageX, evt.stageY);
    if (tmp.index <= this._selection.start) {
      this._selection.start = tmp.index;
      this._cursorIndex = this._selection.start;
    } else {
      this._selection.end = tmp.index;
      this._cursorIndex = this._selection.end;
    }
    this._cursor.x = tmp.x;
    this._cursor.y = tmp.y;
    this._updateSelection();
  }
}
