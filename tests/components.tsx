
import React, { Component } from 'react';
import expandClassesDecorator, { expandClasses } from '../src/index';

interface TestFunctionProps {
  name: string;
  age: number;
}

export class TestFunctionComponent extends Component<TestFunctionProps> {
  render() {
    return expandClasses(<body>
      <section className="User &-active">
        <ul className="&_details">
          <li className="&&_name">
            Name: <span className="&_text &-highlight">{this.props.name}</span>
          </li>
          <li className="&&_age">Age: {this.props.age}</li>
        </ul>
        <div>
          <form className="&_actions">
            <button className="&_action">Poke</button>
          </form>
        </div>
      </section>
    </body>);
  }
}

export class TestDecoratorComponent extends Component<TestFunctionProps> {
  @expandClassesDecorator()
  render() {
    return <body>
      <section className="User &-active">
        <ul className="&_details">
          <li className="&&_name">
            Name: <span className="&_text &-highlight">{this.props.name}</span>
          </li>
          <li className="&&_age">Age: {this.props.age}</li>
        </ul>
        <div>
          <form className="&_actions">
            <button className="&_action">Poke</button>
          </form>
        </div>
      </section>
    </body>;
  }
}
