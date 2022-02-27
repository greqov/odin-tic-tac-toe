'use strict';

(function () {
  // TODO: play against AI
  function playerFactory(name, mark) {
    return { name, mark };
  }

  const game = (function () {
    const winner = false;
    const gameboard = new Array(9);
    // TODO: pick/change who is the first player?
    let player;
    const round = 1;

    function init(player1, player2) {
      this.playerX = player1;
      this.playerO = player2;
      this.player = this.playerX;
    }

    function togglePlayer() {
      this.player = this.player === this.playerO ? this.playerX : this.playerO;
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

        // TODO: use .every() somehow?
        if (cellA !== undefined && cellA === cellB && cellA === cellC) {
          this.winner = this.player;
          this.winner.cells = cells;
          return;
        }
      }

      if (this.round === 10) {
        this.winner = 'Tie!';
      }
    }

    function makeMove(cell) {
      this.gameboard[cell] = this.player.mark;
      // eslint-disable-next-line no-plusplus
      this.round++;
    }

    function reset() {
      this.round = 1;
      this.player = this.playerX;
      this.winner = false;
      this.gameboard = new Array(9);
    }

    return {
      gameboard,
      round, // tmp
      player,
      winner,
      init,
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
    const newGameBtn = document.querySelector('.js-new-game-btn');
    const restartBtn = document.querySelector('.js-restart-btn');
    const gameForm = document.querySelector('.js-game-form');
    const cancelBtn = document.querySelector('.js-cancel-form-btn');
    const startBtn = document.querySelector('.js-start-game-btn');

    function updateTextLabels() {
      round.textContent = game.round;
      const { player } = game;
      turn.textContent = player ? `${game.player.name} (${game.player.mark})` : '...';

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
              game.togglePlayer();
            } else {
              // TODO: refactor as UI method?
              const winCells = game.winner.cells;
              if (winCells) {
                winCells.forEach((index) => {
                  document.querySelector(`[data-idx="${index}"]`).classList.add('is-win');
                });
              }
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
        c.classList.remove('is-win');
      });
    }

    restartBtn.addEventListener('click', () => {
      if (!game.player) return;
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

      const playerX = playerFactory(nameX, 'x');
      const playerO = playerFactory(nameO, 'o');

      // TODO: disable game before init()
      game.init(playerX, playerO);
      UI.updateTextLabels();
      // TODO: clear game form with .reset()
    });

    function resetForm() {
      gameForm.reset();
      nameOInput.removeAttribute('disabled');
    }

    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetForm();
      // TODO: close modal? in case of modal
    });

    newGameBtn.addEventListener('click', () => {
      resetForm();
      game.reset();
      game.player = '';
      UI.clearBoard();
      UI.updateTextLabels();
      // TODO: open a modal then?
    });

    return {
      clearBoard,
      updateTextLabels,
    };
  })();
})();
