import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class ListBox extends createjs.Container {
  constructor(options, width, height, tabIndex) {
    super();
    _.bindAll(
      this,
      'onFocus',
      'onBlur',
      '_onCollapedViewClick',
      '_onCollapedViewKeyDown',
      '_onOptionClick',
      '_onDropDownKeyDown',
      '_onValueChanged'
    );
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.NONE,
    });

    this._options = options;

    this._createCollapsedView(width, height, tabIndex);
    this._createDropDownView(width, height);
    this._dropDownView.visible = false;

    let selectedIndex = _.findIndex(this._options, (option) => option.selected);
    if (selectedIndex === -1) {
      selectedIndex = 0;
      this._options[selectedIndex].selected = true;
    }
    const selectedOption = this._options[selectedIndex];
    this._updateSelectedOption(selectedOption);
  }

  setTabbable(tabbable) {
    if (tabbable) {
      this._collapsedView.accessible.tabIndex = 0;
    } else {
      this._collapsedView.accessible.tabIndex = -1;
    }
  }

  onFocus() {
    this._focusIndicator.visible = true;
  }

  onBlur() {
    this._focusIndicator.visible = false;
  }

  _onCollapedViewClick(evt) {
    this._dropDownView.visible = !this._dropDownView.visible;
    this._collapsedView.accessible.expanded = this._dropDownView.visible;
    if (this._dropDownView.visible) {
      // make sure the listbox is on top of its sibling DisplayObjects to try
      // to ensure that the dropdown is completely visible
      this.parent.addChild(this);

      // move focus from the expand button to the drop down list element
      this._dropDownView.accessible.requestFocus();
    }

    evt.stopPropagation();
    evt.preventDefault();
  }

  _onCollapedViewKeyDown(evt) {
    if (evt.keyCode === KeyCodes.down || evt.keyCode === KeyCodes.up) {
      // make sure the listbox is on top of its sibling DisplayObjects to try to ensure
      // that the dropdown is completely visible
      this.parent.addChild(this);

      this._dropDownView.visible = true;
      this._collapsedView.accessible.expanded = this._dropDownView.visible;
      this._dropDownView.accessible.requestFocus();
      this._updateSelectedOption(
        this._getAdjacentOption(evt.keyCode === KeyCodes.down)
      );
    }
  }

  _getAdjacentOption(next) {
    let index = _.findIndex(this._options, (child) => child.selected);
    if (next) {
      index = Math.min(index + 1, this._options.length - 1);
    } else {
      index = Math.max(index - 1, 0);
    }

    return this._options[index];
  }

  _onOptionClick(evt) {
    this._updateSelectedOption(evt.currentTarget);
    this._dropDownView.visible = false;
  }

  _onDropDownKeyDown(evt) {
    if (evt.keyCode === KeyCodes.enter || evt.keyCode === KeyCodes.esc) {
      this._collapsedView.accessible.requestFocus();
      this._dropDownView.visible = false;
      this._collapsedView.accessible.expanded = this._dropDownView.visible;
      evt.preventDefault();
    }
  }

  _onValueChanged(evt) {
    this._updateSelectedOption(evt.selectedDisplayObject);
  }

  _updateSelectedOption(option) {
    this._options.forEach((opt) => {
      opt.selected = false;
    });
    option.selected = true;

    this._collapsedView.removeChild(this._selectedDisplay);

    this._selectedDisplay = new createjs.Text(
      option._label.text,
      option._label.font
    );
    this._selectedDisplay.x = 2;
    this._selectedDisplay.y = 2;
    this._collapsedView.addChild(this._selectedDisplay);
    this._collapsedView.accessible.text = option._label.text;

    this._dropDownView.accessible.active = option;
    this._dropDownView.accessible.selected = option;
  }

  _createCollapsedView(width, height, tabIndex) {
    this._collapsedView = new createjs.Container();
    this._collapsedView.addEventListener('click', this._onCollapedViewClick);
    this.addChild(this._collapsedView);

    AccessibilityModule.register({
      displayObject: this._collapsedView,
      role: AccessibilityModule.ROLES.BUTTON,
      parent: this,
    });
    this._collapsedView.accessible.enableKeyEvents = true;
    this._collapsedView.addEventListener(
      'keydown',
      this._onCollapedViewKeyDown
    );
    this._collapsedView.addEventListener(
      'keyboardClick',
      this._onCollapedViewClick
    );
    this._collapsedView.addEventListener('focus', this.onFocus);
    this._collapsedView.addEventListener('blur', this.onBlur);
    this._collapsedView.accessible.hasPopUp = 'listbox';
    this._collapsedView.accessible.tabIndex = tabIndex;
    this._collapsedView.accessible.expanded = false;

    const bg = new createjs.Shape();
    bg.graphics.beginFill('#ffffff').drawRect(0, 0, width, height); // main background
    const dropBoxLeft = width - height;
    bg.graphics
      .endStroke()
      .beginFill('#aaaaaa')
      .drawRect(dropBoxLeft, 0, height, height); // arrow background to indicate drop down
    bg.graphics
      .endFill()
      .beginStroke('#000000')
      .moveTo(dropBoxLeft + height * 0.25, height * 0.25)
      .lineTo(dropBoxLeft + height * 0.5, height * 0.75)
      .lineTo(dropBoxLeft + height * 0.75, height * 0.25); // arrow
    bg.graphics
      .beginStroke('#000000')
      .setStrokeStyle(1)
      .drawRect(0, 0, width, height); // border
    this._collapsedView.addChild(bg);

    this._focusIndicator = new createjs.Shape();
    this._focusIndicator.graphics
      .beginFill('#31c7ec')
      .drawRect(1, 1, width - height - 2, height - 2);
    this._focusIndicator.visible = false;
    this._collapsedView.addChild(this._focusIndicator);
  }

  _createDropDownView(width, optionHeight) {
    this._dropDownView = new createjs.Container();
    this._dropDownView.y = optionHeight;
    this._dropDownView.visible = false;
    this.addChild(this._dropDownView);

    AccessibilityModule.register({
      displayObject: this._dropDownView,
      role: AccessibilityModule.ROLES.SINGLESELECTLISTBOX,
      parent: this,
    });
    this._dropDownView.accessible.tabIndex = -1;
    this._dropDownView.addEventListener('blur', (evt) => {
      if (this._dropDownView.visible) {
        this._onCollapedViewClick(evt);
      }
    });
    this._dropDownView.accessible.enableKeyEvents = true;
    this._dropDownView.addEventListener('keydown', this._onDropDownKeyDown);
    this._dropDownView.addEventListener('valueChanged', this._onValueChanged);

    const bg = new createjs.Shape();
    bg.graphics
      .beginStroke('#000000')
      .setStrokeStyle(1)
      .beginFill('#ffffff')
      .drawRect(0, 0, width, optionHeight * this._options.length);
    this._dropDownView.addChild(bg);

    this._options.forEach((option, i) => {
      option.y = optionHeight * i;
      option.addEventListener('click', this._onOptionClick);
      this._dropDownView.addChild(option);
      this._dropDownView.accessible.addChild(option);
    });
    const activeChild = this._dropDownView.accessible.children[0];
    this._dropDownView.accessible.active = activeChild;
  }
}
