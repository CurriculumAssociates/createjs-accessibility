import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

const ITEM_PADDING = 25;
export default class Feed extends createjs.Container {
  constructor(width, height) {
    super();

    this.articleList = [];
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.FEED,
    });
    this.width = width;
  }

  /**
   * Adds a Article
   * @param {!Article} article - tool to add
   */
  addArticls(article) {
    let y;
    if (this.articleList.length === 0) {
      y = ITEM_PADDING;
    } else {
      const lastItem = this.articleList[this.articleList.length - 1];
      const bounds = lastItem.getBounds();
      y = lastItem.y + bounds.y + bounds.height + ITEM_PADDING;
    }
    article.y = y;
    this.articleList.push(article);
    this.addChild(article);
    this.accessible.addChild(article);
    this.setFeedBounds();
  }

  setFeedBounds() {
    const length = this.articleList.length;
    const { height } = this.articleList[length - 1].getBounds();
    const totalHeight = (this.articleList[length - 1].y + height) - this.articleList[0].y + ITEM_PADDING;
    this.setBounds(0, 0, this.width, totalHeight);
  }
}
