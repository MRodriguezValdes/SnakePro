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
    /// A CancellationTokenSource that can be used to stop the background thread
    ///</summary>
    private CancellationTokenSource? _cancellationTokenSource;

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
    /// Private field to hold the score of the current game.
    /// </summary>
    private int _score;

    /// <summary>
    /// Context for the SignalR hub.
    /// </summary>
    private IHubContext<SnakeGameHub>? _chatHub;

    public static GameExecution Instance => _instance ??= new GameExecution
        { _cancellationTokenSource = new CancellationTokenSource() };

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
    /// Gets or sets the score of the current game.
    /// </summary>
    /// <value>
    /// The score of the game.
    /// </value>
    /// <remarks>
    /// When the score is set, it also sends a SignalR message with the new score to all connected clients.
    /// </remarks>
    public int Score
    {
        get => _score;
        set
        {
            _score = value;
            _chatHub?.Clients.All.SendAsync("Score", _score);
        }
    }

    /// <summary>
    /// This method is responsible for starting the game.
    /// </summary>
    /// <param name="columns">The number of columns for the game board. This determines the width of the game board.</param>
    /// <param name="rows">The number of rows for the game board. This determines the height of the game board.</param>
    /// <param name="chatHub">The SignalR hub context. This is used for real-time communication between the server and the clients.</param>
    public void StartGame(int columns, int rows, IHubContext<SnakeGameHub>? chatHub)
    {
        InitializeGame(columns, rows, chatHub);
        RunGameLoop();
    }

    /// <summary>
    /// Initializes the game with the specified number of columns and rows.
    /// </summary>
    /// <param name="columns">The number of columns in the game board.</param>
    /// <param name="rows">The number of rows in the game board.</param>
    /// <param name="chatHub">The SignalR hub context.</param>
    private void InitializeGame(int columns, int rows, IHubContext<SnakeGameHub>? chatHub)
    {
        // Assign the SignalR hub context
        _chatHub = chatHub;

        // Set the game state to Running
        GameState = GameStates.Running;

        // Initialize the game board with the specified number of columns and rows
        _board = new Board(columns, rows);

        // Reset the score to 0
        _score = 0;

        // Get a random valid cell on the board to start the snake
        var (startX, startY) = _board.GetRandomValidCell();

        // Initialize the snake at the starting position
        _snake = new Snake.Snake(startX, startY);

        // Set the initial snake position on the board
        _board.GetBoard()[startX][startY] = CellType.SnakeHead;

        // Generate initial food on the board
        _board.GenerateFood(4);
        
        // Generate the blocks
        _board.GenerateBlocks(20);

        // Send the initial board to all clients
        _chatHub?.Clients.All.SendAsync("SnakeBoardUpdate", _board.GetBoard());
    }

    /// <summary>
    /// Runs the game loop in a separate task.
    /// </summary>
    private void RunGameLoop()
    {
        if (_cancellationTokenSource == null) return;
        // Define the initial delay time in milliseconds
        var delayTime = 200;

        // Define the time when the game started
        var gameStartTime = DateTime.Now;

        Task.Run(() =>
        {
            while (GameState is GameStates.Running or GameStates.Paused &&
                   !_cancellationTokenSource.Token.IsCancellationRequested)
            {
                while (GameState is GameStates.Paused)
                {
                    Thread.Sleep(100);
                }

                MoveSnake();

                // Check if 3 seconds have passed since the game started
                if ((DateTime.Now - gameStartTime).TotalSeconds >= 3)
                {
                    // Decrease the delay time by 10 milliseconds
                    delayTime = Math.Max(80,
                        delayTime - 10); // Ensure the delay time doesn't go below 80 milliseconds

                    // Reset the game start time
                    gameStartTime = DateTime.Now;
                }

                Task.Delay(TimeSpan.FromMilliseconds(delayTime)).Wait();
            }
        }, _cancellationTokenSource.Token);
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
    /// Stops the current game and destroys the instance.
    /// </summary>
    public void StopGame()
    {
        // Cancel the background thread
        _cancellationTokenSource?.Cancel();

        // Set the game state to None
        GameState = GameStates.None;

        // Clear the game board
        _board = null;

        // Clear the snake
        _snake = null;

        // Clear the current movement
        _currentMovement = Movements.None;

        // Clear the SignalR hub context
        _chatHub = null;

        // Destroy the instance
        _instance = null;
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

        // Save the current head position before moving the snake
        var oldHeadX = _snake.Head.X;
        var oldHeadY = _snake.Head.Y;

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
        
        // Check if it has collided with itself or with a block
        if (_snake.CheckCollision(newX, newY) || _board.GetBoard()[newX][newY] == CellType.Block)
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

        // Checks if the old head's coordinates do not match the tail's coordinates.
        // If they do not match, it means the snake has moved from its previous position.
        // In this case, the board cell where the snake's head was is updated to CellType.SnakeBody.
        if (oldHeadX != oldTailX || oldHeadY != oldTailY)
        {
            _board.GetBoard()[oldHeadX][oldHeadY] = CellType.SnakeBody;
        }

        // Updates the board cell where the snake's head is now to CellType.SnakeHead or CellType.SnakeMouthOpen.
        // The cell type is determined by whether there is food near the snake's head.
        _board.GetBoard()[_snake.Head.X][_snake.Head.Y] =
            _snake.IsFoodNear(_board) ? CellType.SnakeMouthOpen : CellType.SnakeHead;

        // Updates the board cell where the snake's tail is now to CellType.SnakeTail.
        // This is done only if the snake's head and tail are not at the same position.
        if (_snake.Tail.X != _snake.Head.X || _snake.Tail.Y != _snake.Head.Y)
        {
            _board.GetBoard()[_snake.Tail.X][_snake.Tail.Y] = CellType.SnakeTail;
        }

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