# react-bem-classes [![npm version][npm-badge]][npm-url] [![build status][circle-badge]][circle-url] [![coverage status][coverage-badge]][coverage-url]

A utility for writing more concise [BEM](http://getbem.com/) style classes in React.

Instead of writing this:

<!-- snippet: tsx,jsx -->
```tsx
import React from 'react';

class Component extends React.Component {
  render() {
    const name = 'Anna', age = 42;
    return <section className="User User-active">
      <ul className="User_details">
        <li className="User_name">
          Name: <span className="User_name_smallText User_name_smallText-highlight">{name}</span>
        </li>
        <li className="User_age italic">Age: {age}</li>
      </ul>
      <form className="User_details_actions">
        <button className="User_details_action">Poke</button>
      </form>
    </section>;
  }
}
```

You can write this:

<!-- snippet: tsx,jsx -->
```tsx
import React from 'react';
import { expandClasses } from '@peterjwest/react-bem-classes';

class Component extends React.Component {
  render() {
    const name = 'Anna', age = 42;
    return expandClasses(<section className="User &-active">
      <ul className="&_details">
        <li className="&&_name">
          Name: <span className="&_smallText &-highlight">{name}</span>
        </li>
        <li className="&&_age italic">Age: {age}</li>
      </ul>
      <form className="&_actions">
        <button className="&_action">Poke</button>
      </form>
    </section>);
  }
}
```

The current block and any elements are prepended onto each class with a selector character `&`. Using two selector characters (e.g. `&&`) ignores the last current element, which allows more flexible nesting (You can use more selector characters to ignore more elements).

By default this uses the [React BEM style](https://en.bem.info/methodology/naming-convention/#react-style), which is more concise and more legible in my opinion.

If you want to use the original BEM style you can customise the delimiters:

<!-- snippet: tsx,jsx -->
```tsx
import React from 'react';
import { expandClasses } from '@peterjwest/react-bem-classes';

const expandClassesClassic = (input) => expandClasses(input, { element: '__', modifier: '--' });

class Component extends React.Component {
  render() {
    const name = 'Anna', age = 42;
    return expandClassesClassic(<section className="User &--active">
      <ul className="&__details">
        <li className="&&__name">
          Name: <span className="&__small-text &--highlight">{name}</span>
        </li>
        <li className="&&__age italic">Age: {age}</li>
      </ul>
    </section>);
  }
}
```

You can also change the selector character:

<!-- snippet: tsx,jsx -->
```tsx
import React from 'react';
import { expandClasses } from '@peterjwest/react-bem-classes';

class Component extends React.Component {
  render() {
    const name = 'Anna', age = 42;
    return expandClasses(<section className="User %-active">
      <ul className="%_details">
        <li className="%%_name">
          Name: <span className="%_smallText %-highlight">{name}</span>
        </li>
        <li className="%%_age italic">Age: {age}</li>
      </ul>
    </section>, { selector: '%' });
  }
}
```

If you're using Typescript, you can instead use the decorator:

<!-- snippet: tsx -->
```tsx
import React from 'react';
import expandClasses from '@peterjwest/react-bem-classes';

class Component extends React.Component {
  @expandClasses({ selector: '%' })
  render() {
    const name = 'Anna', age = 42;
    return <section className="User %-active">
      <ul className="%_details">
        <li className="%%_name">
          Name: <span className="%_smallText %-highlight">{name}</span>
        </li>
        <li className="%%_age italic">Age: {age}</li>
      </ul>
    </section>;
  }
}
```

You can also use the utility with CommonJS and/or without JSX support:

<!-- snippet: cjs -->
```js
const { createElement, Component } = require('react');
const { expandClasses } = require('@peterjwest/react-bem-classes');

class SomeComponent extends Component {
  render() {
    const name = 'Anna', age = 42;
    return expandClasses(
      createElement('section', { className: 'User %-active' },
        createElement('ul', { className: '%_details' },
          createElement('li', { className: '%%_name' }, [
            'Name: ',
            createElement('span', { className: '%_smallText %-highlight' }),
          ]),
          createElement('li', { className: '%%_age_' }, `Age: ${age}`),
        ),
      ),
      { selector: '%' }
    );
  }
}
```

[npm-badge]: https://badge.fury.io/js/%40peterjwest%2Freact-bem-classes.svg
[npm-url]: https://www.npmjs.com/package/@peterjwest/react-bem-classes

[circle-badge]: https://circleci.com/gh/peterjwest/react-bem-classes.svg?style=shield
[circle-url]: https://circleci.com/gh/peterjwest/react-bem-classes

[coverage-badge]: https://coveralls.io/repos/peterjwest/react-bem-classes/badge.svg?branch=main&service=github
[coverage-url]: https://coveralls.io/github/peterjwest/react-bem-classes?branch=main
