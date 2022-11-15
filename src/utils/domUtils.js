import { depth } from 'treeverse';
import _ from 'lodash';

const updateAttributesFromProps = (element, props) => {
  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith('on')) {
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
      element.setAttribute(name, value !== undefined ? value.toString() : '');
    }
  });
};

export const findDomDataObjFromDomId = (domData, domId) => {
  let returnObj = null;
  depth({
    tree: domData,
    visit(node) {
      if (node.props && node.props.id === domId) {
        returnObj = node;
        return node;
      }
    },
    getChildren(node) {
      return node.childElements;
    },
  });
  return returnObj;
};

export const createElement = (tagName, props, children = []) => {
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

const insertChildAtIndex = (parent, child, index) => {
  const childElem = child.tagName
    ? createElement(child.tagName, child.props, child.childElements)
    : document.createTextNode(child);
  if (
    index < parent.childNodes.length &&
    parent.childNodes[index].isEqualNode(childElem)
  ) {
    return;
  }
  if (index === undefined || index >= parent.childNodes.length) {
    parent.appendChild(childElem);
  } else {
    parent.insertBefore(childElem, parent.childNodes[index]);
  }
};

export const addMissingElem = (displayObj, { tagName, props }) => {
  let parentElem;
  if (displayObj.accessible.parent) {
    const parentId = displayObj.accessible.parent._domId;
    parentElem = document.querySelector(`#${parentId}`);
  } else {
    parentElem = document.querySelector('#root');
  }
  const domElem = createElement(tagName, props);
  parentElem.insertAdjacentElement('afterbegin', domElem);
  return domElem;
};

export const updateElement = (displayObj, domDataObj, domId) => {
  const { tagName, props, childElements } = findDomDataObjFromDomId(
    domDataObj,
    domId
  );
  let element = document.querySelector(`#${domId}`);
  if (element) {
    updateAttributesFromProps(element, props);
    const elementsToRemove = [];
    element.childNodes.forEach((childNode) => {
      if (
        !childElements.some((obj) => {
          return _.isString(obj)
            ? obj === childNode
            : obj.props.id === childNode.getAttribute('id');
        })
      ) {
        elementsToRemove.push(childNode);
      }
    });
    elementsToRemove.forEach((el) => element.removeChild(el));
  } else {
    element = addMissingElem(displayObj, { tagName, props });
  }
  childElements.forEach((childElData, index) => {
    insertChildAtIndex(element, childElData, index);
  });
};

export const getUpdatedDisplayObjects = (displayObject) => {
  const updatedElements = [];
  depth({
    tree: displayObject,
    visit(node) {
      if (node.accessible._markedForUpdate) {
        updatedElements.push(node);
      }
    },
    getChildren(node) {
      return node.accessible.children;
    },
  });
  return updatedElements;
};
