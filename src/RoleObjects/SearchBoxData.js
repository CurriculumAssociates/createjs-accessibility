import SingleLineTextBoxData from './SingleLineTextBoxData.js';

export default class SearchBoxData extends SingleLineTextBoxData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    this._reactProps.type = 'search';
  }
}
