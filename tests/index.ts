import { describe, it } from 'vitest';
import assert from 'assert';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { parse, HTMLElement } from 'node-html-parser';

import { replaceClass, createMatchers, DEFAULT_OPTIONS } from '../src/index';
import { TestFunctionComponent, TestDecoratorComponent } from './components';

const DEFAULT_MATCHERS = createMatchers(DEFAULT_OPTIONS);

function getElement(root: HTMLElement, selector: string): HTMLElement {
  const element = root.querySelector(selector);
  if (!element) throw Error(`Element "${selector}" not found`);
  return element;
}

describe('replaceClass', () => {
  it('Adds a base block to an element', () => {
    assert.deepStrictEqual(
      replaceClass('&_element', DEFAULT_MATCHERS, 'Block'),
      { baseClass: 'Block_element', class: 'Block_element' },
    );
  });

  it('Adds a block to an element and modifier', () => {
    assert.deepStrictEqual(
      replaceClass('&_element &-modifier', DEFAULT_MATCHERS, 'Block'),
      { baseClass: 'Block_element', class: 'Block_element Block_element-modifier' },
    );
  });

  it('Adds a block to an element and modifier with custom options', () => {
    assert.deepStrictEqual(
      replaceClass('%__element-name %--modifier-name', createMatchers({ selector: '%', element: '__', modifier: '--' }), 'Block'),
      { baseClass: 'Block__element-name', class: 'Block__element-name Block__element-name--modifier-name' },
    );
  });

  it('Adds a block and sub-element to an element and modifier', () => {
    assert.deepStrictEqual(
      replaceClass('&_sub &-modifier', DEFAULT_MATCHERS, 'Block_element'),
      { baseClass: 'Block_element_sub', class: 'Block_element_sub Block_element_sub-modifier' },
    );
  });

  it('Adds a block to a parent element and modifier', () => {
    assert.deepStrictEqual(
      replaceClass('&&_element2 &-modifier', DEFAULT_MATCHERS, 'Block_element'),
      { baseClass: 'Block_element2', class: 'Block_element2 Block_element2-modifier' },
    );
  });

  it('Adds a block to a parent element and modifier with custom options', () => {
    assert.deepStrictEqual(
      replaceClass('%%__element-2 %--modifier', createMatchers({ selector: '%', element: '__', modifier: '--' }), 'Block__element'),
      { baseClass: 'Block__element-2', class: 'Block__element-2 Block__element-2--modifier' },
    );
  });

  it('Does not change normal classes', () => {
    assert.deepStrictEqual(
      replaceClass('&_element someClass &-modifier otherClass', DEFAULT_MATCHERS, 'Block'),
      { baseClass: 'Block_element', class: 'Block_element someClass Block_element-modifier otherClass' },
    );
  });

  it('Throws an error when an element has no base class', () => {
    assert.throws(
      () => replaceClass('&_element', DEFAULT_MATCHERS),
      new Error('Element "&_element" used without base class'),
    );
  });

  it('Throws an error when a modifier has no base class', () => {
    assert.throws(
      () => replaceClass('&-modifier', DEFAULT_MATCHERS),
      new Error('Modifier "&-modifier" used without base class'),
    );
  });

  it('Throws an error using the parent selector when the base class is a block', () => {
    assert.throws(
      () => replaceClass('&&_element', DEFAULT_MATCHERS, 'Block'),
      new Error('Cannot apply parent selector "&&_element" to block "Block"'),
    );
  });

  it('Throws an error using the parent selector with a modifier', () => {
    assert.throws(
      () => replaceClass('&&-modifier', DEFAULT_MATCHERS, 'Block'),
      new Error('Cannot use parent select on a modifier "&&-modifier"'),
    );
  });
});

describe('expandClasses', () => {
  it('Maps classes in a component', () => {
    const element = createElement(TestFunctionComponent, { name: 'Anna', age: 72 }, null);
    const root = parse(renderToString(element));

    assert.strictEqual(getElement(root, 'section').attrs.class, 'User User-active');
    assert.strictEqual(getElement(root, 'ul').attrs.class, 'User_details');
    assert.strictEqual(getElement(root, 'li:nth-child(1)').attrs.class, 'User_name');
    assert.strictEqual(getElement(root, 'li:nth-child(2)').attrs.class, 'User_age');
    assert.strictEqual(getElement(root, 'span').attrs.class, 'User_name_text User_name_text-highlight');
    assert.strictEqual(getElement(root, 'form').attrs.class, 'User_actions');
    assert.strictEqual(getElement(root, 'button').attrs.class, 'User_actions_action');
  });
});

describe('expandClassesDecorator', () => {
  it('Maps classes in a component', () => {
    const element = createElement(TestDecoratorComponent, { name: 'Anna', age: 72 }, null);
    const root = parse(renderToString(element));

    assert.strictEqual(getElement(root, 'section').attrs.class, 'User User-active');
    assert.strictEqual(getElement(root, 'ul').attrs.class, 'User_details');
    assert.strictEqual(getElement(root, 'li:nth-child(1)').attrs.class, 'User_name');
    assert.strictEqual(getElement(root, 'li:nth-child(2)').attrs.class, 'User_age');
    assert.strictEqual(getElement(root, 'span').attrs.class, 'User_name_text User_name_text-highlight');
    assert.strictEqual(getElement(root, 'form').attrs.class, 'User_actions');
    assert.strictEqual(getElement(root, 'button').attrs.class, 'User_actions_action');
  });
});
