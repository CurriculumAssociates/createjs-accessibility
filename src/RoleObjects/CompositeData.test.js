import * as createjs from 'createjs-module';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('CompositeData', () => {
  describe('register role', () => {
    let cjsComposite;
    let divEl;

    beforeEach(() => {
      cjsComposite = new createjs.Shape();
      AccessibilityModule.register({
        displayObject: cjsComposite,
        parent: container,
        role: AccessibilityModule.ROLES.APPLICATION,
      });

      stage.accessibilityTranslator.update();
      divEl = parentEl.querySelector('div[role=application]');
    });

    describe('rendering', () => {
      it('creates div[role=application] element', () => {
        expect(divEl).not.toBeNull();
      });
    });

    describe('getters and setters methods', () => {
      it('throws error if non accessible object is passed to "active" property', () => {
        const dummyObj = new createjs.Shape();
        expect(() => {
          cjsComposite.accessible.active = dummyObj;
        }).toThrowError(
          /DisplayObject being set as the active descendant must have accessibility information/
        );
      });

      it('can set and get "active" property', () => {
        const dummyObj = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: dummyObj,
          parent: container,
          role: AccessibilityModule.ROLES.TABLE,
        });
        cjsComposite.accessible.active = dummyObj;
        expect(cjsComposite.accessible.active).toEqual(dummyObj);
        expect(cjsComposite.accessible.activeId).toBe(
          dummyObj.accessible.domId
        );
      });
    });
  });
});
