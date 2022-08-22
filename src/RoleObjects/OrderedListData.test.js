import * as createjs from 'createjs-module';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('OrderedListData', () => {
  describe('register role', () => {
    let cjsOrderedList;
    let cjsCell;
    let olEl;
    let isReversed;
    let startVal;
    let typeVal;

    beforeEach(() => {
      cjsOrderedList = new createjs.Shape(); // dummy object
      cjsCell = new createjs.Shape(); // dummy child object
      isReversed = false;
      startVal = 7;
      typeVal = 'I';

      AccessibilityModule.register({
        accessibleOptions: {
          reversed: isReversed,
          start: startVal,
          type: typeVal,
        },
        displayObject: cjsOrderedList,
        parent: container,
        role: AccessibilityModule.ROLES.ORDEREDLIST,
      });

      AccessibilityModule.register({
        displayObject: cjsCell,
        role: AccessibilityModule.ROLES.CELL,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates ol element', () => {
        olEl = parentEl.querySelector('ol');
        expect(olEl).not.toBeNull();
      });
    });

    describe('children checking', () => {
      describe('prohibited children', () => {
        let errorObj;

        beforeEach(() => {
          errorObj = /Children of orderedlist must have a role of listitem/;
          stage.accessibilityTranslator.update();
        });

        it('throws error attempting to add prohibited child using addChild() ', () => {
          expect(() => {
            cjsOrderedList.accessible.addChild(cjsCell);
          }).toThrowError(errorObj);
        });

        it('throws error attempting to add prohibited child using addChildAt()', () => {
          expect(() => {
            cjsOrderedList.accessible.addChildAt(cjsCell, 0);
          }).toThrowError(errorObj);
        });
      });

      describe('permitted children', () => {
        let cjsDummy;

        beforeEach(() => {
          cjsDummy = new createjs.Shape();
          AccessibilityModule.register({
            displayObject: cjsDummy,
            role: AccessibilityModule.ROLES.LISTITEM,
          });
          stage.accessibilityTranslator.update();
        });

        it('throws NO error when adding permitted child using addChild', () => {
          expect(() => {
            cjsOrderedList.accessible.addChild(cjsDummy);
          }).not.toThrowError();
        });

        it('throws NO error when adding permitted child using addChildAt()', () => {
          expect(() => {
            cjsOrderedList.accessible.addChildAt(cjsDummy, 0);
          }).not.toThrowError();
        });
      });
    });

    describe('options getters and setters', () => {
      it('can read and set "reversed" property', () => {
        expect(cjsOrderedList.accessible.reversed).toEqual(isReversed);

        const newVal = true;
        cjsOrderedList.accessible.reversed = newVal;
        expect(cjsOrderedList.accessible.reversed).toEqual(newVal);
      });

      it('can read and set "start" property', () => {
        expect(cjsOrderedList.accessible.start).toEqual(startVal);

        const newVal = 'i';
        cjsOrderedList.accessible.start = newVal;
        expect(cjsOrderedList.accessible.start).toEqual(newVal);
      });

      it('can read and set "type" property', () => {
        expect(cjsOrderedList.accessible.type).toEqual(typeVal);

        const newVal = 'i';
        cjsOrderedList.accessible.type = newVal;
        expect(cjsOrderedList.accessible.type).toEqual(newVal);
      });
    });
  });
});
