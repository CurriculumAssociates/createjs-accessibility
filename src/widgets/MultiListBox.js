import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class MultiListBox extends createjs.Container {
  constructor(options, width, height, tabIndex) {
    super();
    _.bindAll(this, 'onFocus', 'onBlur', '_onClickUp', '_onValueChanged');
    AccessibilityModule.register({
      accessibleOptions: {
        multiple: true,
        tabIndex,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.MULTISELECTLISTBOX,
      events: [
        {
          eventName: 'focus',
          listener: this.onFocus,
        },
        {
          eventName: 'blur',
          listener: this.onBlur,
        },
        {
          eventName: 'valueChanged',
          listener: this._onValueChanged,
        }
      ],
    });

    this._options = options;

    this._createView(width, height * options.length, height);
  }

  onFocus() {
    this._focusIndicator.visible = true;
  }

  onBlur() {
    this._focusIndicator.visible = false;
  }

  _onClickUp(evt) {
    const localPos = this.globalToLocal(evt.stageX, evt.stageY);
    const optionIndex = _.findLastIndex(this._options, option => localPos.y >= option.y);
    if (optionIndex >= 0) {
      if (evt.nativeEvent.shiftKey) {
        this._unhighlightAll();
        const start = Math.min(optionIndex, this._lastClickIndex);
        const end = Math.max(optionIndex, this._lastClickIndex);
        for (let i = start; i <= end; i++) {
          this._options[i].highlight();
        }
      } else if (evt.nativeEvent.ctrlKey || evt.nativeEvent.metaKey) {
        this._options[optionIndex].highlight();
      } else {
        this._unhighlightAll();
        this._options[optionIndex].highlight();
      }
      this._lastClickIndex = optionIndex;
    } else {
      this._unhighlightAll();
    }

    this.accessible.selected = _.filter(this._options, option => option.isHighlighted());
  }

  _unhighlightAll() {
    this._options.forEach((option) => {
      option.unhighlight();
    });
  }

  _onValueChanged(evt) {
    this._unhighlightAll();
    evt.selectedDisplayObjects.forEach((option) => { option.highlight(); });
    this._lastClickIndex = _.findIndex(this._options,
      option => option === evt.selectedDisplayObjects[evt.selectedDisplayObjects.length - 1]);
  }

  _createView(width, height, optionHeight) {
    const bg = new createjs.Shape();
    bg.graphics.beginFill('#ffffff').drawRect(0, 0, width, height); // main background
    bg.graphics.beginStroke('#000000').setStrokeStyle(1).drawRect(0, 0, width, height); // border
    this.addChild(bg);

    this._focusIndicator = new createjs.Shape();
    this._focusIndicator.graphics.beginStroke('#31c7ec').setStrokeStyle(1).drawRect(-1, -1, width + 2, height + 2);
    this._focusIndicator.visible = false;
    this.addChild(this._focusIndicator);

    this._options.forEach((option, i) => {
      option.y = optionHeight * i;
      this.addChild(option);
      this.accessible.addChild(option);
    });

    this.addEventListener('click', this._onClickUp);
  }
}
