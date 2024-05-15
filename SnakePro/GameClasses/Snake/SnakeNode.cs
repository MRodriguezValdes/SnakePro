namespace WebApplication2.GameClasses.Snake;

public class SnakeNode(int x, int y)
{
    public int X { get; set; } = x;
    public int Y { get; set; } = y;
    public SnakeNode Next { get; set; }
}