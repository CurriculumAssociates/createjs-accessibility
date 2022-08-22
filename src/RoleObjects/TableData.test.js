import * as createjs from 'createjs-module';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('TableData', () => {
  describe('register role', () => {
    let cjsTable;
    let cjsTableBody;
    let cjsRow;
    let cjsSpan;
    let tableEl;
    let colCountVal;
    let rowCountVal;

    beforeEach(() => {
      cjsTable = new createjs.Shape(); // dummy object
      cjsTableBody = new createjs.Shape(); // dummy object
      cjsRow = new createjs.Shape(); // dummy object
      cjsSpan = new createjs.Shape(); // dummy child object
      colCountVal = 10;
      rowCountVal = 30;

      AccessibilityModule.register({
        accessibleOptions: {
          colCount: colCountVal,
          rowCount: rowCountVal,
        },
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
        displayObject: cjsRow,
        parent: cjsTableBody,
        role: AccessibilityModule.ROLES.ROW,
      });

      AccessibilityModule.register({
        displayObject: cjsSpan,
        role: AccessibilityModule.ROLES.SPAN,
      });

      stage.accessibilityTranslator.update();
      tableEl = parentEl.querySelector('table');
    });

    describe('rendering', () => {
      it('creates form element', () => {
        expect(tableEl).not.toBeNull();
      });

      it('sets "aria-colcount" attribute', () => {
        expect(parseInt(tableEl.getAttribute('aria-colcount'), 10)).toEqual(
          colCountVal
        );
      });

      it('sets "aria-rowcount" attribute', () => {
        expect(parseInt(tableEl.getAttribute('aria-rowcount'), 10)).toEqual(
          rowCountVal
        );
      });
    });

    describe('children checking', () => {
      describe('prohibited children', () => {
        let errorObj;

        beforeEach(() => {
          errorObj =
            /Children of table must have a role of tableBody, tableFoot, or tableHead/;
          stage.accessibilityTranslator.update();
        });

        it('throws error attempting to add prohibited child using addChild() ', () => {
          expect(() => {
            cjsTable.accessible.addChild(cjsSpan);
          }).toThrowError(errorObj);
        });

        it('throws error attempting to add prohibited child using addChildAt()', () => {
          expect(() => {
            cjsTable.accessible.addChildAt(cjsSpan, 0);
          }).toThrowError(errorObj);
        });
      });

      describe('permitted children', () => {
        let cjsDummy;

        beforeEach(() => {
          cjsDummy = new createjs.Shape();
          AccessibilityModule.register({
            displayObject: cjsDummy,
            role: AccessibilityModule.ROLES.TABLEBODY,
          });
          stage.accessibilityTranslator.update();
        });

        it('throws NO error when adding permitted child using addChild', () => {
          expect(() => {
            cjsTable.accessible.addChild(cjsDummy);
          }).not.toThrowError();
        });

        it('throws NO error when adding permitted child using addChildAt()', () => {
          expect(() => {
            cjsTable.accessible.addChildAt(cjsDummy, 0);
          }).not.toThrowError();
        });
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "colCount" property [for "aria-colcount"]', () => {
        expect(cjsTable.accessible.colCount).toEqual(colCountVal);

        const newVal = 111;
        cjsTable.accessible.colCount = newVal;
        expect(cjsTable.accessible.colCount).toEqual(newVal);
      });

      it('can read and set "rowCount" property [for "aria-rowcount"]', () => {
        expect(cjsTable.accessible.rowCount).toEqual(rowCountVal);

        const newVal = 222;
        cjsTable.accessible.rowCount = newVal;
        expect(cjsTable.accessible.rowCount).toEqual(newVal);
      });
    });
  });
});
