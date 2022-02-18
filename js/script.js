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

  const gameboard = (function () {
    return new Array(9);
  })();

  const game = (function () {
    let player = playerX;
    let round = 1;

    function togglePlayer() {
      player = player === playerO ? playerX : playerO;
    }

    function checkForWinner() {
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
          console.log('We have a winner! It is', player.name);
          return;
        }
        console.log('No winner for now...');
      }

      // TODO: check tie case (check round counter)
      if (round === 9) {
        console.log('Tie!');
        // TODO: disable game
      }
    }

    function makeMove(cell) {
      console.log(`Current player ${player.name}, round ${round}`);
      if (!gameboard[cell]) {
        gameboard[cell] = player.mark;
        // eslint-disable-next-line no-plusplus
        round++;
        checkForWinner();
        togglePlayer();
      } else {
        console.log('ERROR: this cell is not empty!');
      }
    }

    return {
      player,
      makeMove,
    };
  })();

  // init actions
  console.log(game.player);
  game.makeMove(0);
  console.log(game.player);
  game.makeMove(6);
  console.log(game.player);
  game.makeMove(2);
  game.makeMove(8);
  game.makeMove(3);
  game.makeMove(7);
  console.log(gameboard);
})();
