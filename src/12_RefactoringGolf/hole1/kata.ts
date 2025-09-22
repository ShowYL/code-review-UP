/* eslint-disable */

const topRow = 0;
const middleRow = 1;
const bottomRow = 2;
const leftColumn = 0;
const centerColumn = 1;
const rightColumn = 2;

const playerO = 'O';
const emptyMark = ' ';

export class Game {
  private _lastSymbol = emptyMark;
  private _grid: Grid = new Grid();

  public Play(symbol: string, x: number, y: number): void {
    this.validateFirstMove(symbol);
    this.validatePlayer(symbol);
    this.validatePositionIsEmpty(x, y);

    this.updateLastPlayer(symbol);
    this.updateGrid(symbol, x, y);
  }

  private validateFirstMove(player: string) {
    if (this._lastSymbol == emptyMark) {
      if (player == playerO) {
        throw new Error('Invalid first player');
      }
    }
  }

  private validatePlayer(player: string) {
    if (player == this._lastSymbol) {
      throw new Error('Invalid next player');
    }
  }

  private validatePositionIsEmpty(x: number, y: number) {
    if (this._grid.CellAt(x, y).isNotEmpty) {
      throw new Error('Invalid position');
    }
  }

  private updateLastPlayer(player: string) {
    this._lastSymbol = player;
  }

  private updateGrid(player: string, x: number, y: number) {
    this._grid.PlaceMarkAt(player, x, y);
  }

  public Winner(): string {
    return this._grid.findWinningRow();
  }
}

class Cell {
  private x: number = 0;
  private y: number = 0;
  private mark: string = ' ';

  constructor(x: number, y: number, mark: string) {
    this.x = x;
    this.y = y;
    this.mark = mark;
  }

  get Mark() {
    return this.mark;
  }

  get isNotEmpty() {
    return this.Mark !== emptyMark;
  }

  hasSameMarkAs(other: Cell) {
    return this.Mark === other.Mark;
  }

  hasSameCoordinatesAs(other: Cell) {
    return this.x == other.x && this.y == other.y;
  }

  updateMark(newMark: string) {
    this.mark = newMark;
  }
}

class Grid {
  private _cells: Cell[] = [];

  constructor() {
    for (let x = topRow; x <= bottomRow; x++) {
      for (let y = leftColumn; y <= rightColumn; y++) {
        this._cells.push(new Cell(x, y, emptyMark));
      }
    }
  }

  public CellAt(x: number, y: number): Cell {
    return this._cells.find((c: Cell) => c.hasSameCoordinatesAs(new Cell(x, y, emptyMark)))!;
  }

  public PlaceMarkAt(mark: string, x: number, y: number): void {
    this._cells
      .find((c: Cell) => c.hasSameCoordinatesAs(new Cell(x, y, mark)))!
      .updateMark(mark);
  }

  public findWinningRow(): string {
    if (this.isRowFull(topRow) && this.isRowWin(topRow)) {
      return this.CellAt(topRow, leftColumn)!.Mark;
    }

    if (this.isRowFull(middleRow) && this.isRowWin(middleRow)) {
      return this.CellAt(middleRow, leftColumn)!.Mark;
    }

    if (this.isRowFull(bottomRow) && this.isRowWin(bottomRow)) {
      return this.CellAt(bottomRow, leftColumn)!.Mark;
    }

    return emptyMark;
  }

  private isRowFull(row: number) {
    return (
      this.CellAt(row, leftColumn)!.isNotEmpty &&
      this.CellAt(row, centerColumn)!.isNotEmpty &&
      this.CellAt(row, rightColumn)!.isNotEmpty
    );
  }

  private isRowWin(row: number) {
    return (
      this.CellAt(row, leftColumn)!.hasSameMarkAs(this.CellAt(row, centerColumn)!) &&
      this.CellAt(row, rightColumn)!.hasSameMarkAs(this.CellAt(row, centerColumn)!)
    );
  }
}
