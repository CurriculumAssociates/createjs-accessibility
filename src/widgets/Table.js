import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class Table extends createjs.Container {
  constructor({
    headersData, data, showBorders = true, cellHeight = 100,
  }) {
    super();
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.TABLEBODY,
    });

    const tableHeader = _.map(headersData, 'value');
    // mark row as header
    tableHeader.header = true;
    data.splice(0, 0, tableHeader);

    this.data = data;
    this.showBorders = showBorders;

    this.rowCount = this.data.length;
    this.colCount = tableHeader.length;

    this.cellWidths = _.map(headersData, 'width');
    this.cellHeight = cellHeight;
    this.totalWidth = _.sum(this.cellWidths);

    this.rows = [];
    this.setBounds(0, 0, this.totalWidth, this.cellHeight * this.rowCount);
    this.createTable();
  }

  createTable() {
    this.createRows();
    this.setupLayout();
  }

  createRows() {
    for (let i = 0; i < this.rowCount; i++) {
      const row = this._createContainer(this.totalWidth, this.cellHeight);
      this.addChild(row);
      AccessibilityModule.register({
        displayObject: row,
        parent: this,
        role: AccessibilityModule.ROLES.ROW,
      });

      const isHeader = this.data[i].header;

      _.forEach(this.data[i], (data, index) => {
        const cell = this._createCell({ value: data, index, align: 'left' });
        row.addChild(cell);
        const { ROLES: { COLUMNHEADER, CELL } } = AccessibilityModule;
        const ROLE = isHeader ? COLUMNHEADER : CELL;
        AccessibilityModule.register({
          displayObject: cell,
          parent: row,
          role: ROLE,
          accessibleOptions: {
            text: data,
          },
        });
      });

      this.rows.push(row);
    }
  }

  setupLayout() {
    _.forEach(this.rows, (row, i) => {
      row.set({
        y: this.cellHeight * i,
      });
      row.rowIndex = i;
      row.accessible.rowindex = i;

      _.forEach(row.children, (cell, j) => {
        cell.set({
          x: _.sum(_.slice(this.cellWidths, 0, j)),
        });
        cell.rowIndex = i;
        cell.colIndex = j;
        cell.accessible.rowindex = i;
        cell.accessible.colindex = j;
        cell.accessible.rowspan = 1;
        cell.accessible.colspan = 1;
      });
    });
  }

  _createCell({
    value, index, align = 'center', bold, fontSize,
  }) {
    const cell = this._createContainer(this.cellWidths[index], this.cellHeight);
    const text = this._createText({
      value, maxWidth: this.cellWidths[index], bold, fontSize,
    });
    const textBounds = text.getBounds();
    cell.addChild(text);

    let left = 0;
    switch (align) {
      case 'left':
        left = 5;
        break;
      case 'right':
        left = (this.cellWidths[index] - textBounds.width);
        break;
      default:
        left = (this.cellWidths[index] - textBounds.width) / 2;
        break;
    }
    text.set({
      x: left,
      y: ((this.cellHeight - textBounds.height) >= 0)
        ? ((this.cellHeight - textBounds.height) / 2) : 0,
    });

    cell.text = value;
    const shape = new createjs.Shape();
    shape.graphics.beginStroke('black').drawRect(0, 0, this.cellWidths[index], _.max([this.cellHeight, cell.getBounds().height]));
    cell.addChild(shape);

    return cell;
  }

  _createContainer(width, height) {
    const container = new createjs.Container();
    container.setBounds(0, 0, width, height);
    return container;
  }

  _createText({
    value, maxWidth, bold = false, fontSize = 18,
  }) {
    const boldOption = bold ? 'bold' : '';
    const text = new createjs.Text().set({
      text: value,
      font: `${boldOption} ${fontSize}px Arial`,
      maxWidth,
      lineWidth: maxWidth - 20,
    });
    return text;
  }
}
