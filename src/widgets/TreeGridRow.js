import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class TreeGridRow extends createjs.Container {
  constructor(data, index, rowWidth, rowHeight, cellCount, tabIndex) {
    super();
    _.bindAll(this, 'onFocus', 'onBlur');
    AccessibilityModule.register({
      accessibleOptions: {
        level: data.level,
        rowIndex: index,
        tabIndex,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.ROW,
      events: [
        {
          eventName: 'focus',
          listener: this.onFocus,
        },
        {
          eventName: 'blur',
          listener: this.onBlur,
        }
      ],
    });
    this.setBounds(0, 0, rowWidth, rowHeight);
    this.tabIndex = tabIndex;
    this.data = data;
    this.type = data.type;
    this.index = index;
    this.cellCount = cellCount;
    this.rowIndex = index;
    this.cellWidth = rowWidth / cellCount;
    this.cellHeight = rowHeight;
    this.expanded = false;
    const bg = new createjs.Shape();
    bg.graphics.beginStroke('black').beginFill('#cccbbb').dr(0, 0, rowWidth, rowHeight);
    bg.setBounds(0, 0, rowWidth, rowHeight);
    this.addChild(bg);


    this.focusRect = new createjs.Shape();
    this.focusRect.graphics.beginFill('#5FC1FA').drawRect(0, 0, rowWidth, rowHeight);
    this.addChild(this.focusRect);
    this.focusRect.visible = false;
    this.addEventListener('blur', this.onBlur);
    this.addEventListener('focus', this.onFocus);

    const collapsedArrow = new createjs.Shape();
    let g = collapsedArrow.graphics;
    g.beginStroke('black');
    g.beginFill('grey');
    g.moveTo(0, 0);
    g.lineTo(this.cellHeight / 2, this.cellHeight / 2);
    g.lineTo(0, this.cellHeight);
    g.endStroke();
    g.endFill();
    collapsedArrow.x = 4;
    this.addChild(collapsedArrow);
    const childPresent = (this.data.childrenData > 0);
    collapsedArrow.visible = childPresent;
    this.collapsedArrow = collapsedArrow;
    const expandedArrow = new createjs.Shape();
    g = expandedArrow.graphics;
    g.beginStroke('black');
    g.beginFill('grey');
    g.moveTo(0, 0);
    g.lineTo(this.cellHeight, 0);
    g.lineTo(this.cellHeight / 2, this.cellHeight / 2);
    g.endStroke();
    g.endFill();
    this.addChild(expandedArrow);
    expandedArrow.y = 4;
    expandedArrow.visible = false;
    this.expandedArrow = expandedArrow;
  }

  addRowData() {
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
      cell.set({
        x: this.cellWidth * index,
      });

      this.addChild(cell);
      cell.accessible.tabIndex = this.tabIndex++;
      cell.accessible.rowindex = this.rowIndex;
      cell.accessible.colindex = index;
    });
  }


  _createCell({
    data, align = 'center', bold, fontSize,
  }) {
    const cell = this._createContainer(this.cellWidth, this.cellHeight);
    const text = this._createText({
      value: data, maxWidth: this.cellWidth, bold, fontSize,
    });
    const textBounds = text.getBounds();
    cell.addChild(text);
    let left = 0;
    switch (align) {
      case 'left':
        left = 5;
        break;
      case 'right':
        left = (this.cellWidth - textBounds.width);
        break;
      default:
        left = (this.cellWidth * 0.5 - textBounds.width * 0.5);
        break;
    }
    text.set({
      x: left,
      y: ((this.cellHeight - textBounds.height) >= 0)
        ? ((this.cellHeight - textBounds.height) / 2) : 0,
    });

    cell.text = data;
    const shape = new createjs.Shape();
    shape.graphics.beginStroke('fff').drawRect(0, 0, this.cellWidth, _.max([this.cellHeight, cell.getBounds().height]));
    cell.addChild(shape);

    const focusRect = new createjs.Shape();
    focusRect.graphics.beginFill('#fff').drawRect(0, 0, this.cellWidth, _.max([this.cellHeight, cell.getBounds().height]));
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

  toggleArrow() {
    this.collapsedArrow.visible = !this.collapsedArrow.visible;
    this.expandedArrow.visible = !this.collapsedArrow.visible;
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
