import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import TreeGridRow from './TreeGridRow';

const OFFSET = 20;

export default class TreeGrid extends createjs.Container {
  constructor(data, tabIndex) {
    super(data, tabIndex);
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.TABLEBODY,
    });
    this.tabIndex = tabIndex;
    this.data = data.rows;
    this.rowCount = this.data.length;
    this.colCount = this.data[0].rowData.length;
    this.cellWidth = data.cellWidth;
    this.cellHeight = data.cellHeight;
    this.totalWidth = data.cellWidth * this.colCount;
    this.totalHeight = data.cellHeight * this.rowCount;
    this.rows = [];
    this.setBounds(0, 0, this.totalWidth, this.totalHeight);

    this.createTable();
  }

  createTable() {
    this.createRows();
    this.setupLayout();
  }

  createRows() {
    const rowWidth = this.totalWidth;
    const rowHeight = this.cellHeight;
    const cellCount = this.colCount;
    const { data } = this;
    for (let i = 0; i < data.length; i++) {
      const index = i;
      const row = new TreeGridRow(data[i], index, rowWidth, rowHeight, cellCount, this.tabIndex++);
      row.addEventListener('keyboardClick', this.toggleTreeVisibility.bind(this));
      row.addEventListener('click', this.toggleTreeVisibility.bind(this));
      row.addRowData();
      this.addChild(row);
      this.accessible.addChild(row);
      this.rows.push(row);
      if (data[i].level === 1) {
        row.visible = true;
      } else {
        row.visible = false;
      }
      row.hasChildren = (row.data.childrenData > 0);
      row.opened = false;
    }
  }

  toggleTreeVisibility(evt) {
    const { currentTarget } = evt;
    currentTarget.opened = !currentTarget.opened;
    currentTarget.hasChildren && currentTarget.toggleArrow();
    if (currentTarget.opened) {
      this.open(currentTarget);
    } else {
      this.close(currentTarget);
    }
    this.setupLayout();
  }

  open(currentTarget) {
    if (currentTarget.hasChildren) {
      const lastChild = this.updateVisibility(currentTarget, true);
      if (lastChild.opened && lastChild.hasChildren > 0) {
        this.open(lastChild);
      }
    }
  }

  close(currentTarget) {
    if (currentTarget.data.childrenData > 0) {
      const lastChild = this.updateVisibility(currentTarget, false);
      if (!lastChild.visible && lastChild.data.childrenData > 0) {
        this.close(lastChild);
      }
    }
  }

  updateVisibility(currentTarget, visible) {
    let lastChild;
    const noOfchildren = currentTarget.index + currentTarget.data.childrenData;
    for (let i = currentTarget.index + 1; i < noOfchildren + 1; i++) {
      this.rows[i].visible = visible;
      lastChild = this.rows[i];
    }
    return lastChild;
  }

  setupLayout() {
    let previousRow = this.rows[0];
    for (let i = 1; i < this.rows.length; i++) {
      if (this.rows[i].visible) {
        this.rows[i].set({
          y: previousRow.y + this.cellHeight,
          x: (this.rows[i].data.level - 1) * OFFSET,
        });
        previousRow = this.rows[i];
      }
    }
  }

  onFocus(evt) {
    this.focusRect.visible = true;
    evt.preventDefault();
    evt.stopPropagation();
  }

  onBlur() {
    this.focusRect.visible = false;
  }
}
