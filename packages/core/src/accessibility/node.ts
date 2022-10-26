import { Attributes, Role, RoleTagMapping } from "./aria";

export type NodeOptions<NodeType> = {
  aria?: Attributes;
  element?: HTMLElement;
  node?: NodeType;
  parent?: Node<NodeType>;
  role?: Role;
};

export class Node<NodeType> {
  #aria: Attributes;
  #element: HTMLElement;
  #node: NodeType | undefined;
  #parent: Node<NodeType> | undefined;
  #children: Node<NodeType>[] = [];
  #role: Role;

  constructor(opts: NodeOptions<NodeType>) {
    const { aria = {}, element, node, parent, role = Role.NONE } = opts;

    this.aria = aria;
    this.element =
      element || document.createElement(RoleTagMapping[this.#role]);

    this.node = node;

    if (parent) {
      this.parent = parent;
    }

    this.role = role;
  }

  get aria() {
    return this.#aria;
  }

  set aria(aria) {
    this.#aria = aria;
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
