// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function () {
  window.Board = Backbone.Model.extend({
    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log(
          'Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:'
        );
        console.log(
          '\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: grey;'
        );
        console.log(
          '\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: grey;'
        );
      } else if (params.hasOwnProperty('n')) {
        // Input is {n: xxx}
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        // Input is a matrix
        this.set('n', params.length);
      }
    },

    rows: function () {
      return _(_.range(this.get('n'))).map(function (rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function (rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex];
      // this.get(rowIndex)[colIndex] ^= 1;
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function () {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(
          this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)
        ) ||
        this.hasMinorDiagonalConflictAt(
          this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex)
        )
      );
    },

    hasAnyQueensConflicts: function () {
      return (
        this.hasAnyRooksConflicts() ||
        this.hasAnyMajorDiagonalConflicts() ||
        this.hasAnyMinorDiagonalConflicts()
      );
    },

    _isInBounds: function (rowIndex, colIndex) {
      return (
        0 <= rowIndex &&
        rowIndex < this.get('n') &&
        0 <= colIndex &&
        colIndex < this.get('n')
      );
    },

    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

*/
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function (i) {
      return (
        _.reduce(
          this.get(i),
          (accum, element) => {
            return accum + (element === 1 ? 1 : 0);
          },
          0
        ) >= 2
      );
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function () {
      return _.some(
        this.attributes,
        (row, i, matrix) => {
          if (i < this.attributes.n) {
            return this.hasRowConflictAt(i);
          }
        },
        this
      );
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function (j) {
      return (
        _.reduce(
          this.attributes,
          (accum, row) => {
            return accum + (row[j] === 1 ? 1 : 0);
          },
          0
        ) >= 2
      );
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function () {
      return _.some(
        this.attributes,
        (row, i) => {
          if (i < this.attributes.n) {
            return this.hasColConflictAt(i);
          }
        },
        this
      );
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function (majorDiagonalColumnIndexAtFirstRow) {
      var n = this.get('n');
      let count = 0;
      for (
        let i = 0, j = majorDiagonalColumnIndexAtFirstRow;
        i < n && j < n;
        i++, j++
      ) {
        if (j >= 0) {
          count += this.get(i)[j] === 1 ? 1 : 0;
        }
      }
      return count >= 2;
    },

    // test if any major diagonals on this board contain conflicts
    // Scan from [0][n - 2] to [0][0], then from [1][0] to [n - 2][0]
    hasAnyMajorDiagonalConflicts: function () {
      var n = this.get('n');
      return _.range(-n + 1, n).some((j) => {
        return this.hasMajorDiagonalConflictAt(j);
      });
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function (minorDiagonalColumnIndexAtFirstRow) {
      var n = this.get('n');
      let count = 0;
      for (
        let i = 0, j = minorDiagonalColumnIndexAtFirstRow;
        i < n && j >= 0;
        i++, j--
      ) {
        if (j < n) {
          count += this.get(i)[j] === 1 ? 1 : 0;
        }
      }
      return count >= 2;
    },

    // test if any minor diagonals on this board contain conflicts
    // Scan from [0][1] to [0][n - 1], then from [1][n - 1] to [n - 2][n - 1]
    hasAnyMinorDiagonalConflicts: function () {
      var n = this.get('n');
      return _.range(0, 2 * n - 1).some((j) => {
        return this.hasMinorDiagonalConflictAt(j);
      });
    },

    /*--------------------  End of Helper Functions  ---------------------*/
  });

  var makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return _(_.range(n)).map(function () {
        return 0;
      });
    });
  };
})();
