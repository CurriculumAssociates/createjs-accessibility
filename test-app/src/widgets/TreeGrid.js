import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import TreeGridRow from './TreeGridRow';

const OFFSET = 20;

export default class TreeGrid extends createjs.Container {
  constructor(data, tabIndex) {
    super();
    _.bindAll(this, '_onCollapseRow', '_onExpandRow');

    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.TREEGRID,
      events: [
        {
          eventName: 'collapseRow',
          listener: this._onCollapseRow,
        },
        {
          eventName: 'expandRow',
          listener: this._onExpandRow,
        },
      ],
    });

    this._table = new createjs.Container();
    AccessibilityModule.register({
      displayObject: this._table,
      role: AccessibilityModule.ROLES.TABLEBODY,
    });
    this.addChild(this._table);
    this.accessible.addChild(this._table);
    this._data = data.rows;
    this._numRows = data.rows.length;
    this._numCols = data.rows[0].rowData.length;
    this._cellWidth = data.cellWidth;
    this._cellHeight = data.cellHeight;
    this._totalWidth = data.cellWidth * this._numCols;
    this._totalHeight = data.cellHeight * this._numRows;
    this._rows = [];
    this.setBounds(0, 0, this._totalWidth, this._totalHeight);

    this._createTable();

    const firstFocusableRow = _.find(
      this._table.accessible.children,
      (row) => !_.isUndefined(row.accessible.tabIndex)
    );
    firstFocusableRow.accessible.tabIndex = tabIndex;
  }

  _createTable() {
    this._createRows();
    this._setupLayout();
  }

  _createRows() {
    const rowWidth = this._totalWidth;
    const rowHeight = this._cellHeight;
    const cellCount = this._numCols;
    for (let i = 0; i < this._data.length; i++) {
      const row = new TreeGridRow(
        this._data[i],
        i,
        rowWidth,
        rowHeight,
        cellCount
      ); // eslint-disable-line max-len
      row.collapsedArrow.addEventListener('click', this._onExpandRow);
      row.expandedArrow.addEventListener('click', this._onCollapseRow);
      this._table.addChild(row);
      this._table.accessible.addChild(row);
      this._rows.push(row);
      row.visible = this._data[i].level === 1;
    }
  }

  _onExpandRow(evt) {
    // to handle both CAM expandRow event and CJS click event with the same listener
    const row = evt.rowDisplayObject || evt.target.parent;

    row.expanded = true;
    const showRowsAtLevel = row.accessible.level + 1;
    const startUpdateIndex = _.findIndex(this._rows, row) + 1;
    let finalUpdateIndex =
      _.findIndex(
        this._rows,
        (testRow) => testRow.accessible.level <= row.accessible.level,
        startUpdateIndex
      ) - 1;
    if (finalUpdateIndex < 0) {
      finalUpdateIndex = this._rows.length - 1;
    }
    for (let i = startUpdateIndex; i <= finalUpdateIndex; i++) {
      const checkRow = this._rows[i];
      const rowLevel = checkRow.accessible.level;
      if (showRowsAtLevel === rowLevel) {
        checkRow.visible = true;
        if (checkRow.accessible.expanded) {
          // need to recurse to update the visibility of rows that are expanded
          // decendants of this one
          this._onExpandRow({ rowDisplayObject: checkRow });
        }
      }
    }

    this._setupLayout();
  }

  _onCollapseRow(evt) {
    // to handle both CAM collapseRow event and CJS click events with the same listener
    const row = evt.rowDisplayObject || evt.currentTarget.parent;

    row.expanded = false;
    const startUpdateIndex = _.findIndex(this._rows, row) + 1;
    let finalUpdateIndex =
      _.findIndex(
        this._rows,
        (testRow) => testRow.accessible.level <= row.accessible.level,
        startUpdateIndex
      ) - 1;
    if (finalUpdateIndex < 0) {
      finalUpdateIndex = this._rows.length - 1;
    }
    for (let i = startUpdateIndex; i <= finalUpdateIndex; i++) {
      this._rows[i].visible = false;
    }

    this._setupLayout();
  }

  _setupLayout() {
    let previousRow = this._rows[0];
    for (let i = 1; i < this._rows.length; i++) {
      if (this._rows[i].visible) {
        this._rows[i].x = (this._rows[i].data.level - 1) * OFFSET;
        this._rows[i].y = previousRow.y + this._cellHeight;
        previousRow = this._rows[i];
      }
    }
  }
}
