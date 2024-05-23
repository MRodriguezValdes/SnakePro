using WebApplication2.GameClasses.Enums;

namespace WebApplication2.GameClasses.Snake;

public class Snake
{
    private readonly LinkedList<SnakeNode?> _nodes;

    public SnakeNode? Head => _nodes.First?.Value;
    public SnakeNode? Tail => _nodes.Last?.Value;

    public Snake(int startX, int startY)
    {
        _nodes = new LinkedList<SnakeNode?>();
        _nodes.AddFirst(new SnakeNode(startX, startY));
    }

    public void Move(int newX, int newY, Board board)
    {
        var newHead = new SnakeNode(newX, newY);
        _nodes.AddFirst(newHead);

        if (board.GetBoard()[newX][newY] != CellType.Food)
        {
            // If the snake didn't eat, remove the tail
            _nodes.RemoveLast();
        }
    }
}