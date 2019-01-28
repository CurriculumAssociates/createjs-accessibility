import _ from 'lodash';
import SearchBox from './SearchBox.js';
import Button from './Button.js';
import AccessibilityModule from 'createjs-accessibility';

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

    // Removing auto searching whenever there is input
    const callBack = this.searchBox._processSearchData;
    this.searchBox.removeEventListener('searchForText', callBack);

    // Managing cross button and placeholder visibility
    this.searchBox.addEventListener('searchForText', () => {
      this.searchBox.crossButton.visible = !_.isEmpty(this.searchBox.searchText);
    });

    // Adding Search button
    const buttonTabIndex = (tabIndex + 1);
    this.searchButton = new Button(options.buttonOptions, buttonTabIndex, callBack);
    this.searchButton.set({ x: options.width });
    this.addChild(this.searchButton);
    this.accessible.addChild(this.searchButton);
  }
}
