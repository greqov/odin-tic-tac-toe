'use strict';

(function () {
  function playerFactory(name, mark) {
    // TODO: prompt a name
    return {
      name,
      mark,
    };
  }

  const playerX = playerFactory('Ivan', 'x');
  const playerO = playerFactory('Peter', 'o');

  // TODO: move gameboard into game?
  let gameboard = new Array(9);

  const game = (function () {
    const player = playerX;
    const round = 1;

    function togglePlayer() {
      this.player = this.player === playerO ? playerX : playerO;
    }

    function getWinner() {
      const winCases = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (let i = 0; i < winCases.length; i++) {
        const cells = winCases[i];
        const cellA = gameboard[cells[0]];
        const cellB = gameboard[cells[1]];
        const cellC = gameboard[cells[2]];

        if (cellA !== undefined && cellA === cellB && cellA === cellC) {
          console.log('We have a winner! It is', this.player.name);
          return this.player;
        }
        console.log('No winner for now...');
      }

      // TODO: check tie case (check round counter)
      if (round === 9) {
        console.log('Tie!');
        // TODO: disable game
      }

      return false;
    }

    function makeMove(cell) {
      console.log(`Current player ${this.player.name}, round ${this.round}`);
      if (!gameboard[cell]) {
        gameboard[cell] = this.player.mark;
        // eslint-disable-next-line no-plusplus
        this.round++;
      } else {
        console.log('ERROR: this cell is not empty!');
      }
    }

    function reset() {
      this.round = 1;
      this.player = playerX;
      gameboard = new Array(9);
    }

    return {
      round, // tmp
      player,
      makeMove,
      reset,
      getWinner,
      togglePlayer,
    };
  })();

  const UI = (function () {
    const round = document.querySelector('.round');
    const turn = document.querySelector('.turn');
    const winnerLabel = document.querySelector('.winner');
    const restartBtn = document.querySelector('.restart-btn');

    function updateDisplay() {
      round.textContent = game.round;
      turn.textContent = `${game.player.name} (${game.player.mark})`;
    }

    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        const { idx } = e.target.dataset;
        console.log(333, game.player);
        e.target.textContent = game.player.mark;
        game.makeMove(idx);
        const winner = game.getWinner();
        if (winner) {
          console.log('yay! winner is ', winner);
        } else {
          console.log('no winner, change turn then');
          game.togglePlayer();
        }
        UI.updateDisplay();
      });
    });

    function clearBoard() {
      cells.forEach((cell) => {
        const c = cell;
        c.textContent = '';
      });
    }

    restartBtn.addEventListener('click', () => {
      game.reset();
      UI.clearBoard();
      UI.updateDisplay();
    });

    return {
      updateDisplay,
      clearBoard,
    };
  })();

  // init actions
  UI.updateDisplay();
  console.log(gameboard);
})();
