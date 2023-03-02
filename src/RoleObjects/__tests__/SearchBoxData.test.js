import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';

const { container, parentEl, stage } = global;

describe('SearchBoxData', () => {
  describe('register role', () => {
    let cjsSearchBox;
    let inputEl;

    beforeEach(() => {
      cjsSearchBox = new createjs.Shape(); // dummy object

      AccessibilityModule.register({
        displayObject: cjsSearchBox,
        parent: container,
        role: AccessibilityModule.ROLES.SEARCHBOX,
      });

      stage.accessibilityTranslator.update();

      inputEl = parentEl.querySelector('input[type=search]');
    });

    describe('rendering', () => {
      it('creates input[type=search] element', () => {
        expect(inputEl).not.toBeNull();
      });
    });
  });
});
