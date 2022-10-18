import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class Grid extends createjs.Container {
  constructor(data, tabIndex) {
    super();
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.GRID,
    });
    this.table = new createjs.Container();
    AccessibilityModule.register({
      displayObject: this.table,
      role: AccessibilityModule.ROLES.TABLEBODY,
    });
    this.addChild(this.table);
    this.accessible.addChild(this.table);

    this.tabIndex = tabIndex;
    this.data = data;
    this.rowCount = this.data.length;
    this.colCount = this.data[0].length;
    this.cellWidths = _.map(this.data[0], 'cellWidth');
    this.cellHeight = this.data[0][0].cellHeight;
    this.totalWidth = _.sum(this.cellWidths);
    this.rows = [];
    this.setBounds(0, 0, this.totalWidth, this.cellHeight * this.rowCount);
    this.createTable();

    const firstCellWidget = _.get(data, '[0][0]');
    if (!firstCellWidget || !firstCellWidget.value) {
      throw new Error(
        "Invalid data sent to grid widget: the first row's first cell does not have a widget"
      );
    }
    firstCellWidget.value.accessible.tabIndex = tabIndex;
  }

  createTable() {
    this.createRows();
    this.setupLayout();
  }

  createRows() {
    for (let i = 0; i < this.rowCount; i++) {
      const row = this._createContainer(this.totalWidth, this.cellHeight);
      this.table.addChild(row);
      AccessibilityModule.register({
        displayObject: row,
        parent: this.table,
        role: AccessibilityModule.ROLES.ROW,
      });
      _.forEach(this.data[i], (data, index) => {
        let cell;
        if (data.type === 'header') {
          cell = this._createCell({
            value: data.value,
            index,
            bold: true,
            fontSize: 20,
          });
          row.addChild(cell);
          AccessibilityModule.register({
            displayObject: cell,
            parent: row,
            role: AccessibilityModule.ROLES.COLUMNHEADER,
          });
        } else {
          cell = this._createCell({
            value: data.value,
            index,
            align: 'center',
          });
          row.addChild(cell);
          AccessibilityModule.register({
            displayObject: cell,
            parent: row,
            role: AccessibilityModule.ROLES.GRIDCELL,
          });
        }
        cell.accessible.addChild(cell.cellContent);
      });

      this.rows.push(row);
    }
  }

  setupLayout() {
    _.forEach(this.rows, (row, i) => {
      row.y = this.cellHeight * i;

      _.forEach(row.children, (cell, j) => {
        cell.x = _.sum(_.slice(this.cellWidths, 0, j));
      });
    });
  }

  _createCell({ value, index, align = 'center' }) {
    const cell = this._createContainer(this.cellWidths[index], this.cellHeight);
    const cellContent = value;
    cell.addChild(cellContent);
    const cellContentBounds = cellContent.getBounds();

    let left = 0;
    switch (align) {
      case 'left':
        left = 5;
        break;
      case 'right':
        left = this.cellWidths[index] - cellContentBounds.width;
        break;
      default:
        left = (this.cellWidths[index] - cellContentBounds.width) / 2;
        break;
    }
    cellContent.x = left;
    cellContent.y =
      this.cellHeight - cellContentBounds.height >= 0
        ? (this.cellHeight - cellContentBounds.height) / 2
        : 0;

    cell.cellContent = cellContent;
    const shape = new createjs.Shape();
    shape.graphics
      .beginStroke('black')
      .drawRect(
        0,
        0,
        this.cellWidths[index],
        _.max([this.cellHeight, cell.getBounds().height])
      );
    cell.addChild(shape);

    const focusRect = new createjs.Shape();
    focusRect.graphics
      .beginFill('#5FC1FA')
      .drawRect(
        0,
        0,
        this.cellWidths[index],
        _.max([this.cellHeight, cell.getBounds().height])
      );
    cell.addChildAt(focusRect, 0);
    focusRect.visible = false;
    cell.focusRect = focusRect;

    cell.addEventListener('focus', this.onFocus.bind(cell));
    cell.addEventListener('blur', this.onBlur.bind(cell));
    return cell;
  }

  _createContainer(width, height) {
    const container = new createjs.Container();
    container.setBounds(0, 0, width, height);
    return container;
  }

  _createText({ value, maxWidth, bold = false, fontSize = 18 }) {
    const boldOption = bold ? 'bold' : '';
    const text = new createjs.Text().set({
      text: value,
      font: `${boldOption} ${fontSize}px Arial`,
      maxWidth,
      lineWidth: maxWidth - 20,
    });
    return text;
  }

  onFocus() {
    this.focusRect.visible = true;
  }

  onBlur() {
    this.focusRect.visible = false;
  }
}
