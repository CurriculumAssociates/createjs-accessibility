import { Role } from './roles';
import { Attribute } from './roles/attributes';
import { RoleMapping } from './roles/mapping';

export type NodeOptions<NodeType> = {
  attributes?: Attribute;
  element?: HTMLElement;
  node?: NodeType;
  parent?: Node<NodeType>;
  role?: keyof typeof Role;
};

export class Node<NodeType> {
  // pull type from RoleMapping
  #attributes: Attribute;

  // pull tag from RoleMapping
  #element: HTMLElement;
  #node: NodeType | undefined;
  #parent: Node<NodeType> | undefined;

  // pull children from RoleMapping
  #children: Node<NodeType>[] = [];

  #role: keyof typeof Role;

  constructor(opts: NodeOptions<NodeType>) {
    const { attributes = { role: Role.none}, element, node, parent } = opts;

    this.attributes = attributes;

    
    const tag = RoleMapping[this.role].tag;

    this.element =
      element || document.createElement(typeof tag === 'string' ? tag : tag(attributes, parent));

    this.node = node;

    if (parent) {
      this.parent = parent;
    }
  }

  get attributes() {
    return this.#attributes;
  }

  set attributes(attributes) {
    this.#attributes = attributes;
  }

  get element() {
    return this.#element;
  }

  set element(element) {
    this.#element = element;
  }

  get node() {
    return this.#node;
  }

  set node(node) {
    this.#node = node;
  }

  get parent() {
    return this.#parent;
  }

  set parent(parent) {
    const idx = this.#parent?.children.indexOf(this);
    if (idx !== undefined && idx > -1) {
      this.#parent?.children.splice(idx, 1);
      this.#parent?.element.removeChild(this.#element);
    }

    this.#parent = parent;
    parent.children.push(this);
    this.#parent.element.appendChild(this.#element);
  }

  get children() {
    return this.#children;
  }

  get role() {
    return this.#role;
  }

  set role(role) {
    this.#role = role;
  }
}
