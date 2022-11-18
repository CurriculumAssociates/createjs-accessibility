import DocumentData from './DocumentData';

export default class ArticleData extends DocumentData {
  /**
   * Sets the size of the article in the list
   * @access public
   * @param {number} value - size of the article
   */
  set size(value: number) {
    this._reactProps['aria-setsize'] = value;
  }

  /**
   * Retrieves the size of the article list
   * @access public
   * @returns {number} the number of items in the current set of items
   */
  get size(): number {
    return <number>this._reactProps['aria-setsize'];
  }

  /**
   * Sets the position of the article in the list
   * @access public
   * @param {number} value - position of the article in the list
   */
  set position(value: number) {
    this._reactProps['aria-posinset'] = value;
  }

  /**
   * Retrieves the position of the article
   * @access public
   * @returns {number} One-based index for the position in the current set of items
   */
  get position(): number {
    return <number>this._reactProps['aria-posinset'];
  }
}
