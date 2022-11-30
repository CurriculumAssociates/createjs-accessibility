import { Attributes, createElement, EventListeners } from "../../dom";
import { AriaRole, RoleMapping } from "./roleMapping";

export interface ElementFromRoleCreationOptions {
  nodeRole: AriaRole;
  nodeAttributes: Attributes;
  nodeEventListeners: EventListeners;
}

export function createElementFromRole(
  options: ElementFromRoleCreationOptions
): HTMLElement {
  const { nodeRole, nodeAttributes } = options;

  const { tagName, allowedAttributes, allowedChildren, requiredAttributes } =
    RoleMapping[nodeRole];

  const definedAttributes = Object.keys(nodeAttributes);

  const missingRequiredAttributes = difference(
    definedAttributes,
    requiredAttributes
  );

  if (missingRequiredAttributes.length) {
    throw new Error(
      `Attempted to create ${nodeRole} without required attribute(s) "${missingRequiredAttributes.join(
        '", "'
      )}" only found attribute(s) "${definedAttributes.join('", "')}"`
    );
  }

  const unallowedAttributes = difference(
    definedAttributes,
    requiredAttributes.concat(allowedAttributes)
  );

  if (unallowedAttributes.length) {
    throw new Error(
      `Attempted to create ${nodeRole} with unallowed attribute(s) "${unallowedAttributes.join(
        '", "'
      )}", ${nodeRole} only allows for "${allowedAttributes.join('", "')}"`
    );
  }

  const element = createElement({
    tagName: tagName instanceof Function ? tagName(nodeAttributes) : tagName,
    properties: nodeAttributes,
  });

  return element;
}

// Use lodash and compact
const difference = (arr1, arr2) =>
  arr1
    .filter((x) => x === undefined)
    .filter((x) => !arr2.filter((y) => y === undefined).includes(x));