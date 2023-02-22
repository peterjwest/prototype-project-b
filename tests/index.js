import assert from 'assert';
import React from 'react';
import ReactDom from 'react-dom/server';
import parser from 'node-html-parser';

import { expandClasses } from '../build/code/index.js';

describe('expandClasses', () => {
  it('Maps classes in a component', () => {
    class TestFunctionComponent extends React.Component {
      render() {
        return expandClasses(
          React.createElement('section', { className: 'User %-active' },
            React.createElement('ul', { className: '%_details' },
              React.createElement('li', { className: '%%_name' }, [
                'Name: ',
                React.createElement('span', { className: '%_text %-highlight' }, this.props.name),
              ]),
              React.createElement('li', { className: '%%_age' }, `Age: ${this.props.age}`),
            ),
          ),
          { selector: '%' }
        );
      }
    }

    const element = React.createElement(TestFunctionComponent, {name: 'Anna', age: 72}, null);
    const root = parser.parse(ReactDom.renderToString(element));

    assert.strictEqual(root.querySelector('section').attrs.class, 'User User-active');
    assert.strictEqual(root.querySelector('ul').attrs.class, 'User_details');
    assert.strictEqual(root.querySelector('li:nth-child(1)').attrs.class, 'User_name');
    assert.strictEqual(root.querySelector('li:nth-child(2)').attrs.class, 'User_age');
    assert.strictEqual(root.querySelector('span').attrs.class, 'User_name_text User_name_text-highlight');
  });
})
