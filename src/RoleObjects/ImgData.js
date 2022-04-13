import SectionData from './SectionData';

/**
 * Base class for role objects that use the img HTML tag.
 * This contains only setters/getters for fields that are common to
 * all img tags regardless of the type attribute.
 */
export default class ImgData extends SectionData {
  /**
   * @inheritdoc
   */
  addChild() {
    throw new Error(`${this.role} cannot have children`);
  }

  /**
   * @inheritdoc
   */
  addChildAt() {
    throw new Error(`${this.role} cannot have children`);
  }

  /**
   * Sets the alternate text for an image
   * @access public
   * @param {String} text - alternate text for an image
   */
  set alt(text) {
    this._reactProps.alt = text;
  }

  /**
   * Retrieves the alternate text for an image
   * @access public
   * @returns {String} alternate text for an image, undefined if this field is unset
   */
  get alt() {
    return this._reactProps.alt;
  }

  /**
   * Sets the crossorigin property for an image
   * @access public
   * @param {String} option - the type of crossorigin sharing to be used
   */
  set crossOrigin(option) {
    this._reactProps.crossOrigin = option;
  }

  /**
   * Retrieves the crossorigin property for an image
   * @access public
   * @returns {String} the type of crossoriging sharing, undefined if this field is unset
   */
  get crossOrigin() {
    return this._reactProps.crossOrigin;
  }

  /**
   * Sets the height of an image
   * @access public
   * @param {Number} pixels - the height of an image in pixels
   */
  set height(pixels) {
    this._reactProps.height = pixels;
  }

  /**
   * Retrieves the height of an image
   * @access public
   * @returns {Number} the height of an image in pixels, undefined if this field is unset
   */
  get height() {
    return this._reactProps.height;
  }

  /**
   * Sets the ismap property of an image
   * @access public
   * @param {Boolean} option - whether or not this image is part of an image map
   */
  set isMap(option) {
    this._reactProps.ismap = option.toString();
  }

  /**
   * Retrieves the ismap property of an image
   * @access public
   * @returns {Boolean} whether or not this image is part of an image map,
   * undefined if this field is unset
   */
  get isMap() {
    const { ismap } = this._reactProps;
    return ismap && ismap === 'true';
  }

  /**
   * Sets a URL to a detailed description of an image
   * @access public
   * @param {String} url - a URL to a detailed description of an image
   */
  set longDesc(url) {
    this._reactProps.longdesc = url;
  }

  /**
   * Retrieves a URL to a detailed description of an image
   * @access public
   * @returns {String} a URL to a detailed description of an image, undefined if this field is unset
   */
  get longDesc() {
    return this._reactProps.longdesc;
  }

  /**
   * Sets the sizes property of an image
   * @access public
   * @param {String} sizes - a list of possible image sizes
   */
  set sizes(sizes) {
    this._reactProps.sizes = sizes;
  }

  /**
   * Retrieves the sizes property an image
   * @access public
   * @returns {String} a list of possible image sizes, undefined if this field is unset
   */
  get sizes() {
    return this._reactProps.sizes;
  }

  /**
   * Sets the URL of an image
   * @access public
   * @param {String} url - the URL of an image
   */
  set src(url) {
    this._reactProps.src = url;
  }

  /**
   * Retrieves the URL of an image
   * @access public
   * @returns {String} the URL of an image, undefined if this field is unset
   */
  get src() {
    return this._reactProps.src;
  }

  /**
   * Sets the srcset of an image
   * @access public
   * @param {String} url - the URL of an image to use in different situations
   */
  set srcSet(url) {
    this._reactProps.srcSet = url;
  }

  /**
   * Retrieves the srcset of an image
   * @access public
   * @returns {String} the URL of an image to use in different situations,
   * undefined if this field is unset
   */
  get srcSet() {
    return this._reactProps.srcSet;
  }

  /**
   * Sets the usemap property of an image
   * @access public
   * @param {String} map - the name of the map to use to make the image a client-side image map
   */
  set useMap(map) {
    this._reactProps.useMap = map;
  }

  /**
   * Retrieves the usemap property of an image
   * @access public
   * @returns {String} the name of the map to use to make the image a client-side
   * image map, undefined if this field is unset
   */
  get useMap() {
    return this._reactProps.useMap;
  }

  /**
   * Sets the width of an image
   * @access public
   * @param {Number} pixels - the width of an image in pixels
   */
  set width(pixels) {
    this._reactProps.width = pixels;
  }

  /**
   * Retrieves the width of an image
   * @access public
   * @returns {Number} the width of an image in pixels, undefined if this field is unset
   */
  get width() {
    return this._reactProps.width;
  }
}
