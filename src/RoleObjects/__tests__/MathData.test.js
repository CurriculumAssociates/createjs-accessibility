import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';

const { container, parentEl, stage } = global;

describe('MathData', () => {
  describe('register role', () => {
    let cjsButton;
    let divEl;

    beforeEach(() => {
      cjsButton = new createjs.Shape(); // dummy object

      AccessibilityModule.register({
        displayObject: cjsButton,
        parent: container,
        role: AccessibilityModule.ROLES.MATH,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates div[role=math] element', () => {
        divEl = parentEl.querySelector('div[role=math]');
        expect(divEl).not.toBeNull();
      });
    });

    describe('options getters and setters', () => {
      it('can read and set "mathML" property', () => {
        const mathML = `
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mi>&#x03C0;</mi>
            <mo>&#x2062;</mo>
            <msup>
              <mi>r</mi>
              <mn>2</mn>
            </msup>
          </math>
        `;

        cjsButton.accessible.mathML = mathML;
        expect(cjsButton.accessible.mathML).toEqual(mathML);
      });
    });
  });
});
