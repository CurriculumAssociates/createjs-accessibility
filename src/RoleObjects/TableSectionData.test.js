import * as createjs from 'createjs-module';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('TableSectionData', () => {
  describe('register role', () => {
    let cjsTableSection;
    let tableEl;

    beforeEach(() => {
      cjsTableSection = new createjs.Shape();
      AccessibilityModule.register({
        displayObject: cjsTableSection,
        parent: container,
        role: AccessibilityModule.ROLES.TABLEBODY,
      });

      stage.accessibilityTranslator.update();
      tableEl = parentEl.querySelector('tbody');
    });

    describe('rendering', () => {
      it('creates tbody element', () => {
        expect(tableEl).not.toBeNull();
      });
    });

    describe('"addChild" and "addChildAt"', () => {
      let childObj;
      const errorMsg = /Children of tableBody must have a role of row/;
      beforeEach(() => {
        childObj = new createjs.Shape();
      });

      describe('child is not accessible and not a Row', () => {
        it('"addChild" method throws error if the child is not accessible object or not a Row', () => {
          expect(() => {
            cjsTableSection.accessible.addChild(childObj);
          }).toThrowError(errorMsg);
        });

        it('"addChildAt" method throws error if the child is not accessible object or not a Row', () => {
          expect(() => {
            cjsTableSection.accessible.addChildAt(childObj, 1);
          }).toThrowError(errorMsg);
        });
      });

      describe('child is accessible and has a role of ROW', () => {
        beforeEach(() => {
          AccessibilityModule.register({
            displayObject: childObj,
            role: AccessibilityModule.ROLES.ROW,
          });
        });

        it('"addChild" does not throws error if the child accessible object and a Row', () => {
          expect(() => {
            cjsTableSection.accessible.addChild(childObj);
          }).not.toThrowError(errorMsg);
        });

        it('"addChildAt" does not throws error if the child accessible object and a Row', () => {
          expect(() => {
            cjsTableSection.accessible.addChildAt(childObj, 0);
          }).not.toThrowError(errorMsg);
        });
      });
    });
  });
});
