using Microsoft.AspNetCore.SignalR;
using WebApplication2.GameClasses.Enums;
using WebApplication2.hubs;

namespace WebApplication2.GameClasses;

public class GameExecution
{
    private readonly Board _board;
    private GameStates _gameState = GameStates.None;
    private Movements _currentMovement = Movements.None;
    private readonly Snake.Snake _snake;
    private readonly IHubContext<ChatHub> _chatHub;

    public GameExecution(int columns, int rows, IHubContext<ChatHub> chatHub)
    {
        _board = new Board(columns, rows);
        var (startX, startY) = _board.GetRandomValidCell();
        _snake = new Snake.Snake(startX, startY);
        _chatHub = chatHub;
    }

    public void StartGame()
    {
        _gameState = GameStates.Running;
        while (_gameState == GameStates.Running)
        {
            MoveSnake();
        }
    }

    public void PauseGame()
    {
        _gameState = GameStates.Paused;
    }

    public void ChangeCurrentMovement(Movements movement)
    {
        _currentMovement = movement;
    }

    private void MoveSnake()
    {
        int newX = _snake.Head.X, newY = _snake.Head.Y;
        switch (_currentMovement)
        {
            case Movements.Up:
                newY--;
                break;
            case Movements.Down:
                newY++;
                break;
            case Movements.Left:
                newX--;
                break;
            case Movements.Right:
                newX++;
                break;
            case Movements.None:
                return;
            default:
                return;
        }

        // Wrap the coordinates if they are out of the board bounds
        (newX, newY) = WrapCoordinates(newX, newY);

        // Update the board cell where the snake's tail was to CellType.Empty
        _board.GetBoard()[_snake.Tail.X][_snake.Tail.Y] = CellType.Empty;

        // Move the snake to the new position
        _snake.Move(newX, newY);

        // Update the board cell where the snake's head is now to CellType.Snake
        _board.GetBoard()[_snake.Head.X][_snake.Head.Y] = CellType.Snake;
        
        // Send the updated board to all clients
          _chatHub.Clients.All.SendAsync("SnakeBoardUpdate",_board.GetBoard());
    }

    private (int, int) WrapCoordinates(int x, int y)
    {
        if (x < 0)
        {
            x = _board.GetBoard().Length - 1; // Set to the last column
        }
        else if (x >= _board.GetBoard().Length)
        {
            x = 0; // Set to the first column
        }

        if (y < 0)
        {
            y = _board.GetBoard()[0].Length - 1; // Set to the last row
        }
        else if (y >= _board.GetBoard()[0].Length)
        {
            y = 0; // Set to the first row
        }

        return (x, y);
    }
}