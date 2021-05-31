import React from 'react';
import lodash from 'lodash';

interface Options {
  selector: string;
  element: string;
  modifier: string;
}

interface Matchers {
  element: string;
  selectorRegex: RegExp;
  elementSelectorRegex: RegExp;
  modifierSelectorRegex: RegExp;
}

export type JsxNode = JSX.Element | string | number;

export const DEFAULT_OPTIONS = {
  selector: '&',
  element: '_',
  modifier: '-',
}

function escapeRegex(string: string) {
  return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}

export function createMatchers(options: Options): Matchers {
  const selector = escapeRegex(options.selector);
  return {
    element: options.element,
    selectorRegex: new RegExp(`^(${selector})+`),
    elementSelectorRegex: new RegExp(`^((${selector})+)${escapeRegex(options.element)}`),
    modifierSelectorRegex: new RegExp(`^((${selector})+)${escapeRegex(options.modifier)}`),
  }
}

export function replaceClass(classAttr: string, matchers: Matchers, baseClass?: string) {
  const classes = classAttr.split(/\s+/).filter((className) => className);
  const newClass = lodash.flatten(classes.map((className) => {

    const elementMatch = className.match(matchers.elementSelectorRegex);
    if (elementMatch) {
      if (baseClass === undefined) {
        throw new Error(`Element "${className}" used without base class`);
      }

      let newBaseClass = baseClass;

      // If parent selector has been used (e.g. $$, $$$, take parent(s) of base classes)
      lodash.times(elementMatch[1].length - 1, () => {
        const index = newBaseClass.lastIndexOf(matchers.element);
        if (index === -1) {
          throw new Error(`Cannot apply parent selector "${className}" to block "${newBaseClass}"`);
        }
        newBaseClass = newBaseClass.slice(0, index);
      });

      // Replace the placeholder $ in the base class
      const fullClass = className.replace(matchers.selectorRegex, newBaseClass);

      baseClass = fullClass;
      return fullClass;
    }

    const modifierMatch = className.match(matchers.modifierSelectorRegex);
    if (modifierMatch) {
      if (baseClass === undefined) {
        throw new Error(`Modifier "${className}" used without base class`);
      }

      if (modifierMatch[1].length > 1) {
        throw new Error(`Cannot use parent select on a modifier "${className}"`);
      }

      // Replace the placeholder $ in the base class
      return className.replace(matchers.selectorRegex, baseClass);
    }

    if (!baseClass) {
      baseClass = className;
    }
    return className;
  })).join(' ');

  return { class: newClass, baseClass: baseClass };
}

function traversePath(node: JsxNode, matchers: Matchers, baseClass?: string) {
  if (!node || typeof node === 'string' || typeof node === 'number') {
    return node;
  }

  const props = Object.assign({}, node.props as { className?: string, children: React.ReactNode[]});

  if (props.className) {
    const replacement = replaceClass(props.className, matchers, baseClass);
    props.className = replacement.class;
    baseClass = replacement.baseClass;
  }

  const children = React.Children.toArray(props.children).filter((child): child is React.ReactElement => {
    return !Array.isArray(child);
  });

  return React.createElement(
    node.type,
    props,
    ...traverseChildren(children, matchers, baseClass),
  );
}

function traverseChildren(children: JsxNode[], matchers: Matchers, baseClass?: string): JsxNode[] {
  return children.map((childNode) => traversePath(childNode, matchers, baseClass));
}

export function expandClasses(node: JsxNode, options: Partial<Options> = {}): JsxNode {
  return traversePath(node, createMatchers({ ...DEFAULT_OPTIONS, ...options }));
}

export default function expandClassesDecorator(options?: Partial<Options>) {
  return <Arg>(target: unknown, name: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value as (...args: Arg[]) => JsxNode;
    descriptor.value = function(...args: Arg[]): JsxNode {
      return expandClasses(original.apply(this, args), options);
    };
    return descriptor;
  }
}
