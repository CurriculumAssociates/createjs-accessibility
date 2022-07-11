import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('TreeData', () => {
  describe('register role', () => {
    let cjsTree;
    let treeEl;

    beforeEach(() => {
      cjsTree = new createjs.Shape();
      AccessibilityModule.register({
        displayObject: cjsTree,
        parent: container,
        role: AccessibilityModule.ROLES.TREE,
      });

      stage.accessibilityTranslator.update();
      treeEl = parentEl.querySelector(`#${cjsTree.accessible.domId}`);
    });

    describe('rendering', () => {
      it('creates tree element', () => {
        expect(treeEl).not.toBeUndefined();
      });
    });

    describe('"addChild" and "addChildAt"', () => {
      it('throws error if the child is not accessible object or not a treeItem', () => {
        const childObj = new createjs.Shape();
        expect(() => {
          cjsTree.accessible.addChild(childObj);
        }).toThrowError(/Children of tree must have a role of treeitem/);

        expect(() => {
          cjsTree.accessible.addChildAt(childObj, 0);
        }).toThrowError(/Children of tree must have a role of treeitem/);
      });

      it('does not throws error if the child accessible object and a treeItem', () => {
        const childObj = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: childObj,
          role: AccessibilityModule.ROLES.TREEITEM,
        });

        expect(() => {
          cjsTree.accessible.addChild(childObj);
        }).not.toThrowError(/Children of tree must have a role of treeitem/);

        expect(() => {
          cjsTree.accessible.addChildAt(childObj, 0);
        }).not.toThrowError(/Children of tree must have a role of treeitem/);
      });
    });

    describe('Accessible getters and setters', () => {
      it('can set and get "multiselectable" property', () => {
        expect(cjsTree.accessible.multiselectable).toBe(undefined);
        cjsTree.accessible.multiselectable = true;
        stage.accessibilityTranslator.update();

        expect(cjsTree.accessible.multiselectable).toBe(true);
        expect(treeEl.getAttribute('aria-multiselectable')).toBe('true');
      });

      it('can set and get "required" property', () => {
        expect(cjsTree.accessible.required).toBe(undefined);
        cjsTree.accessible.required = true;
        stage.accessibilityTranslator.update();

        expect(cjsTree.accessible.required).toBe(true);
        expect(treeEl.getAttribute('aria-required')).toBe('true');
      });
    });
  });
});
