using Microsoft.AspNetCore.SignalR;
using WebApplication2.GameClasses.Enums;
using WebApplication2.hubs;

namespace WebApplication2.GameClasses;

public class GameExecution
{
    /// <summary>
    /// Singleton instance of the GameExecution class.
    /// </summary>
    private static GameExecution? _instance;

    /// <summary>
    /// Current state of the game.
    /// </summary>
    private GameStates? _gameState;

    /// <summary>
    /// The game board.
    /// </summary>
    private Board? _board;

    /// <summary>
    /// Current movement direction of the snake.
    /// </summary>
    private Movements? _currentMovement = Movements.None;

    /// <summary>
    /// The snake in the game.
    /// </summary>
    private Snake.Snake? _snake;

    /// <summary>
    /// Context for the SignalR hub.
    /// </summary>
    private IHubContext<ChatHub>? _chatHub;

    public static GameExecution? Instance => _instance ??= new GameExecution();

    /// <summary>
    /// Gets the current state of the game and sends changes via SignalR.
    /// </summary>
    public GameStates? GameState
    {
        get => _gameState;
        private set
        {
            _gameState = value;
            _chatHub?.Clients.All.SendAsync("GameStates", _gameState);
        }
    }

    /// <summary>
    /// Starts the game with the specified number of columns and rows.
    /// </summary>
    /// <param name="columns">The number of columns in the game board.</param>
    /// <param name="rows">The number of rows in the game board.</param>
    /// <param name="chatHub">The SignalR hub context.</param>
    public void StartGame(int columns, int rows, IHubContext<ChatHub>? chatHub)
    {
        _chatHub = chatHub;
        GameState = GameStates.Running;
        _board = new Board(columns, rows);

        var (startX, startY) = _board.GetRandomValidCell();
        _snake = new Snake.Snake(startX, startY);
        _board.GetBoard()[startX][startY] = CellType.Snake; // Set the initial snake position
        _board.GenerateFood(4);

        // Send the initial board to all clients
        _chatHub?.Clients.All.SendAsync("SnakeBoardUpdate", _board.GetBoard());
        Task.Run(() =>
        {
            while (GameState is GameStates.Running or GameStates.Paused)
            {
                while (GameState is GameStates.Paused)
                {
                    Thread.Sleep(100);
                }

                MoveSnake();
                Task.Delay(TimeSpan.FromMilliseconds(200)).Wait();
            }
        });
    }

    /// <summary>
    /// Pauses the game.
    /// </summary>
    public void PauseGame()
    {
        GameState = GameStates.Paused;
    }

    /// <summary>
    /// Resumes the game.
    /// </summary>
    public void ResumeGame()
    {
        GameState = GameStates.Running;
    }

    /// <summary>
    /// Changes the current movement direction of the snake.
    /// </summary>
    public void ChangeCurrentMovement(Movements? movement)
    {
        _currentMovement = movement;
    }

    /// <summary>
    /// Gets the current movement direction of the snake.
    /// </summary>
    public Movements? GetCurrentMovement()
    {
        return _currentMovement;
    }

    /// <summary>
    /// Moves the snake based on the current movement direction.
    /// </summary>
    private void MoveSnake()
    {
        // Returns if the snake's head, tail, or the game board is null.
        if (_snake is not { Head: not null } || _snake.Tail == null || _board == null) return;

        int newX = _snake.Head.X, newY = _snake.Head.Y;
        switch (_currentMovement)
        {
            case Movements.Up:
                newX--; // Move up
                break;
            case Movements.Down:
                newX++; // Move down
                break;
            case Movements.Left:
                newY--; // Move left
                break;
            case Movements.Right:
                newY++; // Move right
                break;
            case Movements.None:
                return;
            default:
                return;
        }

        // Wrap the coordinates if they are out of the board bounds
        (newX, newY) = WrapCoordinates(newX, newY);
        if (_snake.CheckCollision(newX, newY))
        {
            GameState = GameStates.GameOver;
            return;
        }

        // Get the current tail position before moving the snake
        var oldTailX = _snake.Tail.X;
        var oldTailY = _snake.Tail.Y;

        // Move the snake to the new position
        _snake.Move(newX, newY, _board);

        // Update the board cell where the snake's tail was to CellType.Empty
        _board.GetBoard()[oldTailX][oldTailY] = CellType.Empty;
        // Update the board cell where the snake's head is now to CellType.Snake
        _board.GetBoard()[_snake.Head.X][_snake.Head.Y] = CellType.Snake;
        // Send the updated board to all clients
        _chatHub?.Clients.All.SendAsync("SnakeBoardUpdate", _board.GetBoard());
    }

    /// <summary>
    /// Wraps the coordinates if they are out of the board bounds.
    /// </summary>
    /// <param name="x">The x-coordinate.</param>
    /// <param name="y">The y-coordinate.</param>
    /// <returns>The wrapped coordinates.</returns>
    private (int, int) WrapCoordinates(int x, int y)
    {
        var boardLength = _board?.GetBoard().Length ?? 0;
        var boardWidth = _board?.GetBoard()[0].Length ?? 0;

        x = x < 0 ? boardLength - 1 : (x >= boardLength ? 0 : x);
        y = y < 0 ? boardWidth - 1 : (y >= boardWidth ? 0 : y);

        return (x, y);
    }
}