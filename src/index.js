import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
        <Square
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} />
      );
  }

  render() {
    const rows = Array.from(Array(3), (_, j) => {
      const row = Array.from(Array(3), (_, i) => {
        return (
          this.renderSquare(i + j * 3)
        );
      });
      return (
          <div key={j} className="board-row">{row}</div>
      );
    })

    return (
        <div>{rows}</div>
    );
  }
}

function Toggle(props) {
  return (
      <button onClick={props.onClick}>{props.mostRecentFirst ? 'Antichrono.' : 'Chrono.'}</button>
  );
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      mostRecentFirst: false
    };

    this.changeOrder = this.changeOrder.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
   }

  changeOrder() {
    this.setState(prevState => ({
      mostRecentFirst: !prevState.mostRecentFirst
    }));
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: !(step % 2)
    })
  }

  position(move) {
    return '(' + Math.floor(move / 3 + 1) + ', ' + (move % 3 + 1) + ')';
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      if (this.state.mostRecentFirst) {
        move = history.length - move - 1;
        step = history[move];
      }
      const desc = move ? 'Move @' + this.position(step.move) : 'Game start';
      const fontWeight = this.state.stepNumber === move ? 'bold' : 'normal'

      return (
          <li key={move}>
          <button style={{fontWeight: fontWeight}} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
        );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <Toggle onClick={this.changeOrder} mostRecentFirst={this.state.mostRecentFirst}/>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
