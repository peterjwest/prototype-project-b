const assert = require('assert');
const { createElement, Component } = require('react');
const { renderToString } = require('react-dom/server');
const { parse } = require('node-html-parser');

const { expandClasses } = require('../build/wrapper.cjs');

describe('expandClasses', () => {
  it('Maps classes in a component', () => {
    class TestFunctionComponent extends Component {
      render() {
        return expandClasses(
          createElement('section', { className: 'User %-active' },
            createElement('ul', { className: '%_details' },
              createElement('li', { className: '%%_name', key: '1' }, [
                'Name: ',
                createElement('span', { className: '%_text %-highlight', key: '1a' }, this.props.name),
              ]),
              createElement('li', { className: '%%_age', key: '2' }, `Age: ${this.props.age}`),
            ),
          ),
          { selector: '%' }
        );
      }
    }

    const element = createElement(TestFunctionComponent, { name: 'Anna', age: 72 }, null);
    const root = parse(renderToString(element));

    assert.strictEqual(root.querySelector('section').attrs.class, 'User User-active');
    assert.strictEqual(root.querySelector('ul').attrs.class, 'User_details');
    assert.strictEqual(root.querySelector('li:nth-child(1)').attrs.class, 'User_name');
    assert.strictEqual(root.querySelector('li:nth-child(2)').attrs.class, 'User_age');
    assert.strictEqual(root.querySelector('span').attrs.class, 'User_name_text User_name_text-highlight');
  });
});
