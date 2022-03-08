import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import AccessibilityTranslator from './AccessibilityTranslator';
import { createAccessibilityObjectForRole } from './RoleObjectFactory';
import { ROLES } from './Roles';

/**
 * Calculates style metrics for DOM representation of canvas stage.
 * @param {createjs.Stage} stage - createjs stage that has been registered for accessibility
 * @returns {Object} style object for positioning associated DOM elements
 */
function calcDomStylesFromStage(stage) {
  // true
  //    to return style object for putting the DOM element adjacent to the canvas
  //    (useful for debugging)
  // false
  //    to return style object to put the DOM beneath the canvas
  const debugPos = false;

  const { canvas } = stage;

  const computedStyle = getComputedStyle(canvas);
  const width = parseInt(computedStyle.width, 10);
  const height = parseInt(computedStyle.height, 10);

  const attrWidth = parseInt(canvas.getAttribute('width'), 10) || width;
  const attrHeight = parseInt(canvas.getAttribute('height'), 10) || height;

  const scaleX = width / attrWidth;
  const scaleY = height / attrHeight;

  return {
    transformStyle: {
      overflow: 'hidden',
      position: 'absolute',
      left: debugPos ? canvas.offsetLeft + attrWidth * scaleX : 'auto',
      top: `${canvas.offsetTop}px`,
      zIndex: debugPos ? 'auto' : -1,
      height: `${attrHeight}px`,
      width: `${attrWidth}px`,
      marginLeft: computedStyle['margin-left'],
      transform: computedStyle.transform,
      transformOrigin: computedStyle.transformOrigin,
    },
    moduleStyle: {
      width: '100%',
      height: '100%',
      border: computedStyle.border,
      boxSizing: computedStyle['box-sizing'],
      padding: computedStyle.padding,
      transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
      transformOrigin: 'top left',
    },
  };
}

/**
 * Setup accessibility support for a Stage. The AccessibilityTranslator instance will be
 * attached to the provided stage by adding an "accessibilityTranslator" member to the stage.
 * @param {!createjs.Stage} stage - CreateJS Stage to attach the translator
 * @param {!(HTMLElement|string)} parentElement - HTML Element or its id to which the DOM
 * translation will be added
 * @param {Function} onReady - An optional function to call when the module is mounted into the
 * parentElement
 */
function setupStage(stage, parentElement, onReady = () => {}) {
  let component;
  const styles = calcDomStylesFromStage(stage);
  const moduleNode = (
    <div style={styles.transformStyle}>
      <div style={styles.moduleStyle}>
        <AccessibilityTranslator stage={stage} ref={(c) => { component = c; }} />
      </div>
    </div>
  );

  if (_.isString(parentElement)) {
    parentElement = document.getElementById(parentElement);
  }

  ReactDOM.render(moduleNode, parentElement, () => {
    stage.accessibilityTranslator = component;
    stage.accessibilityRootElement = parentElement;
    onReady();
  });
}

/**
 * Cleanup and unmount React node that tracks accessibility support for a Stage.
 * @param {!createjs.Stage} stage - CreateJS Stage to cleanup
 */
function releaseStage(stage) {
  const accessibilityRoot = stage.accessibilityRootElement;
  ReactDOM.unmountComponentAtNode(accessibilityRoot);
}

/**
 * Handles the stage being resized so that the accessibility DOM translation stays under it with
 * the same dimensions
 * @param {!createjs.Stage} stage - stage that has been registered for accessibility support that
 * has been resized
 */
function resize(stage) {
  if (stage.accessibilityTranslator.rootElem) {
    const camWrapperElem = stage.accessibilityTranslator.rootElem.parentElement.parentElement;
    const { transformStyle } = calcDomStylesFromStage(stage);
    _.keys(transformStyle).forEach((style) => {
      camWrapperElem.style[style] = transformStyle[style];
    });
  } else {
    // handle this function being called before React sets the ref for rootElem
    _.defer(() => {
      resize(stage);
    });
  }
}

/**
 * Takes either an array or a single object and creates the accessibility object for each with the
 * config that's passed
 * @param {Array | Object} configObjects Takes either an array or a single object
 * @returns {Object} returns accessibility object
 */
function register(configObjects) {
  let objects = configObjects;

  if (!Array.isArray(configObjects)) {
    objects = [configObjects];
  }

  const accessiblityObjects = objects.map(
    objectConfig => createAccessibilityObjectForRole(objectConfig),
  );

  return accessiblityObjects.length > 1 ? accessiblityObjects : accessiblityObjects[0];
}

const AccessibilityModule = {
  createAccessibilityObjectForRole,
  register,
  resize,
  ROLES,
  setupStage,
  releaseStage,
};

export { AccessibilityModule as default };
