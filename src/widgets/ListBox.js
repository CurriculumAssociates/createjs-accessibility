import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class ListBox extends createjs.Container {
  constructor(options, width, height, tabIndex) {
    super();
    _.bindAll(this, 'onFocus', 'onBlur', '_onCollapedViewClick', '_onOptionClick', '_onValueChanged');
    AccessibilityModule.register({
      accessibleOptions: { tabIndex },
      displayObject: this,
      role: AccessibilityModule.ROLES.SINGLESELECTLISTBOX,
    });
    this.addEventListener('valueChanged', this._onValueChanged);
    this.addEventListener('focus', this.onFocus);
    this.addEventListener('blur', this.onBlur);

    this._options = options;

    this._createCollapsedView(width, height);
    this._createDropDownView(width, height);
    this._dropDownView.visible = false;
  }

  onFocus() {
    this._focusIndicator.visible = true;
  }

  onBlur() {
    this._focusIndicator.visible = false;
  }

  _onCollapedViewClick() {
    this._dropDownView.visible = !this._dropDownView.visible;
    if (this._dropDownView.visible) {
      // make sure the listbox is on top of its sibling DisplayObjects to try to ensure that the dropdown is completely visible
      this.parent.addChild(this);
    }
  }

  _onOptionClick(evt) {
    this._updateSelectedOption(evt.currentTarget);
    this._dropDownView.visible = false;
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

    this._selectedDisplay = new createjs.Text(option._label.text, option._label.font);
    this._selectedDisplay.x = 2;
    this._selectedDisplay.y = 2;
    this._collapsedView.addChild(this._selectedDisplay);

    this.accessible.selected = option;
  }

  _createCollapsedView(width, height) {
    this._collapsedView = new createjs.Container();
    this._collapsedView.addEventListener('click', this._onCollapedViewClick);
    this.addChild(this._collapsedView);

    const bg = new createjs.Shape();
    bg.graphics.beginFill('#ffffff').drawRect(0, 0, width, height); // main background
    const dropBoxLeft = width - height;
    bg.graphics.endStroke().beginFill('#aaaaaa').drawRect(dropBoxLeft, 0, height, height); // arrow background to indicate drop down
    bg.graphics.endFill().beginStroke('#000000').moveTo(dropBoxLeft + height * 0.25, height * 0.25).lineTo(dropBoxLeft + height * 0.5, height * 0.75)
      .lineTo(dropBoxLeft + height * 0.75, height * 0.25); // arrow
    bg.graphics.beginStroke('#000000').setStrokeStyle(1).drawRect(0, 0, width, height); // border
    this._collapsedView.addChild(bg);

    this._focusIndicator = new createjs.Shape();
    this._focusIndicator.graphics.beginFill('#31c7ec').drawRect(1, 1, width - height - 2, height - 2);
    this._focusIndicator.visible = false;
    this._collapsedView.addChild(this._focusIndicator);

    const selectedIndex = _.findIndex(this._options, option => option.selected);
    const selectedOption = selectedIndex === -1 ? this._options[0] : this._options[selectedIndex];
    this._updateSelectedOption(selectedOption);
  }

  _createDropDownView(width, optionHeight) {
    this._dropDownView = new createjs.Container();
    this._dropDownView.y = optionHeight;
    this._dropDownView.visible = false;
    this.addChild(this._dropDownView);

    const bg = new createjs.Shape();
    bg.graphics.beginStroke('#000000').setStrokeStyle(1).beginFill('#ffffff').drawRect(0, 0, width, optionHeight * this._options.length);
    this._dropDownView.addChild(bg);

    this._options.forEach((option, i) => {
      option.y = optionHeight * i;
      option.addEventListener('click', this._onOptionClick);
      this._dropDownView.addChild(option);
      this.accessible.addChild(option);
    });
  }
}
