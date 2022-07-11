import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

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
      ulEl = parentEl.querySelector(`#${cjsUl.accessible.domId}`);
    });

    describe('rendering', () => {
      it('creates ul element', () => {
        expect(ulEl).not.toBeUndefined();
      });
    });

    describe('"addChild" and "addChildAt"', () => {
      it('thorws Error if child is not LISTITEM or child is not accessible', () => {
        const childObj = new createjs.Shape();
        expect(() => {
          cjsUl.accessible.addChild(childObj);
        }).toThrowError(
          /Children of unorderedlist must have a role of listitem/
        );
        expect(() => {
          cjsUl.accessible.addChildAt(childObj, 0);
        }).toThrowError(
          /Children of unorderedlist must have a role of listitem/
        );

        AccessibilityModule.register({
          displayObject: childObj,
          role: AccessibilityModule.ROLES.HEADING1,
        });
        stage.accessibilityTranslator.update();

        expect(() => {
          cjsUl.accessible.addChild(childObj);
        }).toThrowError(
          /Children of unorderedlist must have a role of listitem/
        );
        expect(() => {
          cjsUl.accessible.addChildAt(childObj, 0);
        }).toThrowError(
          /Children of unorderedlist must have a role of listitem/
        );

        AccessibilityModule.register({
          displayObject: childObj,
          role: AccessibilityModule.ROLES.LISTITEM,
        });
        stage.accessibilityTranslator.update();
        expect(() => {
          cjsUl.accessible.addChild(childObj);
        }).not.toThrowError(
          /Children of unorderedlist must have a role of listitem/
        );
        expect(() => {
          cjsUl.accessible.addChildAt(childObj, 0);
        }).not.toThrowError(
          /Children of unorderedlist must have a role of listitem/
        );
      });
    });
  });
});
