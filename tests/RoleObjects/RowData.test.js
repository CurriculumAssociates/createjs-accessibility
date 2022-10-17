import * as createjs from 'createjs-module';
import AccessibilityModule from '../../src/index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('RowData', () => {
  describe('register role', () => {
    let cjsTable;
    let cjsTableBody;
    let cjsRow;
    let cjsSpan;
    let trEl;
    let colIndexVal;
    let levelVal;
    let rowIndexVal;

    beforeEach(() => {
      cjsTable = new createjs.Shape(); // dummy object
      cjsTableBody = new createjs.Shape(); // dummy object
      cjsRow = new createjs.Shape(); // dummy object
      cjsSpan = new createjs.Shape(); // dummy child object
      colIndexVal = 10;
      levelVal = 99;
      rowIndexVal = 30;

      AccessibilityModule.register({
        displayObject: cjsTable,
        parent: container,
        role: AccessibilityModule.ROLES.TABLE,
      });

      AccessibilityModule.register({
        displayObject: cjsTableBody,
        parent: cjsTable,
        role: AccessibilityModule.ROLES.TABLEBODY,
      });

      AccessibilityModule.register({
        accessibleOptions: {
          colIndex: colIndexVal,
          level: levelVal,
          rowIndex: rowIndexVal,
        },
        displayObject: cjsRow,
        parent: cjsTableBody,
        role: AccessibilityModule.ROLES.ROW,
      });

      AccessibilityModule.register({
        displayObject: cjsSpan,
        role: AccessibilityModule.ROLES.SPAN,
      });

      stage.accessibilityTranslator.update();
      trEl = parentEl.querySelector('tr');
    });

    describe('rendering', () => {
      it('creates form element', () => {
        expect(trEl).not.toBeNull();
      });

      it('sets "aria-level" attribute', () => {
        expect(parseInt(trEl.getAttribute('aria-level'), 10)).toEqual(levelVal);
      });

      it('sets "aria-colindex" attribute', () => {
        expect(parseInt(trEl.getAttribute('aria-colindex'), 10)).toEqual(
          colIndexVal
        );
      });

      it('sets "aria-rowindex" attribute', () => {
        expect(parseInt(trEl.getAttribute('aria-rowindex'), 10)).toEqual(
          rowIndexVal
        );
      });
    });

    describe('children checking', () => {
      describe('prohibited children', () => {
        let errorObj;

        beforeEach(() => {
          errorObj =
            /Children of row must have a role of cell, gridcell, columnheader, or rowheader/;
          stage.accessibilityTranslator.update();
        });

        it('throws error attempting to add prohibited child using addChild() ', () => {
          expect(() => {
            cjsRow.accessible.addChild(cjsSpan);
          }).toThrowError(errorObj);
        });

        it('throws error attempting to add prohibited child using addChildAt()', () => {
          expect(() => {
            cjsRow.accessible.addChildAt(cjsSpan, 0);
          }).toThrowError(errorObj);
        });
      });

      describe('permitted children', () => {
        let cjsDummy;

        beforeEach(() => {
          cjsDummy = new createjs.Shape();
          AccessibilityModule.register({
            displayObject: cjsDummy,
            role: AccessibilityModule.ROLES.CELL,
          });
          stage.accessibilityTranslator.update();
        });

        it('throws NO error when adding permitted child using addChild', () => {
          expect(() => {
            cjsRow.accessible.addChild(cjsDummy);
          }).not.toThrowError();
        });

        it('throws NO error when adding permitted child using addChildAt()', () => {
          expect(() => {
            cjsRow.accessible.addChildAt(cjsDummy, 0);
          }).not.toThrowError();
        });
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "level" property [for "aria-level"]', () => {
        expect(cjsRow.accessible.level).toEqual(levelVal);

        const newVal = -1;
        cjsRow.accessible.level = newVal;
        expect(cjsRow.accessible.level).toEqual(newVal);
      });

      it('can read and set "colIndex" property [for "aria-colindex"]', () => {
        expect(cjsRow.accessible.colIndex).toEqual(colIndexVal);

        const newVal = 111;
        cjsRow.accessible.colIndex = newVal;
        expect(cjsRow.accessible.colIndex).toEqual(newVal);
      });

      it('can read and set "rowIndex" property [for "aria-rowindex"]', () => {
        expect(cjsRow.accessible.rowIndex).toEqual(rowIndexVal);

        const newVal = 222;
        cjsRow.accessible.rowIndex = newVal;
        expect(cjsRow.accessible.rowIndex).toEqual(newVal);
      });
    });
  });
});
