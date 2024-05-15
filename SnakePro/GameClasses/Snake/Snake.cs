namespace WebApplication2.GameClasses.Snake;

public class Snake
{
    public SnakeNode Head { get; private set; }
    public SnakeNode Tail { get; private set; }

    public Snake(int startX, int startY)
    {
        Head = new SnakeNode(startX, startY);
        Tail = Head;
    }

    public void Move(int newX, int newY)
    {
        var newHead = new SnakeNode(newX, newY)
        {
            Next = Head
        };
        Head = newHead;
    }
}