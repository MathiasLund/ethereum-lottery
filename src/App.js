import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */});
      } catch (error) {
        // User denied account access...
      }
    }

    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    console.log(players);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'Done!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>Manager: {this.state.manager}</p>
        <p>{this.state.players.length} players are competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Put in 0.01 Ether to enter Lottery</h4>
          <div>
            <label></label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Pick a winner (as a manager)</h4>
        <button onClick={this.onClick}>Pick a winner</button>

        <hr />

        <h1>{this.state.message}</h1>

      </div>
    );
  }
}

export default App;
