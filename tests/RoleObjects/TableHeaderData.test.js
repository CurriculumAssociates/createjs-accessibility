import * as createjs from 'createjs-module';
import AccessibilityModule from '../../src/index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('TableHeaderData', () => {
  describe('register role', () => {
    let cjsTableHeader;
    let cjsTable;
    let cjsTableBody;
    let cjsRow;
    let thEl;
    let sortVal;

    beforeEach(() => {
      cjsTable = new createjs.Shape(); // dummy object
      cjsTableBody = new createjs.Shape(); // dummy object
      cjsRow = new createjs.Shape(); // dummy object
      cjsTableHeader = new createjs.Shape(); // dummy object
      sortVal = 'ascending';

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
        displayObject: cjsRow,
        parent: cjsTableBody,
        role: AccessibilityModule.ROLES.ROW,
      });

      AccessibilityModule.register({
        accessibleOptions: {
          sort: sortVal,
        },
        displayObject: cjsTableHeader,
        parent: cjsRow,
        role: AccessibilityModule.ROLES.COLUMNHEADER,
      });

      stage.accessibilityTranslator.update();
      thEl = parentEl.querySelector('th');
    });

    describe('rendering', () => {
      it('creates th element', () => {
        expect(thEl).not.toBeNull();
      });

      it('sets "aria-sort" attribute', () => {
        expect(thEl.getAttribute('aria-sort')).toEqual(sortVal);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "sort" property [for "aria-sort"]', () => {
        expect(cjsTableHeader.accessible.sort).toEqual(sortVal);

        const newVal = 'descending';
        cjsTableHeader.accessible.sort = newVal;
        expect(cjsTableHeader.accessible.sort).toEqual(newVal);
      });
    });
  });
});
