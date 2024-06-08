using WebApplication2.GameClasses.Enums;

namespace WebApplication2.GameClasses.Snake;

public class Snake
{
    /// <summary>
    /// Linked list of nodes representing the snake.
    /// </summary>
    private readonly LinkedList<SnakeNode?> _nodes;

    /// <summary>
    /// Linked list of nodes representing the snake.
    /// </summary>
    public SnakeNode? Head => _nodes.First?.Value;

    /// <summary>
    /// Gets the tail of the snake.
    /// </summary>
    public SnakeNode? Tail => _nodes.Last?.Value;

    /// <summary>
    /// Initializes a new instance of the <see cref="Snake"/> class.
    /// </summary>
    /// <param name="startX">The starting x-coordinate of the snake.</param>
    /// <param name="startY">The starting y-coordinate of the snake.</param>
    public Snake(int startX, int startY)
    {
        _nodes = new LinkedList<SnakeNode?>();
        _nodes.AddFirst(new SnakeNode(startX, startY));
    }

    /// <summary>
    /// Moves the snake to the specified coordinates.
    /// </summary>
    /// <param name="newX">The new x-coordinate of the snake's head.</param>
    /// <param name="newY">The new y-coordinate of the snake's head.</param>
    /// <param name="board">The game board.</param>
    public void Move(int newX, int newY, Board board)
    {
        var newHead = new SnakeNode(newX, newY);
        _nodes.AddFirst(newHead);

        if (board.GetBoard()[newX][newY] != CellType.Food)
        {
            // If the snake didn't eat, remove the tail
            _nodes.RemoveLast();
        }
        else
        {
            // Increase the score by 10 and notify via SignalR
            GameExecution.Instance.Score += 10;
            board.GenerateFood(1);
        }
    }

    /// <summary>
    /// Checks if the snake has collided with a given position.
    /// </summary>
    /// <param name="x">The x-coordinate of the position to check.</param>
    /// <param name="y">The y-coordinate of the position to check.</param>
    /// <returns>True if the snake has collided with the given position, false otherwise.</returns>
    public bool CheckCollision(int x, int y)
    {
        return _nodes.Any(node => node != null && node.X == x && node.Y == y);
    }

    /// <summary>
    /// Checks if there is food in any of the cells adjacent to the snake's head.
    /// </summary>
    /// <param name="board">The game board.</param>
    /// <returns>True if there is food in any of the adjacent cells, false otherwise.</returns>
    public bool IsFoodNear(Board board)
    {
        // If the snake's head is null, return false
        if (Head == null) return false;

        // Get the x and y coordinates of the snake's head
        var x = Head.X;
        var y = Head.Y;

        // Defines the positions adjacent to the snake's head
        // These positions include the cells directly above, below, to the left, and to the right of the head,
        // as well as the cells diagonally adjacent to the head
        var adjacentPositions = new List<(int, int)>
        {
            (x - 1, y), // up
            (x + 1, y), // down
            (x, y + 1), // right
            (x, y - 1), // left
            (x - 1, y + 1), // upper right diagonal
            (x + 1, y + 1), // lower right diagonal
            (x - 1, y - 1), // upper left diagonal
            (x + 1, y - 1), // lower left diagonal
        };

        // Checks if any of the adjacent cells are of type CellType.Food
        // If the cell is out of the board's bounds, it is ignored
        // If a cell contains food, the function returns true
        foreach (var (adjX, adjY) in adjacentPositions)
        {
            if (adjY < 0 || adjY >= board.GetBoard().Length || adjX < 0 || adjX >= board.GetBoard()[0].Length) continue;
            if (board.GetBoard()[adjX][adjY] == CellType.Food)
            {
                return true;
            }
        }

        // If none of the adjacent cells contain food, the function returns false
        return false;
    }
}