import { createElement, Children } from 'react';
import { times, flatten } from 'lodash';

export type JsxNode = JSX.Element | string | number;

function replaceClass(classAttr: string, baseClass?: string) {
  const classes = classAttr.split(/\s+/).filter((className) => className);
  const newClass = flatten(classes.map((className) => {
    const elementOrModifierMatch = className.match(/^(&+)([_-])/);
    // If an element or modifier
    if (elementOrModifierMatch) {
      if (baseClass === undefined) {
        throw new Error('Element or modifier used without block');
      }

      let newBaseClass = baseClass;

      // If parent selector has been used (e.g. $$, $$$, take parent(s) of base classes)
      times(elementOrModifierMatch[1].length - 1, () => {
        newBaseClass = newBaseClass.replace(/[_][^_]+$/, '');
      });

      // Replace the placeholder $ in the base class
      const fullClass = className.replace(/^&+/, newBaseClass);

      // If this is an element then replace the base class
      if (elementOrModifierMatch[2] === '_') {
        baseClass = fullClass;
      }

      return fullClass;
    }
    // If a block, replace the base class
    else {
      baseClass = className;
      return className;
    }
  })).join(' ');

  return { class: newClass, baseClass: baseClass };
}

// We lose type information about nodes in order to support preact
function traversePath(node: JsxNode, baseClass?: string) {
  if (!node || typeof node === 'string' || typeof node === 'number') {
    return node;
  }

  const props = Object.assign({}, node.props);

  if (props.className) {
    const replacement = replaceClass(props.className, baseClass);
    props.className = replacement.class;
    baseClass = replacement.baseClass;
  }

  const children = Children.toArray(props.children);

  return createElement(
    node.type,
    props,
    ...traverseChildren(children, baseClass),
  );
}

function traverseChildren(children: JsxNode[] = [], baseClass?: string): JsxNode[] {
  return children.map((childNode: any) => traversePath(childNode, baseClass));
}

export function expandClasses(node: JsxNode): JsxNode {
  return traversePath(node);
}

export default function expandClassesDecorator(target: Object, name: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    return expandClasses(original.apply(this, args));
  };
  return descriptor;
}
