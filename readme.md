# Createjs Accessibility Module Test App and Reference Implementation

## Description
The Createjs Accessibility Module (abbreviated CAM, located at https://github.com/CurriculumAssociates/createjs-accessibility) allows for annotating DisplayObjects with accessibility information which is used to translate the DisplayObjects to the DOM to help a web page's canvas content to meet WCAG 2.1.  This test app allows for testing any changes to that module in browsers that may or may not have an Assistive Technology (AT) in use.  Also, some of the ARIA roles require a particular nesting structure to function correctly (e.g. menubar) and this test app also servers as a reference implementation of doing that with CAM.

## Setup
Since this is a sample app and not a library, the first step is to clone the repo:
```
git clone https://github.com/CurriculumAssociates/createjs-accessibility-tester.git
```
Then enter the directory and install dependencies:
```
cd createjs-accessibilty-tester && npm i
```
Once that successes without errors, it can be started:
```
npm start
```
And finally, once webpack-dev-server has finished building the project, the app can be access by pointing a webbrowser to (assuming the port is not already in use):
`http://localhost:8007/`

## Usage
Since the canvas is on top of the DOM translation performed by CAM, the app can be interacted with the mouse or keyboard where the canvas and DOM remain in sync due to the communication provided by CAM.  Since the purpose of CAM is to provide the markup needed to work with ATs, the app can also be interacted with through those as well.  Jaws 18 is currently the one tested against, but it should work with others.

## Test Cases

### Layout
The area below the menu bar and above the footer is where most test cases display.  The test case displayed in this area can be changed by using the menu bar to select another test case.  The only test cases that don't use that area are the ones that are on screen at all times, which includes the banner, menu bar, footer, as well as the content of those areas.

### Test Case Design
The test cases are intended to test a role or multiple roles in a reasonably realistic way, such as mocking up a signup interface to test multiple input roles.  Each test case should be reasonably realistic in itself, but the collection of test cases at the moment does not create a clear cohesive app.  While not every permutation of attribute and value is tested for each role in a test case (which can be done via the console in the browser's dev tools during development), they do test/demonstrate correct nesting structure of roles, relationship of elements, handling of input, and passing of relevant information to CAM.

Every role currently implemented in CAM should be included in at least 1 test case in this app.  This of course means that adding roles to CAM means updating this app to demonstrate and test its usage.  The process for doing so is to evaluate if the role can be added to an existing test case while keeping it reasonably realistic.  If there isn't a good existing test case, then a new one reasonably realistic one can be created. Test cases should also follow WAI-ARIA authoring practices (https://www.w3.org/TR/wai-aria-practices-1.1/).

## Development
Once a new role has been added to CAM, a widget should be created in this app to allow for testing and demoing it.  The widgets are not intended to be part of a fully featured and customizable UI library, but enough to test and demo the role while meeting WCAG 2.1 AA.  Each widget has a file in `src/widgets` which exports the class for the widget.  Since widgets typically need to contain multiple DisplayObjects to render in canvas properly, these classes typically extend `createjs.Container`.  The constructor should register the widget with CAM without specifying a parent, such as:
```
AccessibilityModule.register({
      displayObject: this,
      accessibleOptions: options,
      role: AccessibilityModule.ROLES.BUTTON,
});
```
Instances of the widget will be added to the accessibility tree when they are created in AppWindow.js (discussed later).  If the widget has descendant DisplayObjects that should be registered with CAM, that registration should occur while the instance is being created and those should be added as descendants of `this` on both the Createjs side and in the widget's accessibility tree.  Also, binding of event listeners for both Createjs emitted events and events emitted from CAM should be done as part of creating the instance.

Using the newly created widget is done by adding at least one instance of it to a test case in `src/widgets/AppWindow.js` or creating a new test case in that file.  Test cases that use the area between the menu and the footer are written as functions where their function bodies start with `this._clearScreen();` in order to clear the previously displayed test case in that area.  Then they can create and configure whatever widgets the test case requires.  To display the widgets for a test case, they should be added as children of `this._contentArea`, both on the Createjs side and with CAM.  New test cases that use this area also need to be added to the menu bar, generally in the "Test Cases" menu before the "Show Grid" test case.

If a non-code file (e.g. image) needs to be added, then it should be placed in `src/widgets/media`.
