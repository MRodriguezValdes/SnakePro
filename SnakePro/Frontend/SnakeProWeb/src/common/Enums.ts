/**
 * CellType is an enumeration that represents the different types of cells in the game.
 * It has the following values:
 * - Empty: represents an empty cell.
 * - Block: represents a block cell.
 * - Food: represents a food cell.
 * - SpecialFood: represents a special food cell.
 * - SnakeBody: represents a snake body cell.
 * - SnakeHead: represents a snake head cell.
 * - SnakeMouthOpen: represents a snake mouth open cell.
 * - SnakeTail: represents a snake tail cell.
 */
export enum CellType {
  Empty,
  Block,
  Food,
  SpecialFood,
  SnakeBody,
  SnakeHead,
  SnakeMouthOpen,
  SnakeTail
}

/**
 * GameStates is an enumeration that represents the different states of the game.
 * It has the following values:
 * - None: represents the initial state of the game.
 * - Running: represents the state when the game is running.
 * - Paused: represents the state when the game is paused.
 * - GameOver: represents the state when the game is over.
 * - Win: represents the state when the game is won.
 */
export enum GameStates {
  None,
  Running,
  Paused,
  GameOver,
  Win
}

/**
 * Direction is an enumeration that represents the different directions in the game.
 * It has the following values:
 * - Up: represents the up direction.
 * - Down: represents the down direction.
 * - Left: represents the left direction.
 * - Right: represents the right direction.
 */
export enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}
