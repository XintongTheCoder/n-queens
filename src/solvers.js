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
  var solution = Array(n)
    .fill()
    .map(() => Array(n).fill(0));
  // backtracking will return true if found a solution
  var backtracking = (i) => {
    if (i === n) {
      return true;
    }
    return _.range(0, n).some((j) => {
      if (!_canPlace(i, j, solution, false)) {
        return false;
      }
      solution[i][j] = 1;
      const result = backtracking(i + 1);
      solution[i][j] = result ? 1 : 0;

      return result;
    });
  };

  backtracking(0);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

window._canPlace = function (rowIndex, colIndex, solution, checkDiagonal) {
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
  var solutionCount = 0;
  var solution = Array(n)
    .fill()
    .map(() => Array(n).fill(0));
  // backtracking will return true if found a solution
  var backtracking = (i) => {
    if (i === n) {
      return 1;
    }
    return _.range(0, n).reduce((accum, j) => {
      if (!_canPlace(i, j, solution, false)) {
        return accum;
      }
      solution[i][j] = 1;
      const result = backtracking(i + 1);
      solution[i][j] = 0;

      return accum + result;
    }, 0);
  };

  solutionCount = backtracking(0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function (n) {
  var solution = undefined; //fixme

  console.log(
    'Single solution for ' + n + ' queens:',
    JSON.stringify(solution)
  );
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function (n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
