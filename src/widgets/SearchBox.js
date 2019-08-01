import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import _ from 'lodash';
import SingleLineTextInput from './SingleLineTextInput';

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
    this.addEventListener('searchForText', this._processSearchData);
    this._searchText = '';
    this.listArr = listArr;
    this.addRemoveButton();

    // Label to show result status
    const label = new createjs.Text('', '20px Arial', 'black');
    label.x = this.x;
    label.y = this.y + this._height + 10;
    this.addChild(label);

    this.resultLabel = label;
  }

  addRemoveButton() {
    const container = new createjs.Container();
    // Button background
    const bg = new createjs.Shape();
    const height = this.getBounds().height - 5;
    bg.graphics.beginFill('grey').drawCircle(0, 0, height * 0.5);
    container.addChild(bg);

    // Cross
    const cross = new createjs.Text('x', `${height}px Arial`, 'white');
    const textBounds = cross.getBounds();
    cross.set({ x: -(textBounds.width * 0.5), y: -(textBounds.height * 0.65) });
    container.addChild(cross);

    // Container position
    const containerBounds = container.getBounds();
    const bounds = this.getBounds();
    container.set({
      x: bounds.width - (containerBounds.width + 3),
      y: 3 + (containerBounds.height) * 0.5,
    });
    this.addChild(container);
    container.visible = false;

    this.crossButton = container;

    // Mouseevent to clear current selection
    container.on('click', () => {
      super._updateDisplayString('');
      this.searchText = '';
      this.dispatchEvent('searchForText');
    });
  }

  /**
   * Internal function for updating the string displayed in the text input
   * @access private
   * @param {String} str - string to display
   */
  _updateDisplayString(str) {
    super._updateDisplayString(str);
    this.searchText = str;
    this.dispatchEvent('searchForText');
  }

  /**
   * Event handler for when the text is changed in the DOM translation
   * @access private
   * @param {Object} evt - event
   */
  _onValueChanged(evt) {
    super._onValueChanged(evt);
    this.searchText = evt.newValue;
    this.dispatchEvent('searchForText');
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
    this.crossButton.visible = !_.isEmpty(this.searchText);
  }

  get searchText() {
    return this._searchText;
  }

  set searchText(str) {
    this._searchText = str;
  }
}
