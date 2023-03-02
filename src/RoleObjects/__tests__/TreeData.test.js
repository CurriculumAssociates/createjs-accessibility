import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';

const { container, parentEl, stage } = global;

describe('TreeData', () => {
  describe('register role', () => {
    let cjsTree;
    let ulEl;

    beforeEach(() => {
      cjsTree = new createjs.Shape();
      AccessibilityModule.register({
        displayObject: cjsTree,
        parent: container,
        role: AccessibilityModule.ROLES.TREE,
      });

      stage.accessibilityTranslator.update();
      ulEl = parentEl.querySelector('ul[role=tree]');
    });

    describe('rendering', () => {
      it('creates ul[role=tree] element', () => {
        expect(ulEl).not.toBeNull();
      });
    });

    describe('"addChild" and "addChildAt"', () => {
      let childObj;
      const errorMsg = /Children of tree must have a role of treeitem/;
      beforeEach(() => {
        childObj = new createjs.Shape();
      });
      describe('child is not Accessible and not a TreeItem', () => {
        it('"addChild" throws error if the child is not accessible object or not a treeItem', () => {
          expect(() => {
            cjsTree.accessible.addChild(childObj);
          }).toThrowError(errorMsg);
        });

        it('"addChildAt" throws error if the child is not accessible object or not a treeItem', () => {
          expect(() => {
            cjsTree.accessible.addChildAt(childObj, 0);
          }).toThrowError(errorMsg);
        });
      });

      describe('child is Accessible and has role TREEITEM', () => {
        beforeEach(() => {
          AccessibilityModule.register({
            displayObject: childObj,
            role: AccessibilityModule.ROLES.TREEITEM,
          });
        });

        it('"addChild" does not throws error if the child accessible object and a treeItem', () => {
          expect(() => {
            cjsTree.accessible.addChild(childObj);
          }).not.toThrowError(errorMsg);
        });

        it('"addChildAt" does not throws error if the child accessible object and a treeItem', () => {
          expect(() => {
            cjsTree.accessible.addChildAt(childObj, 0);
          }).not.toThrowError(errorMsg);
        });
      });
    });

    describe('Accessible getters and setters', () => {
      it('can set and get "multiselectable" property', () => {
        expect(cjsTree.accessible.multiselectable).toBe(undefined);
        cjsTree.accessible.multiselectable = true;
        stage.accessibilityTranslator.update();

        expect(cjsTree.accessible.multiselectable).toBe(true);
        expect(ulEl.getAttribute('aria-multiselectable')).toBe('true');
      });

      it('can set and get "required" property', () => {
        expect(cjsTree.accessible.required).toBe(undefined);
        cjsTree.accessible.required = true;
        stage.accessibilityTranslator.update();

        expect(cjsTree.accessible.required).toBe(true);
        expect(ulEl.getAttribute('aria-required')).toBe('true');
      });
    });
  });
});
