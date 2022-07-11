import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('CompositeData', () => {
  describe('register role', () => {
    let cjsComposite;
    let compositeEl;

    beforeEach(() => {
      cjsComposite = new createjs.Shape();
      AccessibilityModule.register({
        displayObject: cjsComposite,
        parent: container,
        role: AccessibilityModule.ROLES.APPLICATION,
      });

      stage.accessibilityTranslator.update();
      compositeEl = parentEl.querySelector(`#${cjsComposite.accessible.domId}`);
    });

    describe('rendering', () => {
      it('creates composite application element', () => {
        expect(compositeEl).not.toBeUndefined();
      });
    });

    describe('accessible options getters and setters', () => {
      it('throws error if non accessible object is passed to "active" property', () => {
        const dummyObj = new createjs.Shape();
        expect(() => {
          cjsComposite.accessible.active = dummyObj;
        }).toThrowError(
          /DisplayObject being set as the active descendant must have accessibility information/
        );
      });

      it(`can set and get "active" property`, () => {
        const dummyObj = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: dummyObj,
          parent: container,
          role: AccessibilityModule.ROLES.TABLE,
        });
        cjsComposite.accessible.active = dummyObj;
        stage.accessibilityTranslator.update();
        expect(cjsComposite.accessible.active).toEqual(dummyObj);
        expect(cjsComposite.accessible.activeId).toBe(
          dummyObj.accessible.domId
        );
      });
    });
  });
});
