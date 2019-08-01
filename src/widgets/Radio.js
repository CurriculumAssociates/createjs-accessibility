import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class Radio extends createjs.Container {
  /**
   * Initialize the class parameters & assign accessibilty role
   * @param {string} name - Name of the radio button
   * @param {string} value - value of the radio button
   * @param {integer} position - position of the radio button in the radio button list
   * @param {integer} size - size of the radio button list
   * @param {boolean} enable - make the radio button interactive
   * @param {boolean} checked - make the radio button as checked/uncheck
   */

  constructor({
    name, value, position = 1, size = 1, enabled = true, checked = false, tabIndex,
    outerRadius = 9, innerRadius = 3, highlighterBorder = 4,
  } = {}) {
    super();
    // will be used in radio group
    this.data = { name, value };
    this.radioContainer = null;
    this.highlighter = null;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    this.border = 2;
    this.highlighterBorder = highlighterBorder;
    this._setUpStage();
    this.setBounds(0, 0, this.outerRadius * 2, this.outerRadius * 2);

    // Assign accessibilty role
    AccessibilityModule.register({
      accessibleOptions: {
        name,
        position,
        size,
        tabIndex,
        value,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.RADIO,
    });
    this.enabled = enabled;
    this.checked = checked;
  }

  set checked(value) {
    this.focus = value;
    this.radioContainer.visible = value;
    this.accessible.checked = value;
  }

  get checked() {
    return this.radioContainer.visible;
  }

  set enabled(value) {
    this.mouseEnabled = value;
    this.alpha = this.mouseEnabled ? 1 : 0.5;
    this.accessible.enabled = this.mouseEnabled;
  }

  get enabled() {
    return this.mouseEnabled;
  }

  set focus(value) {
    this.highlighter.visible = value;
    if (value) {
      this.accessible.requestFocus();
    }
  }

  get focus() {
    return this.highlighter.visible;
  }

  /**
   * Setup the display Object
   */
  _setUpStage() {
    this._createRadioButton();
    this._createHighlighter();
    this._setHitArea();
  }

  /**
   * Create the radio button shapes
   * @access private
   */
  _createRadioButton() {
    const outerCircle = this._createCircle({
      r: this.outerRadius + (this.border * 0.5), color: '#bdbdbd', stroke: true, border: this.border,
    });
    this.outerCircle = outerCircle;
    outerCircle.x = this.outerRadius + this.border * 0.5;
    outerCircle.y = this.outerRadius + this.border * 0.5;

    const container = new createjs.Container();

    const inCircle = this._createCircle({ r: this.outerRadius, color: '#3896fc', fill: true });
    inCircle.x = outerCircle.x;
    inCircle.y = outerCircle.y;
    this.radioContainer = inCircle;

    const innerCircle = this._createCircle({ r: this.innerRadius, color: '#FFFFFF', fill: true });
    innerCircle.x = outerCircle.x;
    innerCircle.y = outerCircle.y;

    container.addChild(inCircle, innerCircle);
    this.addChild(outerCircle, container);
  }

  /**
   * Create the radio button highlight
   * @access private
   */
  _createHighlighter() {
    const hightlightRadius = (this.outerRadius + (this.border + this.highlighterBorder) * 0.5);
    const highlighter = this._createCircle({
      r: hightlightRadius,
      stroke: true,
      border: this.highlighterBorder,
      color: '#84befd',
    });
    this.highlighter = highlighter;
    highlighter.x = this.outerCircle.x;
    highlighter.y = this.outerCircle.y;
    this.addChildAt(highlighter, 0);
  }

  /**
   * Setup the hit area for interaction
   */
  _setHitArea() {
    const hitArea = this._createCircle({ r: this.outerRadius, fill: true, border: this.border });
    hitArea.x = this.outerCircle.x;
    hitArea.y = this.outerCircle.y;
    this.hitArea = hitArea;
  }


  /**
   * Create circular shape
   * @access private
   * @param {Number} r Radius
   * @param {Boolean} fill true or false
   * @param {String} color color code
   * @param {Number} border border value
   */
  _createCircle({
    r, fill = false, color = '#000000', border = 1,
  }) {
    const shape = new createjs.Shape();
    const g = shape.graphics;
    g.setStrokeStyle(border);
    g.beginStroke(color);
    if (fill) {
      g.beginFill(color);
    }
    g.drawCircle(0, 0, r);
    return shape;
  }
}
