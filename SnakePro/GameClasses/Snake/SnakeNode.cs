namespace WebApplication2.GameClasses.Snake;

/// <summary>
/// Represents a node in the snake.
/// </summary>
public class SnakeNode(int x, int y)
{
    /// <summary>
    /// Gets or sets the x-coordinate of the node.
    /// </summary>
    public int X { get; set; } = x;

    /// <summary>
    /// Gets or sets the y-coordinate of the node.
    /// </summary>
    public int Y { get; set; } = y;
}