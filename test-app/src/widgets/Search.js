import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import SearchBox from './SearchBox';
import Button from './Button';

export default class Search extends createjs.Container {
  constructor(options, tabIndex) {
    super();
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.SEARCH,
    });

    // Adding Search Box
    this.searchBox = new SearchBox(options.width, options.height, tabIndex, options.listArr, 'Search substring here');
    this.addChild(this.searchBox);
    this.accessible.addChild(this.searchBox);

    // Adding Clear button
    this.addChild(this.searchBox.clearButton);
    this.accessible.addChild(this.searchBox.clearButton);

    // Adding Search button
    this.searchButton = new Button(options.buttonOptions, 0, this.searchBox._processSearchData);
    this.searchButton.set({ x: options.width });
    this.addChild(this.searchButton);
    this.accessible.addChild(this.searchButton);
  }
}
