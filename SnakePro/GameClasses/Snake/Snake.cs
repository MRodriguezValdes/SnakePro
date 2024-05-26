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
}