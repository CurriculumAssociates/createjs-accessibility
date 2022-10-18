import DocumentData from './DocumentData';

export default class ArticleData extends DocumentData {
  /**
   * Sets the size of the article in the list
   * @access public
   * @param {number} value - size of the article
   */
  set size(value) {
    this._reactProps['aria-setsize'] = value;
  }

  /**
   * Retrieves the size of the article list
   * @access public
   */
  get size() {
    return this._reactProps['aria-setsize'];
  }

  /**
   * Sets the position of the article in the list
   * @access public
   * @param {number} value - position of the article in the list
   */
  set position(value) {
    this._reactProps['aria-posinset'] = value;
  }

  /**
   * Retrieves the position of the article
   * @access public
   */
  get position() {
    return this._reactProps['aria-posinset'];
  }
}
