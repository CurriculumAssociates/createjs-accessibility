# Createjs Accessibility Module

## Description
HTML5 provides the canvas tag which is an area that can be drawn to via Javascript.  Createjs (https://www.createjs.com/) is a library that help manage the low level canvas draw calls with higher level DisplayObjects.  This module allows for annotating those DisplayObjects with additional information needed for accessibility support, which the module uses to create and update HTML elements that are placed under the canvas.  In order to help with keyboard support and other Assistive Technologies (ATs) that cause input events, this module also sends up events to the corresponding DisplayObject that the consuming app can respond to accordingly.

The translation of DisplayObjects to HTML is necessary for accessibility support since Javascript draw calls don't provide information to ATs for understanding the content in the canvas or interacting with it.  However, other HTML tags do work with ATs through a combination of the tag choice, various attributes, and text values.

### Standards
This module's accessibility support is based around WCAG 2.1, though there are considerations outside the scope of this module that are needed for a particular webpage to meet the standard (e.g. contrast ratio, supported orientations).  For what the module can provide to meet that standard, it does so by using HTML5 semantic markup as much as possible and following WAI-ARIA 1.1.  The module does have more roles than WAI-ARIA specifies due to trying to use semantic markup which can sometimes lead to multiple tag options.  For example instead of having just a "heading" role, the module has roles "heading1" through "heading6" which it translates to the "h1" through "h6" tags.  It also provides additional roles that translate to the different format text tags (e.g. bold, emphasize, code).

## Install
This can be added to your project via npm: `npm install CurriculumAssociates/createjs-accessibility`

Then in ES6, the module can be imported by doing: `import AccessibilityModule from 'CurriculumAssociates/createjs-accessibility';`

## Usage

### Registering DisplayObject(s)
DisplayObjects that are to be translated to the DOM need to be registered with the module so that the additional annotation needed for accessibility support can be supplied. Registering adds an `AccessibilityObject` instance (or one of its subtypes) to the `.accessible` field to the DisplayObject, which can be used to get or set the various pieces of accessibility information that are relevant to that role.  If the role used for the DisplayObject needs to be changed, then it needs to be re-registered with the module using the new role, which will result in a new `AccessibilityObject` instance (or one of its subtypes) being attached to the DisplayObject overwriting the `.accessible` field's value.

`AccessibilityModule.register` allows for registering 1 or multiple DisplayObjects with the module.  It takes either an object containing accessibility configuration data for a DisplayObject or an array of those as an argument.  The configuration data needed is the DisplayObject and the desired role.  Optionally the configuration data can include the parent DisplayObject in the accessibility tree (that has already been registered with the module), the index into the parent's accessibility child order to add the DisplayObject, focus and keyboardClick event handlers, and an object containing initial values to use for the various fields that the AccessibilityObject (or subclass) has.  For example:
```
const container = new createjs.Container();
AccessibilityModule.register({
  displayObject: container,
  role: AccessibilityModule.ROLES.NONE,
});
const text = new createjs.Text('Test string', '16px Arial');
AccessibilityModule.register({
  displayObject: text,
  role: AccessibilityModule.ROLES.HEADING3,
  parent: container,
  accessibleOptions: {
    text: 'Test string',
  },
});
container.addChild(text);
```

### Adding DisplayObject to Accessibility Tree
Registered DisplayObjects need to be added to the tree of DisplayObjects to be translated in order to be included in the DOM.  The first way to do this is to set the `parent` field in the configuration object sent to `AccessibilityModule.register` for that DisplayObject.  The second way is to set the DisplayObject as the root of the accessibility tree, which is discussed in a later section.  The third way is to call `addChild` or `addChildAt` on the `AccessibilityObject` contained in the desired parent DisplayObject's `.accessible` field, which does require that the parent has already been registered with the module as well.  For example:
```
const container = new createjs.Container();
AccessibilityModule.register({
  displayObject: container,
  role: AccessibilityModule.ROLES.NONE,
});
const shape = new createjs.Shape();
AccessibilityModule.register({
  displayObject: shape,
  role: AccessibilityModule.ROLES.NONE,
});
container.addChild(shape);
container.accessible.addChild(shape);
```
That example has the shape as a child of the container in both the Createjs container/child tree and in the accessibility tree.  However, that isn't required, which allows for flexibility of having the DOM order and Createjs's draw order be independent of eachother.  One example usage of this is when implementing a drag and drop interaction; the DisplayObject picked up might be re-added to its parent in Createjs's container/child tree to get it drawn on top of other elements, but there's no reason to move it in the accessibility tree.

### Registering the stage
Each stage that needs accessibility support needs to be registered with the module in order to create an accessibility translator instance for it, such as with the following lines:
```
const stage = new createjs.Stage('stage');
const onReady = () => {
  // discussed in next step
};
AccessibilityModule.setupStage(stage, document.getElementById('cam-test'), onReady);
```
When the supplied onReady function is called, then the new `accessibilityTranslator` field on the supplied stage is ready for use.  The next step is attaching an already registered DisplayObject as the root DisplayObject for the translator to use for creating/updating the DOM.  Such as by adding the following lines to the onReady function:
```
const container = new createjs.Container();
AccessibilityModule.register({
  displayObject: container,
  role: AccessibilityModule.ROLES.NONE,
});
stage.accessibilityTranslator.root = container;
```

### Rendering the DOM
In order to actually create and update the DOM, the accessibility translator's update method needs to be called.  So that the canvas and DOM are updated in sync with eachother, it is recommended to call the stage's update then the translator's update.
```
stage.update();
stage.accessibilityTranslator.update();
```

### Canvas resizing
Since the DOM translation is to be rendered behind the canvas, whenever the canvas is resized the DOM translation should be as well.  One of the main motivations for this is to ensure that DisplayObjects are positioned and sized the same in the canvas as their DOM translation in order to work with screen magnifiers.  Resizing the DOM translation is simply:
```
AccessibilityModule.resize(stage);
```

### Constraints
All pixels of the canvas must be set to avoid the translated DOM bleeding through
Element passed to setupStage being in the right position to allow for the translated DOM to be under the stage

### Events
Keyboard events on the translated DOM are communicated to the associated DisplayObject by way of Createjs events.  While some events can be emitted by any role, others are role specific.  It is also worth noting that while HTML elements can receive a "click" event from keyboard interaction, the module emits a "keyboardClick" event instead for the applicable roles.  This is due to the event being dispatched to the DisplayObject, and "click" events are already caused by mouse interaction.  So by using a different event name, a consuming app can customize its handling of keyboard clicks from mouse clicks if needed.  If a consuming app doesn't want custom handling, then the same listener can be used for both events.

| Role | Event | Additional Data to the Event instance | Description |
|---|---|---|---|
| Any | focus | | Element has received focus |
|   | blur | | Element has lost focus |
| Any when enabled via `displayObject.accessible.enableKeyEvents = true` | keydown | `keyCode`: code for which key was pressed | A key was pressed on the keyboard |
| | keyup | `keyCode`: code for which key was released | A key was released on the keyboard |
| button | keyboardClick | | clicking event from keyboard interaction |
| checkbox | keyboardClick | | clicking event from keyboard interaction |
| menu item | closeMenu | | the menu should close |
| menu item | openMenu | | the menu should open |
| menu item | keyboardClick | | the menu item was clicked |
| multi-line textbox | valueChanged | `value`: the new string in the textbox | the string in the textbox has changed |
| | selectionChanged | `selectionStart`: index into the value where the section starts<br>`selectionEnd` index into the value where the section ends<br>`selectionDirection`: "forward" for the selection increasing towards the end of the string, "backward" for the section increasing towards the beginning of the string | there has been a change in which part of the text is selected |
| multi-select listbox | valueChanged | `selectedValues`: array where each entry is the value of selected options in the listbox<br>`selectedDisplayObjects`: array containing the DisplayObjects that are selected in the listbox | which items are selected in the listbox have changed |
| radio | keyboardClick | | clicking event from keyboard interaction |
| scrollbar | scroll | For horizontal scrollbars, `scrollLeft`: value in pixels, for how far the content is scrolled horizontally.<br>Otherwise, `scrollTop`: value, in pixels, for how far the content is scrolled vertically | scrolling the scrollbar |
| single line textbox | valueChanged | `value`: the new string in the textbox | the string in the textbox has changed |
| | selectionChanged | `selectionStart`: index into the value where the section starts<br>`selectionEnd` index into the value where the section ends<br>`selectionDirection`: "forward" for the selection increasing towards the end of the string, "backward" for the section increasing towards the beginning of the string | there has been a change in which part of the text is selected |
| single-select listbox | valueChanged | `selectedValue`: value of selected options in the listbox<br>`selectedDisplayObject`: the DisplayObjects that is selected in the listbox | which item is selected in the listbox has changed |
| slider | valueChanged | `newValue`: new value of the slider | value of the slider has changed |
| spin button | increment | | the value of the spin button should increase |
| | decrement | | the value of the spin button should decrease |
| | change | `value`: number representing the new value | the value of the spin button has changed |
| tab | click | | clicking event from keyboard interaction |
| tab list | click | | clicking event from keyboard interaction |
| tree grid | collapseRow | `rowDisplayObject`: DisplayObject for the row to collapse | The specified expandable row of the grid should be collapsed |
| tree grid | expandRow | `rowDisplayObject`: DisplayObject for the row to collapse | The specified expandable row of the grid should be collapsed |
| tree item | click | | clicking event from keyboard interaction |

### Test app and reference implementation
There is an open source companion test app for this module at https://github.com/CurriculumAssociates/createjs-accessibility-tester.  The intent behind that app is to both test changes to this module and provide a reference implementation for the various roles.  Some roles (e.g. menubar) require a particular structure to work correctly, and this test app shows them in that structure and functional.  Please see that repo for additional details.

## Browsers Compatibility
Since the canvas tag was introduced in HTML5, an HTML5 compatible browser is required.  While the module is intended to work across HTML5 browsers, the ones currently tested against are:
* Chrome 88+
* ChromeOS 88+ (with and without ChromeVox)
* Edge 88
* Firefox 79+ (with and without NVDA 2020.4)
* IE11 (with and without Jaws 2019)
* Safari 13.1.3 (with and without VoiceOver)

## License
The Createjs Accessibility Module is released under the ISC license. https://opensource.org/licenses/ISC
