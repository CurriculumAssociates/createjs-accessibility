import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import Article from './Article';
import Button from './Button';
import ComboBox from './ComboBox';
import Img from './Img';
import ListBox from './ListBox';
import Link from './Link';
import ListItem from './ListItem';
import MenuBar from './MenuBar';
import Menu from './Menu';
import MenuItem from './MenuItem';
import MenuItemCheckBox from './MenuItemCheckBox';
import MenuItemRadio from './MenuItemRadio';
import MultiListBox from './MultiListBox';
import Option from './Option';
import OrderedList from './OrderedList';
import SingleLineTextInput from './SingleLineTextInput';
import MultiLineTextInput from './MultiLineTextInput';
import CheckBox from './CheckBox';
import Search from './Search';
import RadioGroup from './RadioGroup';
import Draggable from './Draggable';
import Slider from './Slider';
import Table from './Table';
import Switch from './Switch';
import Tooltip from './Tooltip';
import ProgressBar from './ProgressBar';
import Figure from './Figure';
import SpinButton from './SpinButton';
import Grid from './Grid';
import Tree from './Tree';
import TreeItem from './TreeItem';
import Separator from './Separator';
import Dialog from './Dialog';
import ScrollBar from './ScrollBar';
import ToolBar from './ToolBar';
import TabList from './TabList';
import Tab from './Tab';
import TabPanel from './TabPanel';
import Feed from './Feed';
import TreeGrid from './TreeGrid';
import FormatText from './FormatText';
import AlertDialog from './AlertDialog';
import Marquee from './Marquee';
import PlainTextMath from './PlainTextMath';

import imgTestSrc from './media/Curriculum-Associates-Logo-964x670.png';
import formulaImg1 from './media/formula1.png';
import formulaImg2 from './media/formula2.png';

const MENU_HEIGHT = 20;
const OPTION_WIDTH = 115;
const OPTION_HEIGHT = 18;
const HEADER_HEIGHT = 34;
const FOOTER_HEIGHT = 30;

