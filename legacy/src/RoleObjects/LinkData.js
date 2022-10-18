import AccessibilityObject from './AccessibilityObject';

/**
 * Class for role objects that use the a HTML tag.
 */
export default class LinkData extends AccessibilityObject {
  /**
   * Sets the download property of the link item
   * @access public
   * @param {String} filename - Specifies the file name to download the file with
   */
  set download(filename) {
    this._reactProps.download = filename;
  }

  /**
   * Gets the download enum of the link item
   * @access public
   * @returns {String} File name to download the file with, undefined if this field is unset
   */
  get download() {
    return this._reactProps.download;
  }

  /**
   * Sets the href of the link item
   * @access public
   * @param {String} url - Specifies the location of the linked document
   */
  set href(url) {
    this._reactProps.href = url;
  }

  /**
   * Retrieves the href of the link item
   * @access public
   * @returns {String} the location of the linked document, undefined if this field is unset
   */
  get href() {
    return this._reactProps.href;
  }

  /**
   * Sets the hreflang of the link item
   * @access public
   * @param {String} lang - Specifies the language of the text in the linked document
   */
  set hrefLang(lang) {
    this._reactProps.hrefLang = lang;
  }

  /**
   * Retrieves the hreflang of the link item
   * @access public
   * @returns {String} the language of the text in the linked document, undefined
   * if this field is unset
   */
  get hrefLang() {
    return this._reactProps.hrefLang;
  }

  /**
   * Sets the media of the link item
   * @access public
   * @param {String} media - Specifies on what device the linked document is optimized for
   */
  set media(media) {
    this._reactProps.media = media;
  }

  /**
   * Retrieves the media of the link item
   * @access public
   * @returns {String} what device the linked document is optimized for, undefined
   * if this field is unset
   */
  get media() {
    return this._reactProps.media;
  }

  /**
   * Sets the rel of the link item
   * @access public
   * @param {String} rel - Specifies the relationship between the current document
   * and the linked document
   */
  set rel(rel) {
    this._reactProps.rel = rel;
  }

  /**
   * Retrieves the rel of the link item
   * @access public
   * @returns {String} the relationship between the current document and the linked document,
   * undefined if this field is unset
   */
  get rel() {
    return this._reactProps.rel;
  }

  /**
   * Sets the target of the link item
   * @access public
   * @param {String} loc - Specifies where to open the linked document
   */
  set target(loc) {
    this._reactProps.target = loc;
  }

  /**
   * Retrieves the target of the link item
   * @access public
   * @returns {String} where to open the linked document, undefined if this field is unset
   */
  get target() {
    return this._reactProps.target;
  }

  /**
   * Sets the type of the link item
   * @access public
   * @param {String} media - Specifies the media type of the linked document
   */
  set type(media) {
    this._reactProps.type = media;
  }

  /**
   * Retrieves the type of the link item
   * @access public
   * @returns {String} the media type of the linked document, undefined if this field is unset
   */
  get type() {
    return this._reactProps.type;
  }
}
