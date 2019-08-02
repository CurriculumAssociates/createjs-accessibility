import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import AccessibilityTranslator from './AccessibilityTranslator';
import { createAccessibilityObjectForRole } from './RoleObjectFactory';
import { ROLES } from './Roles';

/**
 * Positions the AccessibilityTranslator below the specified stage.
 * @param {createjs.Stage} stage - createjs stage that has been registered for accessibility
 * @param {Function} getComponentRef - Callback function to set a ref to the AccessibilityTranslator
 * @returns {Object} tranlated DOM next to the canvas
 */
function positionElemUnderStage(stage, getComponentRef) {
  // true to put the tranlated DOM next to the canvas (useful for debugging the module),
  // false for the translated DOM to go under it
  const debugPos = false;

  const { canvas } = stage;

  const {
    height,
    width,
    border,
    boxSizing,
    margin,
    padding,
    transform,
    transformOrigin,
  } = getComputedStyle(canvas);

  const moduleStyle = {
    overflow: 'hidden',
    position: 'absolute',
    left: debugPos ? canvas.offsetLeft + parseInt(canvas.getAttribute('width'), 10) : 'auto',
    top: canvas.offsetTop,
    zIndex: debugPos ? 'auto' : -1,
    height,
    width,
    border,
    boxSizing,
    margin,
    padding,
    transform,
    transformOrigin,
  };

  return (
    <div style={moduleStyle}>
      <AccessibilityTranslator stage={stage} ref={getComponentRef} />
    </div>
  );
}

/**
 * Setup accessibility support for a Stage. The AccessibilityTranslator instance will be
 * attached to the provided stage by adding an "accessibilityTranslator" member to the stage.
 * @param {!createjs.Stage} stage - CreateJS Stage to attach the translator
 * @param {!(DOMElement|string)} parentElement - DOM Element or its id to which the DOM
 * translation will be added
 * @param {Function} onReady - An optional function to call when the module is mounted into the
 * parentElement
 */
function setupStage(stage, parentElement, onReady = () => {}) {
  let component;
  const moduleNode = positionElemUnderStage(stage, (c) => { component = c; });

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
    const reactParent = stage.accessibilityTranslator.rootElem.parentElement;
    positionElemUnderStage(reactParent, stage);
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
