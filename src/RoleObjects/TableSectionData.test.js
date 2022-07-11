import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
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
      tableEl = parentEl.querySelector(`#${cjsTableSection.accessible.domId}`);
    });

    describe('rendering', () => {
      it('creates tree element', () => {
        expect(tableEl).not.toBeUndefined();
      });
    });

    describe('"addChild" and "addChildAt"', () => {
      it('throws error if the child is not accessible object or not a Row', () => {
        const childObj = new createjs.Shape();
        expect(() => {
          cjsTableSection.accessible.addChild(childObj);
        }).toThrowError(/Children of tableBody must have a role of row/);

        expect(() => {
          cjsTableSection.accessible.addChildAt(childObj, 0);
        }).toThrowError(/Children of tableBody must have a role of row/);
      });

      it('does not throws error if the child accessible object and a Row', () => {
        const childObj = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: childObj,
          role: AccessibilityModule.ROLES.ROW,
        });

        expect(() => {
          cjsTableSection.accessible.addChild(childObj);
        }).not.toThrowError(/Children of tableBody must have a role of row/);

        expect(() => {
          cjsTableSection.accessible.addChildAt(childObj, 0);
        }).not.toThrowError(/Children of tableBody must have a role of row/);
      });
    });
  });
});
