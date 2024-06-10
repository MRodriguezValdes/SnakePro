namespace WebApplication2.GameClasses.Enums;

/// <summary>
/// Represents the type of cell in the game board.
/// </summary>
public enum CellType
{
    /// <summary>
    /// An empty cell, where the snake can move.
    /// </summary>
    Empty,

    /// <summary>
    /// A block cell, where the snake cannot move.
    /// </summary>
    Block,

    /// <summary>
    /// A food cell, which the snake can eat to grow.
    /// </summary>
    Food,
    
    /// <summary>
    ///  A special food cell, which the snake can eat to grow faster.
    /// </summary>
    SpecialFood,

    /// <summary>
    /// A snake cell, representing a part of the snake.
    /// </summary>
    SnakeBody,

    /// <summary>
    /// A snake cell, representing the head of the snake.
    /// </summary>
    SnakeHead,

    /// <summary>
    /// A snake cell, representing the head of the snake with the mouth open.
    /// </summary>
    SnakeMouthOpen,

    /// <summary>
    /// A snake cell, representing the tail of the snake.
    /// </summary>
    SnakeTail
}