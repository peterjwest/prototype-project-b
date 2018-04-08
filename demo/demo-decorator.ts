import { createElement, Component } from 'react';
import expandClassesDecorator from '../index';
import { renderToString } from 'react-dom/server';
import { html as beautifyHtml } from 'js-beautify';

interface DemoProps {
  name: string;
  age: number;
}

class Demo extends Component<DemoProps> {
  @expandClassesDecorator
  render() {
    return createElement('ul', {className: 'Demo &-active'},
      createElement('li', {className: '&_name'},
        'Name: ',
        createElement('span', {className: '&_text &-highlight'}, this.props.name),
      ),
      createElement('li', {className: '&_age'}, `Age: ${this.props.age}`),
    );
  }
}

const html = renderToString(createElement(Demo, {name: 'Anna', age: 72}, null));
console.log(beautifyHtml(html));
