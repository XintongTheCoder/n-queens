/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function (n) {
  const config = {
    findAllSolutions: false,
    checkDiagonal: false,
  };
  var solution = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  this._backtracking(0, n, solution, config);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// backtracking will return 1 if found a solution, 0 if no solution
window._backtracking = function (i, n, solution, config) {
  if (i === n) {
    return 1;
  }
  if (config.findAllSolutions) {
    // Need to find all solutions
    return _.range(0, n).reduce((accum, j) => {
      if (!_canPlace(i, j, n, solution, config.checkDiagonal)) {
        return accum;
      }
      solution[i][j] = 1;
      const result = _backtracking(i + 1, n, solution, config);
      solution[i][j] = 0; // solution matrix will be reset regardless of whether found a valid solution

      return accum + result;
    }, 0);
  }
  // Only need to find one solution
  return _.range(0, n).some((j) => {
    if (!_canPlace(i, j, n, solution, config.checkDiagonal)) {
      return 0;
    }
    solution[i][j] = 1;
    const result = _backtracking(i + 1, n, solution, config);
    solution[i][j] = result ? 1 : 0; // solution matrix will only be reset in case of no valid solution found

    return result;
  });
};

window._canPlace = function (rowIndex, colIndex, n, solution, checkDiagonal) {
  // Check col
  const conflictInCol = _.range(0, rowIndex).some(
    (i) => solution[i][colIndex] === 1
  );
  if (conflictInCol) {
    return false;
  }
  if (!checkDiagonal) {
    return true;
  }
  // Check diagonal
  for (let i = 1; i <= rowIndex; i++) {
    if (colIndex + i < n && solution[rowIndex - i][colIndex + i]) {
      return false;
    }
    if (colIndex - i >= 0 && solution[rowIndex - i][colIndex - i]) {
      return false;
    }
  }
  return true;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function (n) {
  const config = {
    findAllSolutions: true,
    checkDiagonal: false,
  };
  var solutionCount = 0;
  var solution = Array(n)
    .fill()
    .map(() => Array(n).fill(0));
  // backtracking will return true if found a solution

  solutionCount = this._backtracking(0, n, solution, config);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function (n) {
  const config = {
    findAllSolutions: false,
    checkDiagonal: true,
  };
  var solution = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  this._backtracking(0, n, solution, config);

  console.log(
    'Single solution for ' + n + ' queens:',
    JSON.stringify(solution)
  );
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function (n) {
  const config = {
    findAllSolutions: true,
    checkDiagonal: true,
  };
  var solutionCount = 0;
  var solution = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  solutionCount = this._backtracking(0, n, solution, config);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
