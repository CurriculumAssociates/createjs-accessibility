import AccessibilityModule from '../../index';

describe('UnorderedListData', () => {
  describe('register role', () => {
    let cjsUl;
    let ulEl;

    beforeEach(() => {
      cjsUl = new createjs.Shape();
      AccessibilityModule.register({
        displayObject: cjsUl,
        parent: container,
        role: AccessibilityModule.ROLES.UNORDEREDLIST,
      });

      stage.accessibilityTranslator.update();
      ulEl = parentEl.querySelector('ul');
    });

    describe('rendering', () => {
      it('creates ul element', () => {
        expect(ulEl).not.toBeNull();
      });
    });

    describe('"addChild" and "addChildAt"', () => {
      let childObj;
      const errorMsg = /Children of unorderedlist must have a role of listitem/;
      beforeEach(() => {
        childObj = new createjs.Shape();
      });

      describe('child is not Accessible and not a LISTITEM', () => {
        it('"addChild" throws Error if child is not LISTITEM or child is not accessible', () => {
          expect(() => {
            cjsUl.accessible.addChild(childObj);
          }).toThrowError(errorMsg);
        });

        it('"addChildAt" throws Error if child is not LISTITEM or child is not accessible', () => {
          expect(() => {
            cjsUl.accessible.addChildAt(childObj, 0);
          }).toThrowError(errorMsg);
        });
      });

      describe('child is Accessible and has role LISTITEM', () => {
        beforeEach(() => {
          AccessibilityModule.register({
            displayObject: childObj,
            role: AccessibilityModule.ROLES.LISTITEM,
          });
        });

        it('"addChild" does not throw Error if child is Accessible and has role LISTITEM', () => {
          expect(() => {
            cjsUl.accessible.addChild(childObj);
          }).not.toThrowError(errorMsg);
        });

        it('"addChildAt" does not throw Error if child is Accessible and has role LISTITEM', () => {
          expect(() => {
            cjsUl.accessible.addChildAt(childObj, 0);
          }).not.toThrowError(errorMsg);
        });
      });
    });
  });
});
