import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class TreeGridRow extends createjs.Container {
  constructor(data, index, rowWidth, rowHeight, cellCount) {
    super();
    _.bindAll(this, '_onBlur', '_onFocus', '_onCellBlur', '_onCellFocus');
    AccessibilityModule.register({
      accessibleOptions: {
        level: data.level,
        tabIndex: data.type === 'header' ? undefined : -1,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.ROW,
      events: [
        {
          eventName: 'focus',
          listener: this._onFocus,
        },
        {
          eventName: 'blur',
          listener: this._onBlur,
        },
      ],
    });
    this.setBounds(0, 0, rowWidth, rowHeight);
    this.data = data;
    this.type = data.type;
    this.index = index;
    this.cellCount = cellCount;
    this.rowIndex = index;
    this.cellWidth = rowWidth / cellCount;
    this.cellHeight = rowHeight;

    const bg = new createjs.Shape();
    bg.graphics
      .beginStroke('black')
      .beginFill('#cccbbb')
      .drawRect(0, 0, rowWidth, rowHeight);
    bg.setBounds(0, 0, rowWidth, rowHeight);
    this.addChild(bg);

    this._focusRect = new createjs.Shape();
    this._focusRect.graphics
      .beginFill('#5FC1FA')
      .drawRect(0, 0, rowWidth, rowHeight);
    this.addChild(this._focusRect);
    this._focusRect.visible = false;

    this.collapsedArrow = new createjs.Shape();
    this.collapsedArrow.graphics
      .beginStroke('black')
      .beginFill('grey')
      .moveTo(0, 0)
      .lineTo(this.cellHeight / 2, this.cellHeight / 2)
      .lineTo(0, this.cellHeight)
      .endStroke()
      .endFill();
    this.collapsedArrow.x = 4;
    this.addChild(this.collapsedArrow);
    this.collapsedArrow.visible = false;

    this.expandedArrow = new createjs.Shape();
    this.expandedArrow.graphics
      .beginStroke('black')
      .beginFill('grey')
      .moveTo(0, 0)
      .lineTo(this.cellHeight, 0)
      .lineTo(this.cellHeight / 2, this.cellHeight / 2)
      .endStroke()
      .endFill();
    this.addChild(this.expandedArrow);
    this.expandedArrow.y = 4;
    this.expandedArrow.visible = false;

    if (this.data.childrenData > 0) {
      this.collapsedArrow.visible = true;
      this.expanded = false;
    }

    this._addRowData();
  }

  get expanded() {
    return this.accessible.expanded;
  }

  set expanded(val) {
    this.collapsedArrow.visible = !val;
    this.expandedArrow.visible = val;
    this.accessible.expanded = val;
  }

  _addRowData() {
    _.forEach(this.data.rowData, (data, index) => {
      let cell;
      if (this.type === 'header') {
        cell = this._createCell({ data, bold: true, fontSize: 20 });
        AccessibilityModule.register({
          displayObject: cell,
          parent: this,
          role: AccessibilityModule.ROLES.COLUMNHEADER,
          accessibleOptions: {
            text: data,
          },
        });
      } else {
        cell = this._createCell({ data, bold: false, fontSize: 14 });
        AccessibilityModule.register({
          displayObject: cell,
          parent: this,
          role: AccessibilityModule.ROLES.GRIDCELL,
          accessibleOptions: {
            text: data,
          },
        });
      }
      cell.x = this.cellWidth * index;

      this.addChild(cell);
    });
  }

  _createCell({ data, align = 'center', bold, fontSize }) {
    const cell = this._createContainer(this.cellWidth, this.cellHeight);
    const text = this._createText({
      value: data,
      maxWidth: this.cellWidth,
      bold,
      fontSize,
    });
    const textBounds = text.getBounds();
    cell.addChild(text);
    let left = 0;
    switch (align) {
      case 'left':
        left = 5;
        break;
      case 'right':
        left = this.cellWidth - textBounds.width;
        break;
      default:
        left = this.cellWidth * 0.5 - textBounds.width * 0.5;
        break;
    }
    text.x = left;
    text.y =
      this.cellHeight - textBounds.height >= 0
        ? (this.cellHeight - textBounds.height) / 2
        : 0;

    cell.text = data;
    const shape = new createjs.Shape();
    shape.graphics
      .beginStroke('fff')
      .drawRect(
        0,
        0,
        this.cellWidth,
        _.max([this.cellHeight, cell.getBounds().height])
      );
    cell.addChild(shape);

    const focusRect = new createjs.Shape();
    focusRect.graphics
      .beginFill('#fff')
      .drawRect(
        0,
        0,
        this.cellWidth,
        _.max([this.cellHeight, cell.getBounds().height])
      );
    cell.addChildAt(focusRect, 0);
    focusRect.visible = false;
    cell.focusRect = focusRect;
    cell.addEventListener('focus', this._onCellFocus);
    cell.addEventListener('blur', this._onCellBlur);
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

  _onFocus(evt) {
    this._focusRect.visible = true;
    evt.preventDefault();
    evt.stopPropagation();

    const focusablesInRow = _.flatten(
      _.map(this.accessible.children, (cellDisplayObject) => {
        const interactiveChildren = _.filter(
          cellDisplayObject.accessible.children,
          (widget) => !_.isUndefined(widget.accessible.tabIndex)
        );
        return interactiveChildren;
      })
    );
    _.forEach(focusablesInRow, (focusable) => {
      focusable.accessible.tabIndex = 0;
    });
  }

  _onBlur() {
    this._focusRect.visible = false;
  }

  _onCellFocus(evt) {
    evt.target.focusRect.visible = true;
  }

  _onCellBlur(evt) {
    evt.target.focusRect.visible = false;
  }
}
