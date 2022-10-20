import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

describe('GroupData', () => {
  describe('register role', () => {
    let cjsInput;
    let divEl;

    beforeEach(() => {
      cjsInput = new createjs.Shape();
      AccessibilityModule.register({
        displayObject: cjsInput,
        parent: container,
        role: AccessibilityModule.ROLES.GROUP,
      });

      stage.accessibilityTranslator.update();
      divEl = parentEl.querySelector('div[role=group]');
    });

    describe('rendering', () => {
      it('creates div[role=group] element', () => {
        expect(divEl).not.toBeNull();
      });
    });

    describe('accessible options getters and setters', () => {
      it('throws error if non accessible object is passed to "active" property', () => {
        const dummyObj = new createjs.Shape();
        expect(() => {
          cjsInput.accessible.active = dummyObj;
        }).toThrowError(
          /DisplayObject being set as the active descendant must have accessibility information/
        );
      });

      it('can read "activeId" property and read, set and clear "active" property [for "aria-activedescendant"]', () => {
        const dummyObj = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: dummyObj,
          parent: container,
          role: AccessibilityModule.ROLES.SPAN,
        });
        cjsInput.accessible.active = dummyObj;
        expect(cjsInput.accessible.active).toEqual(dummyObj);
        expect(cjsInput.accessible.activeId).toBe(dummyObj.accessible.domId);

        cjsInput.accessible.active = undefined;
        expect(cjsInput.accessible.activeId).toEqual(undefined);
      });
    });
  });
});
