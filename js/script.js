'use strict';

(function () {
  // TODO: play against AI
  function playerFactory(name, mark) {
    // TODO: how to set up a prototype? do I need to set it at all?
    const player = Object.create(playerFactory.prototype);
    player.name = name;
    player.mark = mark;
    // TODO: prompt a name
    return player;
  }

  playerFactory.prototype.setName = () => console.log('factory method in action');

  const playerX = playerFactory('Ivan', 'x');
  console.log(playerX);
  console.log(playerX.setName());
  const playerO = playerFactory('Peter', 'o');

  const game = (function () {
    const winner = false;
    const gameboard = new Array(9);
    // TODO: pick/change who is the first player?
    const player = playerX;
    const round = 1;

    function togglePlayer() {
      this.player = this.player === playerO ? playerX : playerO;
    }

    function getWinner() {
      // TODO: highlight win row
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
        const cellA = this.gameboard[cells[0]];
        const cellB = this.gameboard[cells[1]];
        const cellC = this.gameboard[cells[2]];

        if (cellA !== undefined && cellA === cellB && cellA === cellC) {
          console.log('We have a winner! It is', this.player.name);
          this.winner = this.player;
          return;
        }
      }

      if (this.round === 10) {
        this.winner = 'Tie!';
      }
    }

    function makeMove(cell) {
      console.log(`Current player ${this.player.name}, round ${this.round}`);
      this.gameboard[cell] = this.player.mark;
      // eslint-disable-next-line no-plusplus
      this.round++;
    }

    function reset() {
      this.round = 1;
      this.player = playerX;
      this.winner = false;
      this.gameboard = new Array(9);
    }

    return {
      gameboard,
      round, // tmp
      player,
      winner,
      makeMove,
      reset,
      getWinner,
      togglePlayer,
    };
  })();

  const UI = (function () {
    // TODO: remove round from UI
    const round = document.querySelector('.round');
    const turn = document.querySelector('.turn');
    const winnerLabel = document.querySelector('.winner');
    const restartBtn = document.querySelector('.js-restart-btn');
    const cancelBtn = document.querySelector('.js-cancel-form-btn');
    const startBtn = document.querySelector('.js-start-game-btn');

    function updateTextLabels() {
      round.textContent = game.round;
      turn.textContent = `${game.player.name} (${game.player.mark})`;

      let txt = '...';
      if (game.winner) {
        txt = game.winner.name || game.winner;
      }
      winnerLabel.textContent = txt;
    }

    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        if (!game.winner) {
          const { idx } = e.target.dataset;
          if (!cell.textContent) {
            e.target.textContent = game.player.mark;
            game.makeMove(idx);
            game.getWinner();
            if (!game.winner) {
              console.log('no winner, change turn then');
              game.togglePlayer();
            }
            UI.updateTextLabels();
          } else {
            console.log('ERROR: cell is not empty!');
          }
        }
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
      UI.updateTextLabels();
    });

    const gameModeInputs = document.querySelectorAll('input[name="gameMode"]');
    const nameXInput = document.querySelector('input[name="nameX"]');
    const nameOInput = document.querySelector('input[name="nameO"]');

    gameModeInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        const { value } = e.target;

        if (value === 'bot') {
          nameOInput.setAttribute('disabled', true);
        } else {
          nameOInput.removeAttribute('disabled');
        }
      });
    });

    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nameX = nameXInput.value || 'Ivan';
      const nameO = nameOInput.value || 'Peter';
      const gameMode = document.querySelector('input[name="gameMode"]:checked').value;
      console.log({ nameX, nameO, gameMode });
    });

    return {
      clearBoard,
      updateTextLabels,
    };
  })();

  // init actions
  UI.updateTextLabels();
  console.log(game.gameboard);
})();
