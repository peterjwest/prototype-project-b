# jsx-bem-classes

A utility for writing more concise [BEM](http://getbem.com/) style classes in React.

Instead of writing this:

<!-- snippet: tsx,mjsx -->
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

<!-- snippet: tsx,mjsx -->
```tsx
import React from 'react';
import { expandClasses } from 'jsx-bem-classes';

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

By default this uses a slightly unusual version of BEM, assuming [camel case classes](https://en.bem.info/methodology/naming-convention/#camelcase-style), which is more concise and more legible in my opinion.

If you want to use the original BEM style you can:

<!-- snippet: tsx,mjsx -->
```tsx
import React from 'react';
import { expandClasses } from 'jsx-bem-classes';

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

<!-- snippet: tsx,mjsx -->
```tsx
import React from 'react';
import { expandClasses } from 'jsx-bem-classes';

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
import expandClasses from 'jsx-bem-classes';

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

You can also use the utility with CommonJS and without JSX support:

<!-- snippet: cjs -->
```js
const React = require('react');
const { expandClasses } = require('jsx-bem-classes');

class Component extends React.Component {
  render() {
    const name = 'Anna', age = 42;
    return expandClasses(
      React.createElement('ul', { className: '%_details' },
        React.createElement('li', { className: '%%_name' }, [
          'Name: ',
          React.createElement('span', { className: '%_smallText %-highlight' }),
        ]),
        React.createElement('li', { className: '%%_age_' }, `Age: ${age}`),
      ),
      { selector: '%' }
    );
  }
}
```

## TODO

- Build process
- CI
