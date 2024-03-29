import _ from 'lodash';
import { AccessibleDisplayObject } from '../RoleObjects/AccessibilityObject';
import type {
  DisplayObjectProps,
  DomDataObjectType,
} from '../AccessibilityTranslator';

const updateAttributesFromProps = (
  element: Element,
  props: DisplayObjectProps
) => {
  Object.entries(props).forEach(([name, value]) => {
    if (name.startsWith('on')) {
      // @ts-ignore
      element.addEventListener(name.toLowerCase().substring(2), value);
    } else if (name === 'style' && _.isObject(value)) {
      const valueString = Object.entries(value)
        .map(([k, v]) => {
          k = k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
          return `${k}: ${v}`;
        })
        .join('; ');
      element.setAttribute('style', valueString);
    } else {
      if (name === 'acceptCharset') {
        name = name.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      }

      if (_.isUndefined(value) || _.isNull(value)) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value.toString());
      }
    }
  });
};

export const createElement = (
  tagName: DomDataObjectType['tagName'],
  props: DisplayObjectProps,
  children: DomDataObjectType['childElements']
) => {
  const element = document.createElement(tagName);

  updateAttributesFromProps(element, props);

  if (children && children.length > 0) {
    children.forEach((child, index) => {
      /* eslint-disable-next-line */
      insertChildAtIndex(element, child, index);
    });
  }

  return element;
};

const createTextNode = (text: string) => {
  const dummyNode = document.createElement('template');
  dummyNode.innerHTML = text.trim();
  return dummyNode.content.firstChild;
};

const insertChildAtIndex = (
  parent: Element,
  child: DomDataObjectType | string,
  index: number
) => {
  const childElem = _.isString(child)
    ? createTextNode(child)
    : createElement(child.tagName, child.props, child.childElements);
  if (
    index < parent.childNodes.length &&
    (parent.childNodes[index].isEqualNode(childElem) || // @ts-ignore
      (childElem.id && childElem.id === parent.childNodes[index].id))
  ) {
    return;
  }
  if (index === undefined || index >= parent.childNodes.length) {
    parent.appendChild(childElem);
  } else {
    parent.insertBefore(childElem, parent.childNodes[index]);
  }
};

export const addMissingElem = (
  displayObj: AccessibleDisplayObject,
  { tagName, props }: { tagName: string; props: DisplayObjectProps }
) => {
  let parentElem: Element;
  if (displayObj.accessible.parent) {
    const parentId = displayObj.accessible.parent.domId;
    parentElem = document.querySelector(`#${parentId}`);
  } else {
    parentElem = document.querySelector('#root');
  }
  const domElem = createElement(tagName, props, []);
  parentElem.insertAdjacentElement('afterbegin', domElem);
  return domElem;
};

export const updateElement = (
  displayObj: AccessibleDisplayObject,
  domData: DomDataObjectType,
  domId: string
) => {
  const { tagName, props, childElements } = domData;
  let element = document.querySelector(`#${domId}`);
  if (element) {
    updateAttributesFromProps(element, props);
  } else {
    element = addMissingElem(displayObj, { tagName, props });
  }
  childElements.forEach((childElData, index) => {
    insertChildAtIndex(element, childElData, index);
  });

  while (element.childNodes.length !== childElements.length) {
    element.removeChild(element.lastChild);
  }
};
