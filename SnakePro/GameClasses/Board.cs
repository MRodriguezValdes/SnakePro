using WebApplication2.GameClasses.Enums;

namespace WebApplication2.GameClasses;

public class Board
{
    /// <summary>
    /// The game board represented as a 2D array of CellType.
    /// </summary>
    private readonly CellType[][] _board;

    /// <summary>
    /// Random number generator used for generating food positions.
    /// </summary>
    private readonly Random _random = new();

    /// <summary>
    /// Keeps track of the number of food items generated on the game board.
    /// </summary>
    private int _foodCount;

    /// <summary>
    /// Initializes a new instance of the <see cref="Board"/> class.
    /// </summary>
    /// <param name="columns">The number of columns in the game board.</param>
    /// <param name="rows">The number of rows in the game board.</param>
    public Board(int columns, int rows)
    {
        _board = new CellType[columns][];
        _foodCount = 0;
        GenerateBoard(columns, rows);
        FillBoard();
    }

    /// <summary>
    /// Generates the game board with the specified number of columns and rows.
    /// </summary>
    /// <param name="columns">The number of columns in the game board.</param>
    /// <param name="rows">The number of rows in the game board.</param>
    private void GenerateBoard(int columns, int rows)
    {
        for (var i = 0; i < columns; i++)
        {
            _board[i] = new CellType[rows];
        }
    }

    /// <summary>
    /// Fills the game board with empty cells.
    /// </summary>
    private void FillBoard()
    {
        foreach (var row in _board)
        {
            for (var columns = 0; columns < row.Length; columns++)
            {
                row[columns] = CellType.Empty;
            }
        }
    }

    /// <summary>
    /// Checks if the cell at the specified coordinates is valid.
    /// </summary>
    /// <param name="x">The x-coordinate of the cell.</param>
    /// <param name="y">The y-coordinate of the cell.</param>
    /// <returns>True if the cell is valid, false otherwise.</returns>
    private bool IsValidCell(int x, int y)
    {
        return x >= 0 && x < _board.Length && y >= 0 && y < _board[0].Length && _board[x][y] == CellType.Empty;
    }

    /// <summary>
    /// Gets a random valid cell from the game board.
    /// </summary>
    /// <returns>The coordinates of the random valid cell.</returns>
    public (int, int) GetRandomValidCell()
    {
        int x, y;
        do
        {
            x = _random.Next(0, _board.Length);
            y = _random.Next(0, _board[0].Length);
        } while (!IsValidCell(x, y));

        return (x, y);
    }

    /// <summary>
    /// Gets the game board.
    /// </summary>
    /// <returns>The game board.</returns>
    public CellType[][] GetBoard()
    {
        return _board;
    }

    /// <summary>
    /// Generates the specified number of food items on the game board.
    /// </summary>
    /// <remarks>
    /// This method generates a specified number of food items on the game board. 
    /// For every 10th food item generated, a special food item is created instead of a regular one.
    /// The position of the food item is determined by the GetRandomValidCell method, which ensures that the food item is not placed on an occupied cell.
    /// </remarks>
    /// <param name="howMany">The number of food items to generate.</param>
    public void GenerateFood(int howMany)
    {
        // Loop for the specified number of food items to generate
        for (var i = 0; i < howMany; i++)
        {
            // Get a random valid cell on the game board
            var (x, y) = GetRandomValidCell();

            // If the food count is a multiple of 10, generate a special food item
            if (++_foodCount % 10 == 0)
            {
                _board[x][y] = CellType.SpecialFood;
            }
            // Otherwise, generate a regular food item
            else
            {
                _board[x][y] = CellType.Food;
            }
        }
    }

    /// <summary>
    /// Generates the specified number of blocks on the game board.
    /// </summary>
    /// <param name="howMany">The number of blocks to generate.</param>
    public void GenerateBlocks(int howMany)
    {
        // Loop for the specified number of blocks to generate
        for (var i = 0; i < howMany; i++)
        {
            // Get a random valid cell on the game board
            var (x, y) = GetRandomValidCell();

            // Set the cell type to Block
            _board[x][y] = CellType.Block;
        }
    }
}