export default class AppWindow extends createjs.Container {
  constructor(width, height) {
    super();
    _.bindAll(this, '_showDefaultScreen', '_showFormTestCase', '_showLinkTestCase',
      '_showDragAndDropTestCase', '_showTableTestCase', '_showTabListWithPanelCase', '_showAboutDialog',
      '_showListTestCase', '_showArticleTestCase', '_showCheckBoxTestCase', '_showSearchTestCase',
      '_showSliderTestCase', '_showMenuItemCheckBoxTestCase', '_showMenuItemRadioTestCase',
      '_showRadioGroupAndProgressBarTestCase', '_showGridTestCase', '_showTreeTestCase',
      '_showFeedTestCase', '_showTreeGridTestCase', '_showTextFormatCase', '_mathTextCase');
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.NONE,
    });

    this._headerArea = new createjs.Container();
    this.addChild(this._headerArea);
    AccessibilityModule.register({
      displayObject: this._headerArea,
      role: AccessibilityModule.ROLES.BANNER,
    });
    this.accessible.addChild(this._headerArea);

    const headerText = new createjs.Text('Createjs Accessibility Test APP', 'bold 32px Arial', '#000');
    this._headerArea.addChild(headerText);
    AccessibilityModule.register({
      displayObject: headerText,
      role: AccessibilityModule.ROLES.HEADING1,
      accessibleOptions: {
        text: headerText.text,
      },
    });
    this._headerArea.accessible.addChild(headerText);
    this._headerArea.accessible.title = 'Createjs Accessibility Test APP';
    this._headerArea.accessible.lang = 'en';
    this._headerArea.setBounds(0, 0, 800, HEADER_HEIGHT);
    headerText.lineWidth = 800;
    const bannerBounds = this._headerArea.getBounds();
    headerText.x = bannerBounds.width * 0.5 - headerText.getBounds().width * 0.5;
    headerText.y = bannerBounds.height * 0.5 - headerText.getBounds().height * 0.5;

    const headerBG = new createjs.Shape();
    headerBG.graphics.beginFill('#808080').drawRect(0, 0, bannerBounds.width, bannerBounds.height);
    this._headerArea.addChildAt(headerBG, 0);

    this._createMenu(width, height);
    this._contentArea = new createjs.Container();
    this._contentArea.y = HEADER_HEIGHT + MENU_HEIGHT;
    this._contentArea.setBounds(0, 0, width, height - (MENU_HEIGHT + HEADER_HEIGHT
      + FOOTER_HEIGHT));
    this.addChild(this._contentArea);

    AccessibilityModule.register({
      displayObject: this._contentArea,
      parent: this,
      role: AccessibilityModule.ROLES.MAIN,
    });
    this._footerArea = new createjs.Container();
    this.addChild(this._footerArea);
    AccessibilityModule.register({
      displayObject: this._footerArea,
      role: AccessibilityModule.ROLES.CONTENTINFO,
    });
    this.accessible.addChild(this._footerArea);
    this._footerArea.setBounds(0, 0, width, FOOTER_HEIGHT);

    const contentinfo = new createjs.Text('This webapp uses the ISC license', 'bold 18px Arial', '#000');
    this._footerArea.addChild(contentinfo);
    AccessibilityModule.register({
      displayObject: contentinfo,
      role: AccessibilityModule.ROLES.HEADING3,
      accessibleOptions: {
        text: contentinfo.text,
      },
    });
    this._footerArea.accessible.addChild(contentinfo);

    contentinfo.lineWidth = width;
    const footerBounds = this._footerArea.getBounds();
    contentinfo.x = footerBounds.width * 0.5 - contentinfo.getBounds().width * 0.5;
    contentinfo.y = footerBounds.height * 0.5 - contentinfo.getBounds().height * 0.5;

    const footerBG = new createjs.Shape();
    footerBG.graphics.beginFill('#808080').drawRect(0, 0, footerBounds.width, footerBounds.height);
    this._footerArea.addChildAt(footerBG, 0);
    this._footerArea.y = this._contentArea.y + this._contentArea.getBounds().height;

    const currentTime = new createjs.Container();
    this._footerArea.addChild(currentTime);
    AccessibilityModule.register({
      displayObject: currentTime,
      role: AccessibilityModule.ROLES.NONE,
    });
    this._footerArea.accessible.addChildAt(currentTime, 0);
    const timeLabel = new createjs.Text('Elapsed time: ', 'bold 18px Arial');
    AccessibilityModule.register({
      displayObject: timeLabel,
      role: AccessibilityModule.ROLES.SPAN,
      accessibleOptions: {
        text: timeLabel.text,
      },
    });
    currentTime.addChild(timeLabel);
    currentTime.accessible.addChild(timeLabel);
    const startTime = Date.now();
    const timer = new createjs.Text('0 seconds', 'bold 18px Arial');
    timer.x = timeLabel.getBounds().width;
    currentTime.addChild(timer);
    AccessibilityModule.register({
      displayObject: timer,
      role: AccessibilityModule.ROLES.TIMER,
      accessibleOptions: {
        text: timer.text,
      },
    });
    currentTime.accessible.addChild(timer);
    currentTime.accessible.dir = 'ltr';
    currentTime.x = 10;
    currentTime.y = 5;
    const updateTime = () => {
      const ellapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      timer.text = `${ellapsedSeconds} seconds`;
      timer.accessible.text = timer.text;
    };
    setInterval(updateTime, 1000);

    this._showDefaultScreen();
    this.createGrid();
  }

  _createMenu(width) {
    this.nav = new createjs.Container();
    this.addChild(this.nav);
    AccessibilityModule.register({
      displayObject: this.nav,
      parent: this,
      role: AccessibilityModule.ROLES.NAVIGATION,
    });
    this.nav.y = this._headerArea.getBounds().height;

    this._menuBar = new MenuBar(width, MENU_HEIGHT, 'Test case selector');
    this.nav.addChild(this._menuBar);
    this.nav.accessible.addChild(this._menuBar);

    const testCasesMenu = new Menu('Test Cases', MENU_HEIGHT, 0, 'T');
    this._menuBar.addMenu(testCasesMenu);
    const testCasesGroup = {
      group1: {
        ClassRef: MenuItem,
        testCases: [
          { name: 'Default', listener: this._showDefaultScreen },
          { name: 'Form', listener: this._showFormTestCase },
          { name: 'Drag and drop', listener: this._showDragAndDropTestCase },
          { name: 'Table', listener: this._showTableTestCase },
          { name: 'TabList With Panel', listener: this._showTabListWithPanelCase },
          { name: 'Link', listener: this._showLinkTestCase },
          { name: 'List', listener: this._showListTestCase },
          { name: 'Article', listener: this._showArticleTestCase },
          { name: 'CheckBox', listener: this._showCheckBoxTestCase },
          { name: 'Search', listener: this._showSearchTestCase },
          { name: 'Color Editor and Transforms', listener: this._showSliderTestCase },
          { name: 'Order Pizza', listener: this._showRadioGroupAndProgressBarTestCase },
          { name: 'Grid', listener: this._showGridTestCase },
          { name: 'Tree', listener: this._showTreeTestCase },
          { name: 'Feed', listener: this._showFeedTestCase },
          { name: 'TreeGrid', listener: this._showTreeGridTestCase },
          { name: 'Text Format', listener: this._showTextFormatCase },
          { name: 'Math', listener: this._mathTextCase },
        ],
      },
      group2: {
        ClassRef: MenuItemCheckBox,
        testCases: [
          { name: 'ShowGrid', listener: this._showMenuItemCheckBoxTestCase },
        ],
      },
    };

    _(testCasesGroup).forEach((group) => {
      const { ClassRef, testCases } = group;
      const listenerAsCallback = ClassRef === MenuItemCheckBox;
      _.forEach(testCases, (testCase) => {
        const item = new ClassRef(
          testCase.name,
          0,
          listenerAsCallback ? testCase.listener : _.noop(),
        );
        !listenerAsCallback && item.addEventListener('click', testCase.listener);
        item.addEventListener('keyboardClick', testCase.listener);
        testCasesMenu.addMenuItem(item);
      });
      if (group !== _.findLast(testCasesGroup)) {
        const bounds = testCasesMenu._itemContainer.getBounds();
        const separator = new Separator(bounds.width, 1);
        testCasesMenu.addMenuItem(separator);
      }
    });


    const testCasesMenuItemRadio = new Menu('Contrast Radio', MENU_HEIGHT, 0, 'c');
    this._menuBar.addMenu(testCasesMenuItemRadio);
    const testCasesMenuRadio = [
      { name: ' Black-Yellow', bgColor: '#000000', textColor: '#ffff00' },
      { name: ' Grey-White', bgColor: '#343A40', textColor: '#F8F9FA' },
      { name: ' Blue-White', bgColor: '#0000C7', textColor: '#E0E0E0' },
    ];

    const menuItemRadioArray = [];
    testCasesMenuRadio.forEach((testCase) => {
      const item = new MenuItemRadio(testCase.name, 0,
        this._showMenuItemRadioTestCase);
      item.radio.bgColor = testCase.bgColor;
      item.radio.textColor = testCase.textColor;
      testCasesMenuItemRadio.addMenuItem(item);
      menuItemRadioArray.push(item);
    });
    this.menuItemRadioArray = menuItemRadioArray;

    const help = new Menu('Help', MENU_HEIGHT, 0, 'h');
    const about = new MenuItem('About', 0);
    about.addEventListener('click', this._showAboutDialog);
    about.addEventListener('keyboardClick', this._showAboutDialog);
    help.addMenuItem(about);
    this._menuBar.addMenu(help);
  }

  _clearScreen() {
    this._menuBar._closeMenus();
    this._contentArea.removeAllChildren();
    this._contentArea.accessible.removeAllChildren();
    // Move the nav to the top
    this.setChildIndex(this.nav, this.getNumChildren() - 1);
  }

  _showDefaultScreen() {
    this._clearScreen();

    const options = {
      src: imgTestSrc,
      alt: 'Curriculum Associates Logo',
      width: 500,
      height: 300,
      cjsScaleX: (500 / 964),
      cjsScaleY: (300 / 673),
    };

    const figure = new Figure(options, 'Making Classrooms Better Place for Teachers and Students');
    figure.x = 100;
    figure.y = 50;
    this._contentArea.addChild(figure);
    this._contentArea.accessible.addChild(figure);

    const testDisplayObject1 = new createjs.Text('Welcome to the Createjs Accessibility Module test program.', '16px Arial');
    testDisplayObject1.x = 144;
    testDisplayObject1.y = 400;
    AccessibilityModule.register({
      displayObject: testDisplayObject1,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: testDisplayObject1.text,
      },
    });
    this._contentArea.addChild(testDisplayObject1);

    const testDisplayObject2 = new createjs.Text('Use the menu bar to move between the various test cases.', '14px Arial');
    testDisplayObject2.x = 169;
    testDisplayObject2.y = 440;
    AccessibilityModule.register({
      displayObject: testDisplayObject2,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: testDisplayObject2.text,
      },
    });
  }

  createGrid() {
    const dummyCanvas = document.createElement('canvas');
    dummyCanvas.width = 800;
    dummyCanvas.height = 800;
    dummyCanvas.id = 'dummyCanvas';

    const ctx = dummyCanvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 800; i += 10) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 800);
      ctx.stroke();

      ctx.moveTo(0, i);
      ctx.lineTo(800, i);
      ctx.stroke();
    }

    const gridImageData = dummyCanvas.toDataURL();

    const options = {
      src: gridImageData,
      alt: 'a grid covering the background',
      width: 800,
      height: 800,
      cjsScaleX: 1,
      cjsScaleY: 1,
    };
    this.gridImage = new Img(options, options.width, options.height);
  }

  _showMenuItemCheckBoxTestCase(event) {
    let menuItemCheckBoxInst = event;
    if (!(menuItemCheckBoxInst instanceof MenuItemCheckBox)) {
      menuItemCheckBoxInst = event.currentTarget;
    }
    const showGrid = menuItemCheckBoxInst.checkBox.checked;
    if (showGrid) {
      this._contentArea.addChildAt(this.gridImage, 1);
      this._contentArea.accessible.addChildAt(this.gridImage, 1);
    } else {
      this._contentArea.removeChild(this.gridImage);
      this._contentArea.accessible.removeChild(this.gridImage);
    }
  }

  _showMenuItemRadioTestCase(evt) {
    this._clearScreen();
    this.menuItemRadioArray.forEach((item) => {
      item.accessible.checked = false;
      item.radio.checked = false;
    });
    evt.currentTarget.checked = true;

    this._menuBar._bg.graphics.clear().beginFill(`${evt.currentTarget.bgColor}`).drawRect(0, 0, 800, 20);
    this._menuBar._menus.forEach((menu) => {
      menu._label.color = `${evt.currentTarget.textColor}`;
    });
  }

  _showRadioGroupAndProgressBarTestCase() {
    this._clearScreen();
    let submit;
    const PizzaCrustData = [
      {
        name: 'Pizza Crust', value: 'Regular Margherita', position: 1, size: 3,
      },
      {
        name: 'Pizza Crust', value: 'Mexican Green Wave', position: 2, size: 3,
      },
      {
        name: 'Pizza Crust', value: 'Veg Extravaganza', position: 3, size: 3,
      },
    ];

    const PizzaDeliveryData = [
      {
        name: 'Pizza Delivery', value: 'Pickup', position: 1, size: 2,
      },
      {
        name: 'Pizza Delivery', value: 'Home Delivery', position: 2, size: 2,
      },
    ];

    let count = 0;
    const onRadioSelect = () => {
      if (++count >= 2) {
        submit.enabled = true;
      }
    };

    const appendProgressBar = () => {
      this._clearScreen();
      const { width, height } = this._contentArea.getBounds();

      const label = new createjs.Text('Placing Order', 'bold 20px Arial', '#000');
      const percent = new createjs.Text('0%', 'bold 20px Arial', '#000');
      const percentLabelLeft = () => this._contentArea.x + (width - percent.getBounds().width) / 2;
      const onProgress = (now, state) => {
        percent.text = `${now}%`;
        percent.x = percentLabelLeft();
        percent.accessible.text = `${now}%`;
        if (state === 'completed') {
          label.text = 'Order placed successfully';
          label.accessible.text = label.text;
        }
      };


      const progressBar = new ProgressBar({ onProgress });

      label.x = this._contentArea.x + (width - progressBar.width) / 2;
      label.y = this._contentArea.y + (height - 24) / 2;
      this._contentArea.addChild(label);
      AccessibilityModule.register({
        displayObject: label,
        role: AccessibilityModule.ROLES.STATUS,
        accessibleOptions: {
          text: label.text,
        },
      });
      this._contentArea.accessible.addChild(label);

      progressBar.x = label.x;
      progressBar.y = label.y + 30;
      this._contentArea.addChild(progressBar);
      this._contentArea.accessible.addChild(progressBar);

      percent.x = percentLabelLeft();
      percent.y = progressBar.y + progressBar.height + 2;
      this._contentArea.addChild(percent);

      AccessibilityModule.register({
        displayObject: percent,
        parent: this._contentArea,
        role: AccessibilityModule.ROLES.NONE,
        accessibleOptions: {
          text: percent.text,
        },
      });

      progressBar.startProgress();
    };

    const title = new createjs.Text('Select the pizza and delivery type', 'bold 24px Arial', '#000');
    title.x = 50;
    title.y = 50;
    this._contentArea.addChild(title);
    AccessibilityModule.register({
      displayObject: title,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: title.text,
      },
    });

    const labelGroup1 = new createjs.Text('Pizza Crust', 'bold 24px Arial', '#000');
    this._contentArea.addChild(labelGroup1);
    AccessibilityModule.register({
      displayObject: labelGroup1,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: labelGroup1.text,
      },
    });

    const radioGroup1 = new RadioGroup({
      radioData: PizzaCrustData, name: 'Pizza Crust', callBack: _.once(onRadioSelect),
    });
    radioGroup1.x = 100;
    radioGroup1.y = 100;
    this._contentArea.addChild(radioGroup1);
    this._contentArea.accessible.addChild(radioGroup1);
    radioGroup1.accessible.labelledBy = labelGroup1;
    labelGroup1.y = radioGroup1.x;
    labelGroup1.x = radioGroup1.y;

    const labelGroup2 = new createjs.Text('Pizza Delivery', 'bold 24px Arial', '#000');
    this._contentArea.addChild(labelGroup2);
    AccessibilityModule.register({
      displayObject: labelGroup2,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: labelGroup2.text,
      },
    });

    const radioGroup2 = new RadioGroup({
      radioData: PizzaDeliveryData, name: 'Pizza Delivery', callBack: _.once(onRadioSelect),
    });
    radioGroup2.x = radioGroup1.x;
    radioGroup2.y = 300;
    this._contentArea.addChild(radioGroup2);
    this._contentArea.accessible.addChild(radioGroup2);
    radioGroup2.accessible.labelledBy = labelGroup2;
    labelGroup2.x = radioGroup2.x;
    labelGroup2.y = radioGroup2.y;


    const submitBtnData = {
      type: 'button',
      value: 'Place Order',
      name: 'SUBMIT',
      enabled: false,
      height: 60,
      width: 250,
    };

    // Submit form button
    submit = new Button(submitBtnData, 0, appendProgressBar);
    const { width } = labelGroup2.getBounds();
    submit.x = labelGroup2.x + (width - submit.getBounds().width) / 2;
    submit.y = 420;
    this._contentArea.addChild(submit);
    this._contentArea.accessible.addChild(submit);
  }

  _showFormTestCase() {
    this._clearScreen();

    // Creating form
    const form = new createjs.Container();
    form.x = 10;
    form.y = 10;
    AccessibilityModule.register({
      displayObject: form,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.FORM,
    });
    this._contentArea.addChild(form);

    // Implementing SINGLE LINE INPUT TEXT FIELD
    let label = new createjs.Text('Name', '14px Arial');
    label.x = 10;
    label.y = 100;
    AccessibilityModule.register({
      displayObject: label,
      parent: form,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: label.text,
      },
    });
    form.addChild(label);
    form.accessible.autoComplete = true;

    const nameField = new SingleLineTextInput(OPTION_WIDTH, OPTION_HEIGHT, 0);
    nameField.x = 160;
    nameField.y = 100;
    form.addChild(nameField);
    form.accessible.addChild(nameField);
    nameField.accessible.autoComplete = 'name';
    nameField.accessible.name = 'name';

    // Tooltip for field
    const nameFieldToolTip = new Tooltip({ target: nameField, content: 'Enter username', position: 'top' });
    form.addChild(nameFieldToolTip);
    form.accessible.addChild(nameFieldToolTip);

    // Button to clear field
    const clearField = () => {
      nameField._updateDisplayString('');
    };
    const clearNameFieldBtn = this._createClearButton('Clear name field', 0, clearField);
    form.addChild(clearNameFieldBtn);
    form.accessible.addChild(clearNameFieldBtn);

    clearNameFieldBtn.set({
      x: nameField.x + OPTION_WIDTH + 10,
      y: nameField.y,
    });

    let clearBtnToolTip = new Tooltip({ target: clearNameFieldBtn, content: 'Clear name field', position: 'top' });
    form.addChild(clearBtnToolTip);
    form.accessible.addChild(clearBtnToolTip);

    // Label for Address Field
    label = new createjs.Text('Address', '14px Arial');
    label.x = 160 + OPTION_WIDTH + 150;
    label.y = 100;
    AccessibilityModule.register({
      displayObject: label,
      parent: form,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: label.text,
      },
    });
    form.addChild(label);

    // Address Field
    const addressField = new SingleLineTextInput(OPTION_WIDTH, OPTION_HEIGHT, this._nextTab++);
    addressField.x = 160 + OPTION_WIDTH + 150 + 90;
    addressField.y = 100;
    addressField.accessible.name = 'address';
    addressField.accessible.autoComplete = 'off';
    form.addChild(addressField);
    form.accessible.addChild(addressField);

    // Tooltip for Address field
    const addressFieldToolTip = new Tooltip({ target: addressField, content: 'Enter address', position: 'top' });
    form.addChild(addressFieldToolTip);
    form.accessible.addChild(addressFieldToolTip);

    const clearAddressField = () => {
      addressField._updateDisplayString('');
    };
    const clearAddressFieldBtn = this._createClearButton('Clear address field', clearAddressField);
    form.addChild(clearAddressFieldBtn);
    form.accessible.addChild(clearAddressFieldBtn);

    clearAddressFieldBtn.set({
      x: addressField.x + OPTION_WIDTH + 10,
      y: addressField.y,
    });

    clearBtnToolTip = new Tooltip({ target: clearAddressFieldBtn, content: 'Clear address field', position: 'top' });
    form.addChild(clearBtnToolTip);
    form.accessible.addChild(clearBtnToolTip);

    // Implementing SINGLE SELECT LISTBOX field
    label = new createjs.Text('Membership Level', '14px Arial');
    label.x = 10;
    label.y = 120;
    AccessibilityModule.register({
      displayObject: label,
      parent: form,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: label.text,
      },
    });
    form.addChild(label);

    // Options
    let optionLabels = ['Free', 'Member', 'Premium'];
    let options = [];
    optionLabels.forEach((optionLabel) => {
      options.push(new Option(optionLabel, OPTION_WIDTH, OPTION_HEIGHT, true));
    });

    // List box
    const membershipList = new ListBox(options, OPTION_WIDTH, OPTION_HEIGHT, 0);
    const membershipOption = options;
    membershipList.x = 160;
    membershipList.y = 118;
    membershipList.accessible.labelledBy = label;
    form.addChild(membershipList);
    form.accessible.addChild(membershipList);

    // List box's tooltip
    const membershipListToolTip = new Tooltip({ target: membershipList, content: 'Select membership level' });
    form.addChild(membershipListToolTip);
    form.accessible.addChild(membershipListToolTip);

    // Label for Email field
    label = new createjs.Text('Email ID', '14px Arial');
    label.x = 160 + OPTION_WIDTH + 150;
    label.y = 118;
    AccessibilityModule.register({
      displayObject: label,
      parent: form,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: label.text,
      },
    });
    form.addChild(label);

    // Email Field
    const emailField = new SingleLineTextInput(OPTION_WIDTH, OPTION_HEIGHT, this._nextTab++);
    emailField.x = 160 + OPTION_WIDTH + 150 + 90;
    emailField.y = 118;
    emailField.accessible.name = 'email';
    form.addChild(emailField);
    form.accessible.addChild(emailField);

    // Tooltip for Email field
    const emailFieldToolTip = new Tooltip({ target: emailField, content: 'Enter email', position: 'bottom' });
    form.addChild(emailFieldToolTip);
    form.accessible.addChild(emailFieldToolTip);

    const clearEmailField = () => {
      emailField._updateDisplayString('');
    };
    const clearEmailFieldBtn = this._createClearButton('Clear address field', clearEmailField);
    form.addChild(clearEmailFieldBtn);
    form.accessible.addChild(clearEmailFieldBtn);

    clearEmailFieldBtn.set({
      x: emailField.x + OPTION_WIDTH + 10,
      y: emailField.y,
    });

    clearBtnToolTip = new Tooltip({ target: clearEmailFieldBtn, content: 'Clear email field', position: 'bottom' });
    form.addChild(clearBtnToolTip);
    form.accessible.addChild(clearBtnToolTip);

    label = new createjs.Text('Comments', '14px Arial');
    label.x = 10;
    label.y = 140;
    AccessibilityModule.register({
      displayObject: label,
      parent: form,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: label.text,
      },
    });
    form.addChild(label);

    // Implementing MULTI LINE TEXT BOX
    const commentArea = new MultiLineTextInput(OPTION_WIDTH,
      OPTION_HEIGHT * 5, 14, 0);
    commentArea.x = 160;
    commentArea.y = 140;
    form.addChild(commentArea);
    form.accessible.addChild(commentArea);
    commentArea.accessible.spellcheck = true;

    // Text box's tooltip
    const commentAreaToolTip = new Tooltip({ target: commentArea, content: 'Comment regarding membership' });
    form.addChild(commentAreaToolTip);
    form.accessible.addChild(commentAreaToolTip);

    // Button to clear area
    const clearArea = () => {
      commentArea._updateDisplayString('');
    };
    const clearCommentAreaBtn = this._createClearButton('Clear comment area', 0, clearArea);
    form.addChild(clearCommentAreaBtn);
    form.accessible.addChild(clearCommentAreaBtn);

    clearCommentAreaBtn.set({
      x: commentArea.x + OPTION_WIDTH + 10,
      y: commentArea.y + 70,
    });

    clearBtnToolTip = new Tooltip({ target: clearCommentAreaBtn, content: 'Clear comment area' });
    form.addChild(clearBtnToolTip);
    form.accessible.addChild(clearBtnToolTip);

    // Implementing MULTI SELECT LIST BOX
    label = new createjs.Text('Mailing Lists', '14px Arial');
    label.x = 10;
    label.y = 235;
    AccessibilityModule.register({
      displayObject: label,
      parent: form,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: label.text,
      },
    });
    form.addChild(label);

    // Options
    optionLabels = ['OpenGL', 'Direct3D12', 'Vulkan', 'Mantle', 'Metal', 'WebGL'];
    options = [];
    optionLabels.forEach((optionLabel) => {
      options.push(new Option(optionLabel, OPTION_WIDTH, OPTION_HEIGHT, false));
    });
    // Multi select list box
    const mailingList = new MultiListBox(options, OPTION_WIDTH, OPTION_HEIGHT, 0);
    mailingList.x = 160;
    mailingList.y = 233;
    mailingList.accessible.labelledBy = label;
    form.addChild(mailingList);
    form.accessible.addChild(mailingList);

    // Box's tooltip
    const mailingListToolTip = new Tooltip({ target: mailingList, content: 'Choose between mailing types' });
    form.addChild(mailingListToolTip);
    form.accessible.addChild(mailingListToolTip);

    // combobox example
    label = new createjs.Text('Primary interest', '14px Arial');
    label.x = 10;
    label.y = 352;
    AccessibilityModule.register({
      displayObject: label,
      parent: form,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: label.text,
      },
    });
    form.addChild(label);
    optionLabels = ['Graphics', 'Game Engines', 'AI', 'Pathfinding', 'Game Design'];
    options = _.map(optionLabels, optionLabel => new Option(optionLabel, OPTION_WIDTH, OPTION_HEIGHT, true)); // eslint-disable-line max-len
    const combobox = new ComboBox(options, OPTION_WIDTH, OPTION_HEIGHT, 0);
    combobox.x = 160;
    combobox.y = 350;
    form.addChild(combobox);
    form.accessible.addChild(combobox);

    // Alert when form gets submitted
    const alert = new createjs.Container();
    AccessibilityModule.register({
      displayObject: alert,
      parent: form,
      role: AccessibilityModule.ROLES.ALERT,
    });
    alert.set({ x: 640, y: 10 });
    form.addChild(alert);
    form.accessible.addChild(alert);
    // background
    const alertBg = new createjs.Shape();
    alertBg.graphics.beginFill('#000000').drawRoundRect(0, 0, 150, 30, 7);
    alert.addChild(alertBg);
    // Label
    const alertLabel = new createjs.Text('Form submitted', 'Bold 18px Arial', 'white');
    alertLabel.set({ x: 10, y: 6 });
    AccessibilityModule.register({
      displayObject: alertLabel,
      parent: alert,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: alertLabel.text,
      },
    });
    alert.accessible.addChild(alertLabel);
    alert.addChild(alertLabel);
    alert.visible = false;

    label = new createjs.Text('', '14px Arial');
    AccessibilityModule.register({
      displayObject: label,
      parent: form,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: label.text,
      },
    });
    form.addChild(label);
    form.accessible.addChild(label);

    // Implementing BUTTON
    const submitCallBack = () => {
      label.text = `NAME: ${nameField._text.text}, Comments: ${commentArea._text.text}, MEMBERSHIP: ${membershipList._selectedDisplay.text}, mailingList: ${mailingList.accessible.selectedValue}, primary interest: ${combobox.text}`;
      label.x = 10;
      label.y = 390;

      // Show alert
      alert.visible = true;
      const timeId = setTimeout(() => {
        alert.visible = false;
        clearTimeout(timeId);
      }, 1000);

      const frame = document.createElement('iframe');
      frame.setAttribute('id', 'hiddenFrame');
      frame.setAttribute('name', 'hiddenFrame');
      frame.style.display = 'none';

      const f = document.querySelector('form');
      f.append(frame);
      f.target = 'hiddenFrame';
      f.submit();
    };


    const resetAll = () => {
      label.text = '';
      form.accessible.removeChild(label);
      nameField._updateDisplayString('');
      nameField.onBlur();
      commentArea._updateDisplayString('');
      commentArea.onBlur();
      membershipList._updateSelectedOption(membershipOption[0]);
      mailingList.onBlur();
      mailingList._unhighlightAll();
      mailingList.accessible.selected = [];
      combobox.text = '';
      emailField._updateDisplayString('');
      emailField.onBlur();
      addressField._updateDisplayString('');
      addressField.onBlur();
    };

    const submitBtnData = {
      type: 'submit',
      value: 'SUBMIT',
      name: 'SUBMIT',
      enabled: true,
      autoFocus: false,
      // form: 'form_1',
      formAction: '',
      formMethod: 'GET',
      formTarget: '_blank',
      formnoValidate: '',
      height: 60,
      width: 250,
    };
    form.accessible.action = '';
    form.accessible.method = 'GET';

    // Submit form button
    const submit = new Button(submitBtnData, 0, submitCallBack);
    submit.x = 50;
    submit.y = 410;
    form.addChild(submit);
    form.accessible.addChild(submit);

    submit.setBounds(0, 0, 250, 60);
    const submitBtnToolTip = new Tooltip({ target: submit, content: 'Submit given data to the server', position: 'bottom' });
    form.addChild(submitBtnToolTip);
    form.accessible.addChild(submitBtnToolTip);

    const resetBtnData = {
      type: 'reset',
      value: 'RESET',
      name: 'RESET',
      enabled: true,
      autoFocus: false,
      form: 'form_1',
      formAction: '',
      formMethod: 'GET',
      formTarget: '_blank',
      formnoValidate: '',
      height: 60,
      width: 250,
    };
    let reset;

    function makeFormTabbable() {
      form.accessible.hidden = false;
      nameField.accessible.tabIndex = 0;
      clearNameFieldBtn.accessible.tabIndex = 0;
      membershipList.setTabbable(true);
      commentArea.accessible.tabIndex = 0;
      clearCommentAreaBtn.accessible.tabIndex = 0;
      mailingList.accessible.tabIndex = 0;
      combobox.setTabbable(true);
      submit.accessible.tabIndex = 0;
      reset.accessible.tabIndex = 0;
    }

    const alertDialog = new AlertDialog({
      buttonTabIndex: 0,
      cancelCallback: () => {
        alertDialog.visible = false;
        form.accessible.hidden = false;
        makeFormTabbable();
      },
      doneCallback: () => {
        resetAll();
        alertDialog.visible = false;
        form.accessible.hidden = false;
        makeFormTabbable();
      },
    });
    alertDialog.visible = false;
    this._contentArea.addChild(alertDialog);
    this._contentArea.accessible.addChild(alertDialog);

    const resetCallback = () => {
      alertDialog.visible = true;
      form.accessible.hidden = true;
      nameField.accessible.tabIndex = -1;
      clearNameFieldBtn.accessible.tabIndex = -1;
      membershipList.setTabbable(false);
      commentArea.accessible.tabIndex = -1;
      clearCommentAreaBtn.accessible.tabIndex = -1;
      mailingList.accessible.tabIndex = -1;
      combobox.setTabbable(false);
      submit.accessible.tabIndex = -1;
      reset.accessible.tabIndex = -1;
    };

    // Reset form button
    reset = new Button(resetBtnData, 0, resetCallback);
    reset.x = 400;
    reset.y = 410;
    form.addChild(reset);
    form.accessible.addChild(reset);

    reset.setBounds(0, 0, 250, 60);
    const resetBtnToolTip = new Tooltip({ target: reset, content: 'Reset all fields', position: 'bottom' });
    form.addChild(resetBtnToolTip);
    form.accessible.addChild(resetBtnToolTip);
  }

  _createClearButton(name, tabIndex, callBack) {
    const clearBtnData = {
      type: 'clear',
      value: '',
      name,
      enabled: true,
      autoFocus: false,
      form: 'form_1',
      formAction: '',
      formMethod: 'GET',
      formTarget: '_blank',
      formnoValidate: '',
      height: 20,
      width: 20,
      tabIndex,
    };

    const button = new Button(clearBtnData, 0, callBack);
    button.accessible.text = name;

    const shape = new createjs.Shape();
    shape.graphics.beginStroke('black').setStrokeStyle(2).arc(0, 0, 5, 0, 300 * (Math.PI / 180));
    shape.set({ x: 10, y: 10 });
    button.addChild(shape);

    button.setBounds(0, 0, 20, 20);
    return button;
  }

  _showLinkTestCase() {
    this._clearScreen();

    const document = new createjs.Container();
    AccessibilityModule.register({
      displayObject: document,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.DOCUMENT,
    });
    this._contentArea.addChild(document);

    const openingLine = new createjs.Text('There are multiple resources to learn about aria roles, WCAG, and Section 508 standards.', '16px Arial');
    openingLine.x = 50;
    openingLine.y = 50;
    AccessibilityModule.register({
      displayObject: openingLine,
      parent: document,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: openingLine.text,
      },
    });
    document.addChild(openingLine);

    let options = {
      href: 'https://www.w3.org/WAI/WCAG20/quickref/?currentsidebar=#col_customize&levels=aaa',
      text: "W3C's guide to meeting WCAG requirements",
    };
    const wcag = new Link(options);
    wcag.x = 50;
    wcag.y = 70;
    document.addChild(wcag);
    document.accessible.addChild(wcag);

    options = {
      href: 'https://www.w3.org/TR/wai-aria-1.1/',
      text: "W3C's general guide to Accessible Rich Internet Applications",
    };
    const aria = new Link(options);
    aria.x = 50;
    aria.y = 90;
    document.addChild(aria);
    document.accessible.addChild(aria);
    options = {
      href: 'https://www.w3.org/TR/html-aria/#allowed-aria-roles-states-and-properties',
      text: "W3C's guide to allowed ARIA roles, states, and properties",
    };
    const allowedAria = new Link(options);
    allowedAria.x = 50;
    allowedAria.y = 110;
    document.addChild(allowedAria);
    document.accessible.addChild(allowedAria);
  }

  _showCheckBoxTestCase() {
    this._clearScreen();

    let lasty = 0;
    let selectedCheckBoxes;
    let selected;

    const V_GAP = 60;
    const X = 50;
    const FONT = '20px Arial';

    const checkBoxArray = [];
    const labelArray = [
      'Golf',
      'Baseball',
      'Tennis',
      'Cricket',
      'Soccer',
    ];

    // Callback function to get current state of each checkbox in group
    const callBack = () => {
      selectedCheckBoxes = _.map(_.filter(checkBoxArray, box => box.checked === true), 'label');
      selected.text = selectedCheckBoxes.toString();
      selected.accessible.text = selected.text;
    };

    // Title
    const title = new createjs.Text('Select below sports to get an updates on respective one', FONT);
    title.set({ x: X, y: 50 });
    AccessibilityModule.register({
      displayObject: title,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.NONE,
    });
    this._contentArea.addChild(title);

    // Checkboxes with labels
    for (let i = 0; i < labelArray.length; i++) {
      // checkbox
      const checkBox = new CheckBox(25, 25, 0, callBack);
      checkBox.set({ x: X, y: (title.y + V_GAP) + (i * V_GAP) });
      const boxBounds = checkBox.getBounds();
      this._contentArea.addChild(checkBox);
      this._contentArea.accessible.addChild(checkBox);

      // label
      const label = new createjs.Text(`${labelArray[i]}`, FONT);
      this._contentArea.addChild(label);
      const labelBounds = label.getBounds();
      label.set({
        x: checkBox.x + boxBounds.width + 10,
        y: checkBox.y + (boxBounds.height - labelBounds.height) * 0.5,
      });

      AccessibilityModule.register({
        displayObject: label,
        parent: this._contentArea,
        role: AccessibilityModule.ROLES.NONE,
        accessibleOptions: {
          text: label.text,
        },
      });

      checkBox.label = label.text;
      checkBoxArray.push(checkBox);
      lasty = checkBox.y;
    }

    // Selected checkboxes
    const total = new createjs.Text('Selected Sports:', FONT);
    total.set({ x: X, y: lasty + V_GAP });
    this._contentArea.addChild(total);
    AccessibilityModule.register({
      displayObject: total,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: total.text,
      },
    });
    this._contentArea.accessible.addChild(total);

    selected = new createjs.Text('', FONT);
    selected.set({ x: X + total.getBounds().width + 10, y: lasty + V_GAP });
    this._contentArea.addChild(selected);
    AccessibilityModule.register({
      displayObject: selected,
      role: AccessibilityModule.ROLES.LOG,
      accessibleOptions: {
        text: selected.text,
      },
    });
    this._contentArea.accessible.addChild(selected);
  }

  _showDragAndDropTestCase() {
    this._clearScreen();

    const dragDataArr = ['red', 'green', 'blue'];
    const FONT = '20px Arial';
    const WIDTH = 100;
    const HEIGHT = 50;
    const dropArr = [];
    const dragArr = [];

    // Label
    const dragText = new createjs.Text('Put the draggables into their correct drop zones', FONT);
    dragText.set({ x: 50, y: 50 });
    this._contentArea.addChild(dragText);

    AccessibilityModule.register({
      displayObject: dragText,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: dragText.text,
      },
    });

    // Creating drop zones
    for (let i = 0; i < dragDataArr.length; i++) {
      const drop = new createjs.Shape();
      drop.graphics.beginFill(dragDataArr[i]).drawRect(0, 0, WIDTH, HEIGHT);

      drop.set({
        x: 50 + (i * (WIDTH + 20)),
        y: 400,
        alpha: 0.5,
        placed: false,
        label: dragDataArr[i],
      });
      drop.setBounds(0, 0, WIDTH, 50);

      drop.backgroundColor = dragDataArr[i];
      drop.opacity = 0.5;

      dropArr.push(drop);
    }

    // Creating draggables
    for (let i = 0; i < dragDataArr.length; i++) {
      const options = {
        type: 'button',
        value: dragDataArr[i],
        name: dragDataArr[i],
        enabled: true,
        autoFocus: false,
        width: WIDTH,
        height: HEIGHT,
      };

      // Container where draggable starts, for returning draggables to their start positions
      const dragStart = new createjs.Shape();
      dragStart.graphics.beginFill('grey').drawRect(0, 0, WIDTH, HEIGHT);

      dragStart.set({
        x: 50 + (i * (WIDTH + 20)),
        y: 100,
        alpha: 0,
      });
      dragStart.setBounds(0, 0, WIDTH, 50);

      AccessibilityModule.register({
        displayObject: dragStart,
        role: AccessibilityModule.ROLES.NONE,
      });
      this._contentArea.addChild(dragStart);
      this._contentArea.accessible.addChild(dragStart);

      // Interactive draggable
      const drag = new Draggable(options, dropArr, 0, _.noop, dragStart);
      drag.set({
        x: 50 + (i * (WIDTH + 20)),
        y: 100,
      });
      drag.origX = drag.x;
      drag.origY = drag.y;

      this._contentArea.addChild(drag);
      dragStart.accessible.addChild(drag);

      dragArr.push(drag);
      drag.button.addEventListener('focus', (evt) => {
        _.forEach(dragArr, draggable => draggable.toggleMenuVisibility(false));
        const { target } = evt;
        target._onFocus();
      });
    }

    // As per UI drop zones will get added after the draggables
    _.forEach(dropArr, (drop, i) => {
      AccessibilityModule.register({
        displayObject: drop,
        role: AccessibilityModule.ROLES.NONE,
      });
      drop.accessible.dropEffects = 'move';
      drop.accessible.label = `${dragDataArr[i]} drop target`;
      this._contentArea.addChild(drop);
      this._contentArea.accessible.addChild(drop);
    });
  }

  _showAboutDialog() {
    const clearBtnData = {
      type: 'button',
      value: 'x',
      name: 'close dialog',
      enabled: true,
      height: 25,
      width: 25,
    };

    const parentContainer = new createjs.Container();
    const rect = new createjs.Shape();
    rect.graphics.beginStroke('#ccc').setStrokeStyle(1).beginFill('#000').drawRect(0, 0, 800, 600);
    parentContainer.addChild(rect);
    this._contentArea.addChild(parentContainer);
    AccessibilityModule.register({
      displayObject: parentContainer,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.NONE,
    });

    const dialog = new Dialog(clearBtnData, 600, 400, -1);
    parentContainer.addChild(dialog);
    parentContainer.accessible.addChild(dialog);
    dialog.visible = true;
    dialog.x = 100;
    dialog.y = 100;
    this._menuBar._closeMenus();
  }

  _showListTestCase() {
    this._clearScreen();
    const directory = new createjs.Container();

    const testDisplayObject = new createjs.Text('We have developed a basic workflow for creating these different role objects', '16px Arial');
    testDisplayObject.x = 50;
    testDisplayObject.y = 50;
    AccessibilityModule.register({
      displayObject: testDisplayObject,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: testDisplayObject.text,
      },
    });
    this._contentArea.addChild(testDisplayObject);

    const listItems = [];
    const options = { text: 'src/Roles.js - look at the roles enum, may have to break apart the aria roles as needed' };
    listItems.push(new ListItem(options));
    options.text = 'src/Roles.js - go to ROLE_TAG_MAPPING so that the Roles enum value gets converted to an html tag';
    listItems.push(new ListItem(options));
    options.text = 'https://www.w3.org/TR/wai-aria/roles && https://www.w3.org/TR/wai-aria/rdf_model.png - go and check\n'
      + "if there are new aria attributes that are going to be added to your new object (that aren't covered in a\n"
      + 'parent object) from the aria attribute page (link 1) and the flowchart (link 2), and look at the html tag\n'
      + 'page and pick and choose the necessary properties that pertain to how the object will be used and add\nthem in';
    listItems.push(new ListItem(options));
    options.text = 'src/RolesObjects - create the new object, usually have to extend the accessibility object but that\n'
      + "may be sufficient in the rare case. if the accessibility object is sufficient, you're done.";
    listItems.push(new ListItem(options));
    options.text = 'src/RoleObjectFactory.js - actually instantiate your new object in the switch statement';
    listItems.push(new ListItem(options));
    options.text = 'src/test/widgets - add a test case .js file for your new object';
    listItems.push(new ListItem(options));
    options.text = 'src/test/widgets/AppWindow.js - add your new object to the actual app window code';
    listItems.push(new ListItem(options));

    const orderedList = new OrderedList({ type: '1', start: '1', reversed: false });
    orderedList.x = 50;
    orderedList.y = 80;
    let y = 0;
    for (let i = 0; i < listItems.length; i++) {
      orderedList.addListItem(listItems[i], y, i);

      if (i === 2) { y += 60; }
      if (i === 3) { y += 15; }
      y += 20;
    }

    this._contentArea.addChild(directory);
    AccessibilityModule.register({
      displayObject: directory,
      parent: this._contentArea,
      role: AccessibilityModule.ROLES.DIRECTORY,
    });
    directory.addChild(orderedList);
    directory.accessible.addChild(orderedList);
  }

  _showArticleTestCase() {
    this._clearScreen();

    const openingParagraph = new createjs.Text(
      'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and\n'
      + 'nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the\n'
      + 'world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing\n'
      + 'grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily\n'
      + 'pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever\n'
      + 'my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from\n'
      + "deliberately stepping into the street, and methodically knocking people's hats off—then, I account it high time\n"
      + 'to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato\n'
      + 'throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it,\n'
      + 'almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean\nwith me.', '16px Arial',
    );

    const secondParagraph = new createjs.Text(
      'There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral\n'
      + 'reefs—commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme\n'
      + 'downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours\n'
      + 'previous were out of sight of land. Look at the crowds of water-gazers there.', '16px Arial',
    );

    const quoteInfo = new createjs.Text('The above quotes are from "Moby Dick (Chap. 1: Loomings) by Herman Melville".', 'bold 16px Arial');

    AccessibilityModule.register([
      {
        displayObject: openingParagraph,
        role: AccessibilityModule.ROLES.NONE,
        accessibleOptions: {
          text: openingParagraph.text,
        },
      },
      {
        displayObject: secondParagraph,
        role: AccessibilityModule.ROLES.NONE,
        accessibleOptions: {
          text: secondParagraph.text,
        },
      },
      {
        displayObject: quoteInfo,
        role: AccessibilityModule.ROLES.NOTE,
        accessibleOptions: {
          text: quoteInfo.text,
        },
      },
    ]);

    const article = new Article();
    article.x = 10;
    article.y = 50;
    article.addSection(openingParagraph);
    article.addSection(secondParagraph);
    article.addSection(quoteInfo);

    this._contentArea.addChild(article);
    this._contentArea.accessible.addChild(article);

    const complementary = new createjs.Container();
    this._contentArea.addChild(complementary);
    AccessibilityModule.register({
      displayObject: complementary,
      role: AccessibilityModule.ROLES.COMPEMENTARY,
    });
    this._contentArea.accessible.addChild(complementary);

    const sumaryText = 'SUMMARY: \n'
                        + 'Ishmael explains that, whenever he feels depressed and suicidal, he always goes to sea.\n'
                        + 'Ishmael claims that most people and most cultures around the world have a special attraction \n'
                        + 'to water in general and the sea in particular.';
    const summary = new createjs.Text(sumaryText, '16px Arial');
    AccessibilityModule.register({
      displayObject: summary,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: summary.text,
      },
    });

    complementary.addChild(summary);
    complementary.accessible.addChild(summary);

    complementary.x = article.x;
    complementary.y = article.y + article.getBounds().height + 10;

    const loop = -1; // Sets the number of times the marquee will scroll.
    // If no value is specified, the default value is −1, which means
    // the marquee will scroll continuously.
    const direction = 'right'; // left, right, up and down
    const behaviour = 'scroll'; // scroll, slide and alternate
    const text = 'Moby Dick (1956 film) Release date June 27, 1956 in the United States';
    const marquee = new Marquee({
      text, behaviour, direction, loop,
    });
    this._contentArea.addChild(marquee);
    this._contentArea.accessible.addChild(marquee);
  }

  _showTabListWithPanelCase() {
    this._clearScreen();

    const region = new createjs.Container();
    this._contentArea.addChild(region);
    AccessibilityModule.register({
      displayObject: region,
      role: AccessibilityModule.ROLES.REGION,
    });
    this._contentArea.accessible.addChild(region);

    const heading = new createjs.Text('Descriptions of planets using tab widgets', 'bold 18px Arial', '#000');
    region.addChild(heading);
    AccessibilityModule.register({
      displayObject: heading,
      role: AccessibilityModule.ROLES.HEADING3,
      accessibleOptions: {
        text: heading.text,
      },
    });
    region.accessible.addChild(heading);
    region.accessible.labelledBy = heading;
    heading.x = 0;
    heading.y = 20;
    heading.lineWidth = 800;

    const directory = new createjs.Container();
    region.addChild(directory);
    AccessibilityModule.register({
      displayObject: directory,
      role: AccessibilityModule.ROLES.DIRECTORY,
    });
    region.accessible.addChild(directory);
    directory.y = 100;
    directory.setBounds(0, 0, 200, 600);

    const earth = {
      tabListArr: [
        {
          name: 'Earth Info',
          value: 'Earth Info',
          width: 200,
          height: 50,
          position: 1,
          size: 3,
          data: {
            link: {
              href: 'https://en.wikipedia.org/wiki/Earth',
              text: 'Earth wikipedia reference',
            },
            description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life. According to radiometric dating and other\n'
                           + "sources of evidence, Earth formed over 4.5 billion years ago.[24][25][26] Earth's gravity interacts with other objects in space,  \n"
                           + "especially the Sun and the Moon, Earth's only natural satellite. Earth revolves around the Sun in 365.26 days, a period known as  \n"
                           + 'an Earth year. During this time, Earth rotates about its axis about 366.26 times',
          },
        },
        {
          name: 'Orbit',
          value: 'Orbit ',
          width: 200,
          height: 50,
          position: 2,
          size: 3,
          data: {
            link: {
              href: 'https://en.wikipedia.org/wiki/Earth#Orbit_and_rotation',
              text: 'Earth Orbit',
            },
            description: "Earth's rotation period relative to the Sun—its mean solar day—is 86,400 seconds of mean solar time (86,400.0025 SI seconds). \n"
                            + "[182] Because Earth's solar day is now slightly longer than it was during the 19th century due to tidal deceleration,  \n"
                            + 'each day varies between 0 and 2 SI ms longe',
          },
        },
        {
          name: 'Rotation',
          value: 'Rotation',
          width: 200,
          height: 50,
          position: 3,
          size: 3,
          data: {
            link: {
              href: 'https://en.wikipedia.org/wiki/Earth#Orbit_and_rotation',
              text: 'Earth Rotation',
            },
            description: 'Earth orbits the Sun at an average distance of about 150 million km (93 million mi) every 365.2564 mean solar days, or one sidereal \n'
                           + 'year. This gives an apparent movement of the Sun eastward with respect to the stars at a rate of about 1°/day, which is one \n'
                           + 'apparent Sun or Moon diameter every 12 hours. Due to this motion, on average it takes 24 hours—a solar day—for Earth to complete \n'
                           + 'a full rotation about its axis so that the Sun returns to the meridian. The orbital speed of Earth averages about 29.78 km/s \n'
                           + "(107,200 km/h; 66,600 mph), which is fast enough to travel a distance equal to Earth's diameter, about 12,742 km (7,918 mi),\n"
                           + 'in seven minutes, and the distance to the Moon, 384,000 km (239,000 mi), in about 3.5 hours.[3]',
          },
        },
      ],
      buttonData: {
        type: 'button',
        value: 'Earth',
        name: 'Earth',
        enabled: true,
        height: 60,
        width: 150,
      },
    };

    const moon = {
      tabListArr: [
        {
          name: 'Moon Info',
          value: 'Moon Info',
          width: 200,
          height: 50,
          position: 1,
          size: 3,
          data: {
            link: {
              href: 'https://en.wikipedia.org/wiki/Moon',
              text: 'Moon Wikipedia reference',
            },
            description: "The Moon is an astronomical body that orbits planet Earth and is Earth's only permanent natural satellite. It is the fifth-largest natural \n"
                            + 'satellite in the Solar System, and the largest among planetary satellites relative to the size of the planet that it orbits (its primary).  \n'
                            + "The Moon is after Jupiter's satellite Io the second-densest satellite in the Solar System among those whose densities are known.",

          },
        },
        {
          name: 'Orbit',
          value: 'Orbit',
          width: 200,
          height: 50,
          position: 2,
          size: 3,
          data: {
            link: {
              href: 'https://en.wikipedia.org/wiki/Moon#Orbit',
              text: 'Moon Orbit',
            },
            description: 'The Moon makes a complete orbit around Earth with respect to the fixed stars about once every 27.3 days[g] (its sidereal period). \n'
                           + 'However, because Earth is moving in its orbit around the Sun at the same time, it takes slightly longer for the Moon to show the \n'
                           + 'same phase to Earth, which is about 29.5 days[h] (its synodic period).[66] Unlike most satellites of other planets, the Moon orbits \n'
                           + "closer to the ecliptic plane than to the planet's equatorial plane. The Moon's orbit is subtly perturbed by the Sun and Earth in many \n"
                           + "small, complex and interacting ways. For example, the plane of the Moon's orbit gradually rotates once every 18.61[131] years, which \n"
                           + 'affects other aspects of lunar motion. ',
          },
        },
        {
          name: 'Rotation',
          value: 'Rotation',
          width: 200,
          height: 50,
          position: 3,
          size: 3,
          data: {
            link: {
              href: 'https://en.wikipedia.org/wiki/Moon',
              text: 'Moon Rotation',
            },
            description: 'The Moon is in synchronous rotation with Earth, and thus always shows the same side to Earth, the near side. The near side is \n'
                            + 'marked by dark volcanic maria that fill the spaces between the bright ancient crustal highlands and the prominent impact craters. After the\n'
                            + "Sun, the Moon is the second-brightest regularly visible celestial object in Earth's sky. Its surface is actually dark, although compared\n"
                            + 'to the night sky it appears very bright, with a reflectance just slightly higher than that of worn asphalt. Its gravitational influence \n'
                            + 'produces the ocean tides, body tides, and the slight lengthening of the day.',
          },
        },
      ],
      buttonData: {
        type: 'button',
        value: 'Moon',
        name: 'Moon',
        enabled: true,
        height: 60,
        width: 150,
      },
    };

    const mars = {
      tabListArr: [
        {
          name: 'Mars Info',
          value: 'Mars Info',
          width: 200,
          height: 50,
          position: 1,
          size: 3,
          data: {
            link: {
              href: 'https://en.wikipedia.org/wiki/Mars',
              text: 'Mars Wikipedia reference',
            },
            description: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System after Mercury. In English, Mars carries\n'
                            + "a name of  the Roman god of war, and is often referred to as the 'Red Planet' because the reddish iron oxide prevalent on its surface \n"
                            + 'gives it a reddish appearance that is distinctive among the astronomical bodies visible to the naked eye.[17] Mars is a terrestrial\n'
                            + 'planet with a thin atmosphere, having surface features reminiscent both of the impact craters of the Moon and the valleys, deserts,\n'
                            + 'and polar ice caps of Earth.',
          },
        },
        {
          name: 'Orbit',
          value: 'Orbit',
          width: 200,
          height: 50,
          position: 2,
          size: 3,
          data: {
            link: {
              href: 'https://en.wikipedia.org/wiki/Mars#Orbit_and_rotation',
              text: 'Mars Orbit',
            },
            description: "Mars is about 230 million km (143 million mi) from the Sun; its orbital period is 687 (Earth) days, depicted in red. Earth's orbit is in blue.\n"
                           + "Mars's average distance from the Sun is roughly 230 million km (143 million mi), and its orbital period is 687 (Earth) days. The solar day \n"
                           + '(or sol) on Mars is only slightly longer than an Earth day: 24 hours, 39 minutes, and 35.244 seconds.[179] A Martian year is equal to\n'
                           + '1.8809 Earth years, or 1 year, 320 days, and 18.2 hours The axial tilt of Mars is 25.19 degrees relative to its orbital plane, which \n'
                           + 'is similar to the axial tilt of Earth.',
          },
        },
        {
          name: 'Rotation',
          value: 'Rotation',
          width: 200,
          height: 50,
          position: 3,
          size: 3,
          data: {
            link: {
              href: 'https://en.wikipedia.org/wiki/Mars#Orbit_and_rotation',
              text: 'Mars Rotation',
            },
            description: 'Mars has a relatively pronounced orbital eccentricity of about 0.09; of the seven other planets in the Solar System, only Mercury has a \n'
                            + 'larger orbital eccentricity. It is known that in the past, Mars has had a much more circular orbit. At one point, 1.35 million Earth years ago,\n'
                            + "Mars had an eccentricity of roughly 0.002, much less than that of Earth today.[180] Mars's cycle of eccentricity is 96,000 Earth years\n"
                            + "compared to Earth's cycle of 100,000 years.[181] Mars has a much longer cycle of eccentricity, with a period of 2.2 million Earth years, \n"
                            + 'and this overshadows the 96,000-year cycle in the eccentricity graphs. For the last 35,000 years, the orbit of Mars has been getting\n'
                            + 'slightly more eccentric because of the gravitational effects of the other planets. The closest distance between Earth and Mars will \n'
                            + 'continue to mildly decrease for the next 25,000 years',
          },
        },
      ],
      buttonData: {
        type: 'button',
        value: 'Mars',
        name: 'Mars',
        enabled: true,
        height: 60,
        width: 150,
      },
    };

    const planetsData = [earth, moon, mars];
    const tabArr = ['Information', 'Orbit', 'Rotation'];
    const ITEM_PADDING = 100;
    this.planetBtnArry = [];
    let tabPanel = null;
    _.forEach(planetsData, (planet, index) => {
      const planetClick = () => {
        _.forEach(this.planetBtnArry, (planetBtn) => {
          planetBtn.accessible.pressed = false;
        });
        this.planetBtnArry[index].accessible.pressed = true;
        this.selectedPlanetIndex = index;
        const currentData = this.planetBtnArry[this.selectedPlanetIndex].tabListArr[0].data;
        tabPanel.description.text = currentData.description;
        tabPanel.description.accessible.text = currentData.description;
        tabPanel.dataLink._text.text = currentData.link.text;
        tabPanel.dataLink.accessible.text = currentData.link.text;
        tabPanel.dataLink.href = currentData.link.href;
        tabPanel.dataLink.accessible.href = currentData.link.href;
      };

      const planetBtn = new Button(planet.buttonData, 0, planetClick);
      directory.addChild(planetBtn);
      directory.accessible.addChild(planetBtn);
      this.planetBtnArry.push(planetBtn);
      const bounds = planetBtn.getBounds();
      planetBtn.tabListArr = planet.tabListArr;
      planetBtn.pressed = false;
      planetBtn.y = planetBtn.y + bounds.height + index * ITEM_PADDING;
    });

    const tabList = new TabList(800, 60, 'horizontal');
    region.addChild(tabList);
    region.accessible.addChild(tabList);
    tabList.x = 170;
    tabList.y = 70;

    _.forEach(tabArr, (tabData, index) => {
      const _showTabPanel = () => {
        const currentData = this.planetBtnArry[this.selectedPlanetIndex].tabListArr[index].data;
        tabPanel.description.text = currentData.description;
        tabPanel.description.accessible.text = currentData.description;
        tabPanel.dataLink._text.text = currentData.link.text;
        tabPanel.dataLink.accessible.text = currentData.link.text;
        tabPanel.dataLink.href = currentData.link.href;
        tabPanel.dataLink.accessible.href = currentData.link.href;
      };
      const tab = new Tab({
        name: tabData,
        value: tabData,
        width: 200,
        height: 50,
        position: index,
        size: tabArr.length,
        tabIndex: 0,
        callback: _showTabPanel,
      });
      tabList.addTab(tab);
    });

    tabPanel = new TabPanel(604, 400);
    region.addChild(tabPanel);
    region.accessible.addChild(tabPanel);
    tabPanel.x = tabList.x + 2;
    tabPanel.y = tabList.y;

    const firstData = this.planetBtnArry[0].tabListArr[0].data;
    const linkData = {
      href: `${firstData.link.href}`,
      text: `${firstData.link.text}`,
    };
    const dataLink = new Link(linkData);
    tabPanel.addChild(dataLink);
    tabPanel.accessible.addChild(dataLink);
    tabPanel.dataLink = dataLink;
    dataLink.x = 10;
    dataLink.y = 100;

    const description = new createjs.Text(`${firstData.description}`, '18px Arial');
    tabPanel.addChild(description);
    AccessibilityModule.register({
      displayObject: description,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: description.text,
      },
    });
    tabPanel.accessible.addChild(description);
    tabPanel.description = description;
    tabPanel.description.lineWidth = 550;
    description.x = 10;
    description.y = 150;
    this.selectedPlanetIndex = 0;
  }

  _showFeedTestCase() {
    this._clearScreen();

    const feed = new Feed(780, 600);
    this._contentArea.addChild(feed);
    this._contentArea.accessible.addChild(feed);

    const openingParagraph = new createjs.Text(
      'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and\n'
         + 'nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the\n'
         + 'world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing\n'
         + 'grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily\n'
         + 'pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever\n'
         + 'my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from\n'
         + "deliberately stepping into the street, and methodically knocking people's hats off—then, I account it high time\n"
         + 'to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato\n'
         + 'throws himself upon his sword; I quietly take to the ship.', '16px Arial',
    );
    AccessibilityModule.register({
      displayObject: openingParagraph,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: openingParagraph.text,
      },
    });

    const reference1 = new createjs.Text('The above quotes are from "Moby Dick (Chap. 1: Loomings) by Herman Melville".', 'bold 16px Arial');
    AccessibilityModule.register({
      displayObject: reference1,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: reference1.text,
      },
    });

    const secondParagraph = new createjs.Text(
      'All day long we seemed to dawdle through a country which was full of beauty of every kind. Sometimes we \n'
         + 'saw little towns or castles on the top of steep hills such as we see in old missals; sometimes we ran by rivers \n'
         + 'and streams which seemed from the wide stony margin on each side of them to be subject to great floods.\n'
         + 'It takes  a lot of water, and running strong, to sweep the outside edge of a river clear. At every station \n'
         + 'there were groups of people, sometimes crowds, and in all sorts of attire.', '16px Arial',
    );
    AccessibilityModule.register({
      displayObject: secondParagraph,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: secondParagraph.text,
      },
    });

    const reference2 = new createjs.Text('The above quotes are from "DRACULA (Chap. I: JONATHAN HARKER’S JOURNAL) by Bram Stoker".', 'bold 16px Arial');
    AccessibilityModule.register({
      displayObject: reference2,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: reference2.text,
      },
    });

    const thirdParagraph = new createjs.Text(
      'On Greenhaven, everything had evidently been done the hard way. She had heard about that facet of the\n'
         + 'Greenie character before leaving the ship, and she now wished that she had listened more carefully. It \n'
         + 'was difficult to picture in her mind just how far away that spaceship was by this time.', '16px Arial',
    );
    AccessibilityModule.register({
      displayObject: thirdParagraph,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: thirdParagraph.text,
      },
    });

    const reference3 = new createjs.Text(' The above quotes are from "D-99 a science-fiction novel (CHAPTER SIX) by H. B. FYFE".', 'bold 16px Arial');
    AccessibilityModule.register({
      displayObject: reference3,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: reference3.text,
      },
    });

    let article = new Article({ position: 1, size: 3 });
    article.x = 10;
    article.y = 0;
    article.addSection(openingParagraph);
    article.addSection(reference1);
    feed.addArticls(article);
    feed.accessible.addChild(article);

    article = new Article({ position: 2, size: 3 });
    article.x = 10;
    article.addSection(secondParagraph);
    article.addSection(reference2);
    feed.addArticls(article);
    feed.accessible.addChild(article);

    article = new Article({ position: 3, size: 3 });
    article.x = 10;
    article.y = 200;
    article.addSection(thirdParagraph);
    article.addSection(reference3);
    feed.addArticls(article);
    feed.accessible.addChild(article);
    openingParagraph.lineWidth = 790;
    secondParagraph.lineWidth = 790;
    thirdParagraph.lineWidth = 790;

    const { width, height } = feed.getBounds();
    const holderWidth = width;
    const holderHeight = height * 0.5;

    const feedHolder = new createjs.Container();
    feedHolder.setBounds(0, 0, holderWidth, holderHeight);
    AccessibilityModule.register({
      displayObject: feedHolder,
      role: AccessibilityModule.ROLES.NONE,
    });

    feedHolder.addChild(feed);
    feedHolder.accessible.addChild(feed);

    // Center align on stage
    const contentAreaBounds = this._contentArea.getBounds();
    feedHolder.set({
      x: (contentAreaBounds.width - holderWidth) * 0.5,
      y: (contentAreaBounds.height - holderHeight) * 0.3,
    });

    const scrollBar = new ScrollBar(feedHolder, 0);
    scrollBar.x = feedHolder.x + holderWidth - scrollBar.getBounds().width;
    scrollBar.y = feedHolder.y;

    this._contentArea.addChild(feedHolder);
    this._contentArea.accessible.addChild(feedHolder);
    this._contentArea.addChild(scrollBar);
    this._contentArea.accessible.addChild(scrollBar);
  }


  _showSliderTestCase() {
    this._clearScreen();

    const shapeObject = new createjs.Shape();
    shapeObject.graphics.drawRect(0, 0, 200, 200);
    shapeObject.graphics.endFill();
    shapeObject.setBounds(0, 0, 200, 200);
    shapeObject.set({ x: 350, y: 150 });
    this._contentArea.addChild(shapeObject);

    const toolBar = new ToolBar(500, 20);
    this._contentArea.addChild(toolBar);
    this._contentArea.accessible.addChild(toolBar);
    toolBar.y = 20;
    const ColorEditorBtnData = {
      type: 'button',
      value: 'Color-Editor',
      name: 'Color-Editor',
      enabled: true,
      height: 50,
      width: 125,
    };

    const _showColorEditor = () => {
      this.transformControlContainer.visible = false;
      this.alphaControlContainer.visible = false;
      this._showColorSliderTool = true;
      this.colorSliderContainer.visible = this._showColorSliderTool;
    };

    // colorEditor button
    const colorEditor = new Button(ColorEditorBtnData, 0, _showColorEditor);
    colorEditor.text.font = 'bold 14px Arial';
    toolBar.addTool(colorEditor);

    const transformControlBtnData = {
      type: 'button',
      value: 'Transformation',
      name: 'Transformation',
      enabled: true,
      height: 50,
      width: 125,
    };

    this.transformControlContainer = new createjs.Container();
    this._contentArea.addChild(this.transformControlContainer);
    AccessibilityModule.register({
      displayObject: this.transformControlContainer,
      role: AccessibilityModule.ROLES.NONE,
    });
    this._contentArea.accessible.addChild(this.transformControlContainer);
    this.transformControlContainer.visible = false;
    this.transformControlContainer.y = toolBar.y + 50;
    this._showTransformControl = false;
    this._addTrasformationTestCase(shapeObject);
    const _showTransformTool = () => {
      this.transformControlContainer.visible = !this._showTransformControl;
      this.alphaControlContainer.visible = false;
      this.colorSliderContainer.visible = false;
    };
    const transformControl = new Button(transformControlBtnData,
      0, _showTransformTool);
    transformControl.text.font = 'bold 14px Arial';
    toolBar.addTool(transformControl);
    const alphaControlBtnData = {
      type: 'button',
      value: 'Alpha',
      name: 'Alpha',
      enabled: true,
      height: 50,
      width: 125,
    };
    this.alphaControlContainer = new createjs.Container();
    this._contentArea.addChild(this.alphaControlContainer);
    AccessibilityModule.register({
      displayObject: this.alphaControlContainer,
      role: AccessibilityModule.ROLES.NONE,
    });
    this._contentArea.accessible.addChild(this.alphaControlContainer);
    this.alphaControlContainer.visible = false;
    this._showAlphaTool = false;
    const _showAlphaTool = () => {
      this.alphaControlContainer.visible = !this._showAlphaTool;
      this.transformControlContainer.visible = false;
      this.colorSliderContainer.visible = false;
    };
    const alphaControl = new Button(alphaControlBtnData, 0, _showAlphaTool);
    alphaControl.text.font = 'bold 16px Arial';
    toolBar.addTool(alphaControl);
    alphaControl.addEventListener('click', _showAlphaTool);

    const sliderData = [
      {
        label: 'Red',
        min: 0,
        max: 255,
        step: 1,
        value: 60,
        rgb: 'rgb(255,0,0)',
      },
      {
        label: 'Green',
        min: 0,
        max: 255,
        step: 1,
        value: 125,
        rgb: 'rgb(0,255,0)',
      },
      {
        label: 'Blue',
        min: 0,
        max: 255,
        step: 1,
        value: 226,
        rgb: 'rgb(0,0,255)',
      },
    ];

    this.colorSliderContainer = new createjs.Container();
    this._contentArea.addChild(this.colorSliderContainer);
    AccessibilityModule.register({
      displayObject: this.colorSliderContainer,
      role: AccessibilityModule.ROLES.NONE,
    });
    this._contentArea.accessible.addChild(this.colorSliderContainer);
    this.colorSliderContainer.visible = false;
    this._showColorSliderTool = false;

    const sliderArray = [];
    let color = '';
    this.alphaVal = 0.5;
    const label = new createjs.Text('Toggle Alpha', 'bold 18px Arial');
    label.x = 350;
    label.y = 100;
    this.alphaControlContainer.addChild(label);
    AccessibilityModule.register({
      displayObject: label,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: label.text,
      },
    });
    this.alphaControlContainer.accessible.addChild(label);
    const callBack = () => {
      const redVal = sliderArray[0].valueNow;
      const greenVal = sliderArray[1].valueNow;
      const blueVal = sliderArray[2].valueNow;
      color = `rgba(${redVal}, ${greenVal}, ${blueVal}, ${this.alphaVal})`;
      shapeObject.graphics.clear().beginFill(color).drawRect(0, 0, 200, 200).endFill();
    };
    const switchCallBack = (val) => {
      this.alphaVal = val ? 1 : 0.5;
      callBack();
    };
    const switchBtn = new Switch(90, 45, 0, switchCallBack);
    switchBtn.set({ x: 475, y: 90 });
    this.alphaControlContainer.addChild(switchBtn);

    this.alphaControlContainer.accessible.addChild(switchBtn);
    switchBtn.accessible.labelledBy = label;

    for (let i = 0; i < sliderData.length; i++) {
      const name = sliderData[i].label;
      const {
        min, max, step, value,
      } = sliderData[i];
      const labelValue = new createjs.Text(`${name}`, '14px Arial', `${sliderData[i].rgb}`);
      this.colorSliderContainer.addChild(labelValue);
      AccessibilityModule.register({
        displayObject: labelValue,
        role: AccessibilityModule.ROLES.NONE,
        accessibleOptions: {
          text: labelValue.text,
        },
      });
      this.colorSliderContainer.accessible.addChild(labelValue);

      const slider = new Slider(min, max, 200, 50, 'horizontal', step, value, 0, callBack);
      slider.set({ x: 100, y: i === 0 ? 200 : 200 + (i * 50) });
      const sliderBounds = slider.getBounds();
      this.colorSliderContainer.addChild(slider);
      this.colorSliderContainer.accessible.addChild(slider);

      const labelBounds = labelValue.getBounds();
      labelValue.set({
        x: slider.x - 50,
        y: slider.y + (sliderBounds.height - labelBounds.height) * 0.5,
      });

      slider.label = labelValue.text;
      sliderArray.push(slider);
    }

    callBack();
  }

  _showSearchTestCase() {
    this._clearScreen();

    const bulletList = [
      'The Western States and Provinces of North America thrive on our “thousand-pounders” and “remittance-men.',
      'Students have come here from Mexico, Argentine, and even from Japan, sent by their respective countries.',
      'Guelph has two Volunteer Artillery companies, one filled with students from the college, and one with town boys, four guns to each battery.',
      'Calgary is a beautiful place on the slope of the foothills, at an elevation of about 3400 feet, rather cold in winter, but delightful in the summer and fall.',
      'In Montana, Indian Territory, and Texas, great roping contests are organised every year, and cow-punchers flock from all over the United States and Canada.',
      'Manitoba is not all prairie, nor timberless, as so many 36people imagine.',
      'Chicago, which lays claim to having the largest in everything, whether it be drainage canals, skyscrapers, slaughter-houses, or the amount of railroad traffic, is certainly a wonderful city.',
      'The fall and winter of 1893 were exceptional',
      'The Nueces River is so called from the immense quantities of pecan trees which line both banks from the head to the mouth',
    ];

    const listObjectArr = [];

    // Making bullet list in canvas
    bulletList.forEach((sentence) => {
      // Text
      const textObj = new createjs.Text().set({
        text: sentence,
        font: '18px Arial',
        lineWidth: 700,
      });

      listObjectArr.push(textObj);

      this._contentArea.addChild(textObj);
      AccessibilityModule.register({
        displayObject: textObj,
        parent: this._contentArea,
        role: AccessibilityModule.ROLES.NONE,
        accessibleOptions: {
          text: textObj.text,
        },
      });

      // Bullets
      const bullet = new createjs.Shape();
      bullet.graphics.beginFill('black').drawCircle(0, 0, 5);
      this._contentArea.addChild(bullet);

      textObj.bullet = bullet;
    });

    listObjectArr[0].set({ x: 62, y: 50 });
    listObjectArr[0].bullet.set({ x: listObjectArr[0].x - 12, y: listObjectArr[0].y + 12 });

    for (let i = 1; i < listObjectArr.length; i++) {
      const preText = listObjectArr[i - 1];
      const preTextHeight = preText.getBounds().height;

      listObjectArr[i].set({ x: listObjectArr[0].x, y: preText.y + preTextHeight + 20 });

      listObjectArr[i].bullet.set({ x: listObjectArr[i].x - 12, y: listObjectArr[i].y + 12 });
    }

    // Search
    const options = {
      width: OPTION_WIDTH + 300,
      height: OPTION_HEIGHT + 10,
      listArr: listObjectArr,
      buttonOptions: {
        type: 'button',
        value: 'Search',
        name: 'Search',
        enabled: 'true',
        width: 85,
        height: OPTION_HEIGHT + 10,
      },
    };

    const search = new Search(options, 0);
    search.set({ x: 50, y: 10 });
    this._contentArea.addChild(search);
    this._contentArea.accessible.addChildAt(search, 1);
  }

  _showGridTestCase() {
    this._clearScreen();

    const squareTileDimension = 30;
    const buttonData = {
      value: '',
      enabled: true,
      height: squareTileDimension,
      width: squareTileDimension,
    };
    const buttonClickHandler = (evt) => {
      const prevValue = evt.currentTarget.text.text;
      let newValue;
      if (prevValue === '') {
        newValue = 'X';
      } else if (prevValue === 'X') {
        newValue = 'O';
      } else {
        newValue = '';
      }
      evt.currentTarget.text.text = newValue;
    };

    const gridData = [];
    for (let r = 0; r < 3; r++) {
      const row = [];
      for (let c = 0; c < 3; c++) {
        const button = new Button(buttonData, -1, buttonClickHandler);
        button.setBounds(0, 0, squareTileDimension, squareTileDimension);
        row.push({
          value: button,
          type: 'cell',
          cellWidth: squareTileDimension,
          cellHeight: squareTileDimension,
        });
      }

      gridData.push(row);
    }

    const grid = new Grid(gridData, 0);
    this._contentArea.addChild(grid);
    this._contentArea.accessible.addChild(grid);

    // just moving the grid so it's not right up against the menu bar or left side of the window
    grid.x = 50;
    grid.y = 50;
  }


  _showTableTestCase() {
    this._clearScreen();
    const options = {
      headersData: [
        { value: 'Role', width: 80 },
        { value: 'TagName', width: 100 },
        { value: 'Type', width: 80 },
        { value: 'Description', width: 300 },
      ],
      data: [
        ['Button', 'button', 'input', 'An input that allows for user-triggered actions when clicked or pressed.'],
        ['Menubar', 'ul', 'static', 'A presentation of menu that usually remains visible and is usually presented horizontally.'],
        ['Form', 'form', 'input', 'A landmark region that contains a collection of items and objects that, as a whole, combine to create a form.'],
        ['Table', 'table', 'static', 'A section containing data arranged in rows and columns.'],
      ],
      showBorders: true,
    };

    // Creating table content in <tbody> tag
    const tableBody = new Table(options);

    // actual <table> tag
    const table = new createjs.Container();
    table.addChild(tableBody);
    AccessibilityModule.register({
      displayObject: table,
      role: AccessibilityModule.ROLES.TABLE,
    });
    table.accessible.addChild(tableBody);

    table.accessible.rowCount = tableBody.rowCount;
    table.accessible.colCount = tableBody.colCount;

    const { width, height } = table.getBounds();
    const holderWidth = width;
    const holderHeight = height / 2;

    // Needed because scrollbar cannot be appended in table
    const tableHolder = new createjs.Container();
    tableHolder.setBounds(0, 0, holderWidth, holderHeight);
    AccessibilityModule.register({
      displayObject: tableHolder,
      role: AccessibilityModule.ROLES.NONE,
    });

    tableHolder.addChild(table);
    tableHolder.accessible.addChild(table);

    // Center align on stage
    const contentAreaBounds = this._contentArea.getBounds();
    tableHolder.set({
      x: (contentAreaBounds.width - holderWidth) / 2,
      y: (contentAreaBounds.height - holderHeight) / 2,
    });

    const scrollBar = new ScrollBar(tableHolder, 0);
    scrollBar.x = tableHolder.x + holderWidth - scrollBar.getBounds().width;
    scrollBar.y = tableHolder.y;

    this._contentArea.addChild(tableHolder);
    this._contentArea.accessible.addChild(tableHolder);
    this._contentArea.addChild(scrollBar);
    this._contentArea.accessible.addChild(scrollBar);
  }

  _addTrasformationTestCase(shapeObject) {
    let label;
    let x = 50;
    let y = 75;
    let horizontalScale;
    let verticalScale;
    let horizontalSkew;
    let verticalSkew;
    let transformX;
    let transformY;
    const padding = 10;
    const transformShape = () => {
      shapeObject.set({
        scaleX: horizontalScale.text,
        scaleY: verticalScale.text,
        skewX: horizontalSkew.text,
        skewY: verticalSkew.text,
        regX: transformX.text,
        regY: transformY.text,
      });
    };

    const options = {
      width: 30,
      height: 60,
    };

    options.minValue = 1;
    options.maxValue = 4;

    label = this.createText('scaleX', x, y);
    x += label.getBounds().width + padding;

    horizontalScale = this.createText('1', x, y, false);
    x += horizontalScale.getBounds().width + padding;

    const scaleXButton = this.createSpinButton({
      options, textContainer: horizontalScale, callback: transformShape,
    }, x, y);
    x += scaleXButton.getBounds().width + padding;

    label = this.createText('scaleY', x, y);
    x += label.getBounds().width + padding;

    verticalScale = this.createText('1', x, y, false);
    x += verticalScale.getBounds().width + padding;

    const scaleYButton = this.createSpinButton({
      options, textContainer: verticalScale, callback: transformShape,
    }, x, y);
    x += scaleYButton.getBounds().width + padding + 20;

    options.maxValue = 50;
    x = 50;
    y = 175;
    label = this.createText('skewX', x, y);
    x += label.getBounds().width + padding;

    horizontalSkew = this.createText('1', x, y, false);
    x += horizontalSkew.getBounds().width + padding;

    const skewXButton = this.createSpinButton({
      options, textContainer: horizontalSkew, callback: transformShape,
    }, x, y);
    x += skewXButton.getBounds().width + padding;

    label = this.createText('skewY', x, y);
    x += label.getBounds().width + padding;

    verticalSkew = this.createText('1', x, y, false);
    x += verticalSkew.getBounds().width + padding;

    const skewYButton = this.createSpinButton({
      options, textContainer: verticalSkew, callback: transformShape,
    }, x, y);
    x += skewYButton.getBounds().width + padding + 20;

    options.minValue = 0;
    options.maxValue = 200;
    x = 50;
    y = 275;

    label = this.createText('regX', x, y);
    x += label.getBounds().width + padding;

    transformX = this.createText('0', x, y, false);
    x += transformX.getBounds().width + padding + 15;

    const transformXButton = this.createSpinButton({
      options, textContainer: transformX, callback: transformShape,
    }, x, y);
    x += transformXButton.getBounds().width + padding;

    label = this.createText('regY', x, y);
    x += label.getBounds().width + padding;

    transformY = this.createText('0', x, y, false);
    x += transformY.getBounds().width + padding + 15;

    this.createSpinButton({
      options, textContainer: transformY, callback: transformShape,
    }, x, y);
  }

  createText(value, x, y, shouldAccesible = true) {
    const label = new createjs.Text(value, '18px Arial');
    this.transformControlContainer.addChild(label);
    if (shouldAccesible) {
      AccessibilityModule.register({
        displayObject: label,
        parent: this.transformControlContainer,
        role: AccessibilityModule.ROLES.NONE,
        accessibleOptions: {
          text: label.text,
        },
      });
    }
    label.set({ x, y });
    return label;
  }

  createSpinButton(data, x, y) {
    const spinButton = new SpinButton(data);
    this.transformControlContainer.addChild(spinButton);
    this.transformControlContainer.accessible.addChild(spinButton);

    spinButton.set({ x, y });
    return spinButton;
  }

  _showTreeGridTestCase() {
    this._clearScreen();

    const row0 = {
      rowData: ['Class', 'Student Name', 'Roll No'],
      childrenData: 0,
      type: 'header',
      level: 1,
    };

    const row1 = {
      rowData: ['III', 'Anish', '5'],
      childrenData: 1,
      type: 'cell',
      level: 1,
    };
    const row2 = {
      rowData: ['X', 'Fida', '10'],
      childrenData: 1,
      type: 'cell',
      level: 2,
    };

    const row3 = {
      rowData: ['XI', 'Sudhir', '20'],
      level: 3,
      type: 'cell',
      childrenData: 1,
    };

    const row4 = {
      rowData: ['XI', 'Aniket', '25'],
      level: 4,
      type: 'cell',
      childrenData: 0,
    };

    const row5 = {
      rowData: ['XI', 'Sudhir', '30'],
      level: 1,
      type: 'cell',
      childrenData: 0,
    };

    const rows = [row0, row1, row2, row3, row4, row5];
    const data = {
      rows,
      cellWidth: 265,
      cellHeight: 60,
    };

    const treeGrid = new TreeGrid(data, 0);
    this._contentArea.addChild(treeGrid);
    this._contentArea.accessible.addChild(treeGrid);
    treeGrid.y = 20;
  }

  _showTreeTestCase() {
    this._clearScreen();

    const twoWheelers = [
      {
        label: 'Bicycle',
        childArr: [
          {
            label: 'Mountain Bike',
          },
          {
            label: 'Road Bike',
          },
          {
            label: 'BMX/Trick Bike',
          },
        ],
      },
      {
        label: 'Motorcycle',
        childArr: [
          {
            label: 'Cruiser',
          },
          {
            label: 'Dirt Bike',
          },
          {
            label: 'Sport Bike',
          },
          {
            label: 'Touring Bike',
          },
        ],
      },
    ];

    const threeWheelers = [{ label: 'Motor tricycle' }];

    const fourWheelers = [{
      label: 'Cars',
      childArr: [
        {
          label: 'Hatchback',
        },
        {
          label: 'Sedan',
        }, {
          label: 'MPV',
        },
        {
          label: 'SUV',
          childArr: [{
            label: 'Compact',
          },
          {
            label: 'Mid-size',
          },
          {
            label: 'Full-size',
          },
          {
            label: 'Crossovers',
            childArr: [
              {
                label: 'Subcompact',
              },
              {
                label: 'Compact',
              },
              {
                label: 'Mid-size',
              },
              {
                label: 'Full-size',
              },
            ],
          }],
        },
      ],
    }];

    const vehicleArr = [{
      label: '2 Wheeler',
      childArr: twoWheelers,
    },
    {
      label: '3 Wheeler',
      childArr: threeWheelers,
    },
    {
      label: '4 Wheeler',
      childArr: fourWheelers,
    }];

    const vehicles = {
      label: 'Vehicles',
      childArr: vehicleArr,
    };

    const addAsTreeItem = obj => new TreeItem(obj.label, 0);

    const makeTree = (obj, parentContainer, parentItem) => {
      const element = addAsTreeItem(obj);
      parentContainer.addChild(element);
      parentContainer.accessible.addChild(element);
      if (!_.isEmpty(obj.childArr)) {
        const containerTree = new Tree();
        element.addSubTree(containerTree);
        _.forEach(obj.childArr, (child) => {
          makeTree(child, containerTree, element);
        });
      }
      parentItem.addTreeItem(element);
    };

    const tree = new Tree();
    const vehicleTreeItem = addAsTreeItem(vehicles);
    tree.addChild(vehicleTreeItem);
    tree.accessible.addChild(vehicleTreeItem);
    const vehicleTree = new Tree();
    vehicleTreeItem.addSubTree(vehicleTree);
    _.forEach(vehicles.childArr, (child) => {
      makeTree(child, vehicleTree, vehicleTreeItem);
    });
    this._contentArea.addChild(tree);
    this._contentArea.accessible.addChild(tree);
  }

  _mathTextCase() {
    this._clearScreen();

    const options = {
      src: formulaImg1,
      label: '(a+b)^{2}=a^{2}+2ab+b^{2}',
      cjsScaleX: 1,
      cjsScaleY: 1,
    };
    const mathText = new PlainTextMath(options);
    mathText.x = 200;
    mathText.y = 200;
    this._contentArea.addChild(mathText);
    this._contentArea.accessible.addChild(mathText);

    const option1 = {
      src: formulaImg2,
      label: 'a^{2}+b^{2}=c^{2}',
      cjsScaleX: 1,
      cjsScaleY: 1,
    };
    const mathml = '<math xmlns ="http://www.w3.org/1998/Math/MathML"><mrow><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup><mo> = </mo><msup><mi>c</mi><mn>2</mn></msup> </mrow></math>';
    const text = new PlainTextMath(option1);
    text.x = 200;
    text.y = 250;
    this._contentArea.addChild(text);
    AccessibilityModule.register({
      displayObject: text,
      role: AccessibilityModule.ROLES.MATH,
    });
    this._contentArea.accessible.addChild(text);
    text.accessible.mathML = mathml;
  }

  _showTextFormatCase() {
    this._clearScreen();

    this.textFormat = new createjs.Container();
    this._contentArea.addChild(this.textFormat);
    AccessibilityModule.register({
      displayObject: this.textFormat,
      role: AccessibilityModule.ROLES.NONE,
    });
    this._contentArea.accessible.addChild(this.textFormat);
    let prefixText = 'Example of ';
    const PADDING = 7;
    const boldText = new FormatText(prefixText, 'Bold Text', AccessibilityModule.ROLES.FORMAT_TEXT_BOLD, 'bold', '22', 'Arial');
    this.textFormat.addChild(boldText);
    this.textFormat.accessible.addChild(boldText);
    boldText.y = PADDING;

    const codeText = new FormatText(prefixText, 'Computer Code', AccessibilityModule.ROLES.FORMAT_TEXT_CODE, '', '22', 'monospace');
    this.textFormat.addChild(codeText);
    this.textFormat.accessible.addChild(codeText);
    codeText.y = boldText.y + boldText.getBounds().height + PADDING;

    const deletedText = new FormatText(prefixText, 'Deleted Text', AccessibilityModule.ROLES.FORMAT_TEXT_DELETE, '', '22', 'Arial');
    this.textFormat.addChild(deletedText);
    this.textFormat.accessible.addChild(deletedText);
    deletedText.y = codeText.y + codeText.getBounds().height + PADDING;

    const emphasizeText = new FormatText(prefixText, 'Emphasize Text', AccessibilityModule.ROLES.FORMAT_TEXT_EMPHASIZE, 'italic', '22', 'Arial');
    this.textFormat.addChild(emphasizeText);
    this.textFormat.accessible.addChild(emphasizeText);
    emphasizeText.y = deletedText.y + deletedText.getBounds().height + PADDING;

    const italicText = new FormatText(prefixText, 'Italic Text', AccessibilityModule.ROLES.FORMAT_TEXT_ITALIC, 'italic', '22', 'Arial');
    this.textFormat.addChild(italicText);
    this.textFormat.accessible.addChild(italicText);
    italicText.y = emphasizeText.y + emphasizeText.getBounds().height + PADDING;

    const insertedText = new FormatText(prefixText, 'Inserted Text', AccessibilityModule.ROLES.FORMAT_TEXT_INSERT, '', '22', 'Arial');
    this.textFormat.addChild(insertedText);
    this.textFormat.accessible.addChild(insertedText);

    insertedText.y = italicText.y + italicText.getBounds().height + PADDING;

    const keybordtext = new FormatText(prefixText, 'Keybord Text', AccessibilityModule.ROLES.FORMAT_TEXT_KBD, '', '22', 'monospace');
    this.textFormat.addChild(keybordtext);
    this.textFormat.accessible.addChild(keybordtext);
    keybordtext.y = insertedText.y + insertedText.getBounds().height + PADDING;

    const preformatedTxt = 'Text in a pre element \n'
                          + 'is displayed in a fixed-width\n'
                          + 'font, and it preserves\n'
                          + 'both      spaces and\n'
                          + 'line breaks';
    const preformatedText = new FormatText(prefixText, preformatedTxt, AccessibilityModule.ROLES.FORMAT_TEXT_PREFORMAT, '', '22', 'monospace');
    this.textFormat.addChild(preformatedText);
    this.textFormat.accessible.addChild(preformatedText);
    preformatedText.y = keybordtext.y + keybordtext.getBounds().height + PADDING;

    const strikeText = new FormatText(prefixText, 'Strike Text', AccessibilityModule.ROLES.FORMAT_TEXT_STRIKETHROUGH, '', '22', 'Arial');
    this.textFormat.addChild(strikeText);
    this.textFormat.accessible.addChild(strikeText);
    strikeText.y = preformatedText.y + preformatedText.getBounds().height + PADDING;

    const sampleText = new FormatText(prefixText, 'Sample Text', AccessibilityModule.ROLES.FORMAT_TEXT_SAMPLE, '', '22', 'monospace');
    this.textFormat.addChild(sampleText);
    this.textFormat.accessible.addChild(sampleText);
    sampleText.y = strikeText.y + strikeText.getBounds().height + PADDING;

    const smallText = new FormatText(prefixText, 'SmallText', AccessibilityModule.ROLES.FORMAT_TEXT_SMALL, '', '12px', 'Arial');
    this.textFormat.addChild(smallText);
    this.textFormat.accessible.addChild(smallText);
    smallText.y = sampleText.y + sampleText.getBounds().height + PADDING;

    const strongText = new FormatText(prefixText, 'Strong Text', AccessibilityModule.ROLES.FORMAT_TEXT_STRONG, 'bold', '22', 'Arial');
    this.textFormat.addChild(strongText);
    this.textFormat.accessible.addChild(strongText);
    strongText.y = smallText.y + smallText.getBounds().height + PADDING;

    prefixText = 'Example of SubscriptText Log';
    const subscriptText = new FormatText(prefixText, '2', AccessibilityModule.ROLES.FORMAT_TEXT_SUBSCRIPT, '', '22', 'Arial');
    this.textFormat.addChild(subscriptText);
    this.textFormat.accessible.addChild(subscriptText);
    subscriptText.y = strongText.y + strongText.getBounds().height + PADDING;

    prefixText = 'Example of SupscriptText 2';
    const supscriptText = new FormatText(prefixText, '4', AccessibilityModule.ROLES.FORMAT_TEXT_SUPERSCRIPT, '', '22', 'Arial');
    this.textFormat.addChild(supscriptText);
    this.textFormat.accessible.addChild(supscriptText);
    supscriptText.y = subscriptText.y + subscriptText.getBounds().height + PADDING;

    const date = new Date();
    prefixText = 'Example of Time ';
    const timeText = new FormatText(prefixText, `${date}`, AccessibilityModule.ROLES.FORMAT_TEXT_TIME, '', '16', 'Arial');
    this.textFormat.addChild(timeText);
    this.textFormat.accessible.addChild(timeText);
    timeText.y = supscriptText.y + supscriptText.getBounds().height + PADDING;

    prefixText = 'Example of ';
    const underLineText = new FormatText(prefixText, 'UnderLine Text', AccessibilityModule.ROLES.FORMAT_TEXT_UNDERLINE, '', '16', 'Arial');
    this.textFormat.addChild(underLineText);
    this.textFormat.accessible.addChild(underLineText);
    underLineText.y = timeText.y + timeText.getBounds().height + PADDING;

    prefixText = 'and';
    const variableText = new FormatText(prefixText, 'Variable Text', AccessibilityModule.ROLES.FORMAT_TEXT_ITALIC, 'italic', '22', 'Arial');
    this.textFormat.addChild(variableText);
    this.textFormat.accessible.addChild(variableText);
    variableText.x = underLineText.x + underLineText.getBounds().width + PADDING;
    variableText.y = underLineText.y;

    const bounds = this._contentArea.getBounds();
    this.textFormat.x = bounds.width * 0.5 - this.textFormat.getBounds().width * 0.5;
    this.textFormat.y = bounds.height * 0.5 - this.textFormat.getBounds().height * 0.5;

    const shape = new createjs.Shape();
    shape.graphics.beginFill('#FFD64B').drawRect(0, 0, bounds.width, bounds.height);
    this._contentArea.addChildAt(shape, 0);
  }
}
