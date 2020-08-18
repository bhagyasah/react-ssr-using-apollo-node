import React from 'react';

class App extends React.Component {
  state = {};

  butonClickHandler = () => {
    this.setState({ test: 1 })
  }

  render() {
    console.log('this state', this.state);
    return(
      <div>
        <button onClick={this.butonClickHandler}>Click me</button>
        <span>{this.state.test}</span>
      </div>

    )
  }
}
export default App;
