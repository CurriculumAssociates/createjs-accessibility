import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import Button from './Button';
import Link from './Link';

export default class Dialog extends createjs.Container {
  constructor(btnData, width, height, tabIndex) {
    super();
    this.height = height;
    this.width = width;
    this.visible = false;
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.DIALOG,
    });

    this.setBounds(0, 0, this.width, this.height);

    const background = new createjs.Shape();
    background.graphics.beginStroke('black').beginFill('#ccc').drawRect(0, 0, this.width, this.height);
    this.addChild(background);

    const titleText = new createjs.Text('Createjs Accessibility Tester', 'bold 32px Arial', '#000');
    titleText.x = 10;
    titleText.y = 10;
    this.addChild(titleText);
    AccessibilityModule.register({
      displayObject: titleText,
      parent: this,
      role: AccessibilityModule.ROLES.HEADING1,
      accessibleOptions: {
        text: titleText.text,
      },
    });
    this.accessible.labelledBy = titleText;

    const descriptionText = new createjs.Text('A webapp to test the Createjs Accessibility Module and provide a reference implementation for its usage', 'bold 18px Arial', '#000');
    descriptionText.x = titleText.x;
    descriptionText.y = titleText.y + 50;
    descriptionText.lineWidth = this.width - 20;
    this.addChild(descriptionText);
    AccessibilityModule.register({
      displayObject: descriptionText,
      parent: this,
      role: AccessibilityModule.ROLES.NONE,
      accessibleOptions: {
        text: descriptionText.text,
      },
    });
    this.accessible.describedBy = descriptionText;

    const accessibilityTerm = new createjs.Text('Accessibility', 'bold 18px Arial', '#000');
    accessibilityTerm.x = 10;
    accessibilityTerm.y = 130;
    this.addChild(accessibilityTerm);

    const definition = 'Accessibility is the design of products, devices, services, or environments for people with disabilities. The concept of accessible design and practice of accessible development ensures both "direct access" (i.e. unassisted) and "indirect access" meaning compatibility with a person\'s assistive technology';
    const accessibilityDefinition = new createjs.Text().set({
      text: definition,
      font: '16px Arial',
      lineWidth: this.width - 20,
    });
    accessibilityDefinition.x = 10;
    accessibilityDefinition.y = accessibilityTerm.y + 30;
    this.addChild(accessibilityDefinition);
    AccessibilityModule.register({
      displayObject: accessibilityDefinition,
      parent: this,
      role: AccessibilityModule.ROLES.DEFINITION,
      accessibleOptions: {
        text: accessibilityDefinition.text,
      },
    });

    AccessibilityModule.register({
      displayObject: accessibilityTerm,
      parent: this,
      role: AccessibilityModule.ROLES.TERM,
      accessibleOptions: {
        name: 'Accessibility',
        labelledBy: accessibilityDefinition,
        text: accessibilityTerm.text,
      },
    });

    const options = {
      href: 'https://en.wikipedia.org/w/index.php?title=Accessibility&oldid=865715054',
      text: 'Source link',
    };
    const source = new Link(options);
    source.x = 10;
    source.y = accessibilityDefinition.y + accessibilityDefinition.getBounds().height + 20;
    this.addChild(source);
    this.accessible.addChild(source);

    const callBack = () => {
      this.visible = false;
      this.parent.visible = false;
    };

    const button = new Button(btnData, tabIndex, callBack);
    this.addChild(button);
    this.accessible.addChild(button);
    button.x = this.width - button.getBounds().width * 2;
    button.y = 0;
    button.accessible.label = btnData.name;
  }
}
