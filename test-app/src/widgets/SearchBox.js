import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import _ from 'lodash';
import SingleLineTextInput from './SingleLineTextInput';
import ClearButton from './ClearButton';

export default class SearchBox extends SingleLineTextInput {
  constructor(width, height, tabIndex, listArr, placeholderText) {
    super(width, height, tabIndex, placeholderText);
    _.bindAll(this, '_processSearchData');
    AccessibilityModule.register({
      accessibleOptions: {
        placeHolder: placeholderText,
        tabIndex,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.SEARCHBOX,
    });
    this._searchText = '';
    this.listArr = listArr;
    this.addClearButton();

    // Label to show result status
    const label = new createjs.Text('', '20px Arial', 'black');
    label.x = this.x;
    label.y = this.y + this._height + 10;
    this.addChild(label);

    this.resultLabel = label;
  }

  addClearButton() {
    const clearBtnData = {
      type: 'button',
      value: 'Clear',
      name: 'Clear',
      enabled: 'true',
      height: 20,
      width: 20,
      label: 'Clear search input',
    };

    const clearButton = new ClearButton(clearBtnData, 0, () => {
      this._clearText();
    });

    // Container position
    const containerBounds = clearButton.getBounds();
    const bounds = this.getBounds();
    clearButton.set({
      x: bounds.width - (containerBounds.width + 3),
      y: 3 + (containerBounds.height) * 0.5,
    });
    clearButton.visible = false;
    this.clearButton = clearButton;
  }

  /**
   * Internal function for updating the string displayed in the text input
   * @access private
   * @param {String} str - string to display
   */
  _updateDisplayString(str) {
    super._updateDisplayString(str);
    this.searchText = str;
  }

  _clearText() {
    this._updateDisplayString('');
    this._processSearchData();
    this._cursorToIndex();
    this.accessible.requestFocus();
  }

  /**
   * Event handler for when the text is changed in the DOM translation
   * @access private
   * @param {Object} evt - event
   */
  _onValueChanged(evt) {
    super._onValueChanged(evt);
    this.searchText = evt.newValue;
    this.clearButton.visible = !_.isEmpty(this.searchText);
  }

  /**
   * Internal function for searching between the list as per text input
   * @access private
   */
  _processSearchData() {
    let visibleCount = 0;

    _.forEach(this.listArr, (sentence) => {
      const reg = new RegExp(this.searchText, 'gmi');
      sentence.visible = (_.isArray(sentence.text.match(reg)));
      sentence.bullet.visible = sentence.visible;
      if (sentence.visible) visibleCount++;
    });

    // Show result status
    const text = (visibleCount > 0) ? 'Here are the results....' : 'No results found';
    this.resultLabel.text = (_.isEmpty(this.searchText)) ? '' : text;

    // Toggle visibility of cross button
    this.clearButton.visible = !_.isEmpty(this.searchText);
  }

  get searchText() {
    return this._searchText;
  }

  set searchText(str) {
    this._searchText = str;
  }
}
