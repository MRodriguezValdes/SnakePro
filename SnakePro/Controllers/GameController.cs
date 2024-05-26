using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApplication2.GameClasses;
using WebApplication2.GameClasses.Enums;
using WebApplication2.hubs;

namespace WebApplication2.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GameController(IHubContext<ChatHub> hubContext) : ControllerBase
{
    [HttpPost("Start")]
    public IActionResult StartGame([FromBody] StartGameRequest startGameRequest)
    {
        Console.WriteLine($"Starting game with {startGameRequest.Columns} columns and {startGameRequest.Rows} rows");
        GameExecution.Instance?.StartGame(startGameRequest.Columns, startGameRequest.Rows, hubContext);
        return Ok();
    }

    [HttpPost("SetMovement")]
    public IActionResult SetMovement([FromBody] string key)
    {
        var currentMovement = GameExecution.Instance?.GetCurrentMovement();
        var chosenMovement = key switch
        {
            "ArrowUp" => Movements.Up,
            "ArrowDown" => Movements.Down,
            "ArrowLeft" => Movements.Left,
            "ArrowRight" => Movements.Right,
            _ => GameExecution.Instance?.GetCurrentMovement()
        };
        // Check if the chosen movement is the opposite of the current movement
        if ((currentMovement == Movements.Up && chosenMovement == Movements.Down) ||
            (currentMovement == Movements.Down && chosenMovement == Movements.Up) ||
            (currentMovement == Movements.Left && chosenMovement == Movements.Right) ||
            (currentMovement == Movements.Right && chosenMovement == Movements.Left))
        {
            return BadRequest("Invalid movement");
        }

        Console.WriteLine($"Key pressed: {chosenMovement}");
        if (GameExecution.Instance?.GameState != GameStates.None)
        {
            GameExecution.Instance?.ChangeCurrentMovement(chosenMovement);
        }

        return Ok();
    }

    [HttpPost("PauseGame")]
    public IActionResult PauseGame()
    {
        var currentGameState = GameExecution.Instance?.GameState;
        if (currentGameState == GameStates.Running)
        {
            if (GameExecution.Instance != null) GameExecution.Instance.PauseGame();
        }
        else
        {
            return BadRequest("Game is not running");
        }

        return Ok();
    }

    [HttpPost("ResumeGame")]
    public IActionResult ResumeGame()
    {
        var currentGameState = GameExecution.Instance?.GameState;
        if (currentGameState == GameStates.Paused)
        {
            if (GameExecution.Instance != null) GameExecution.Instance.ResumeGame();
        }
        else
        {
            return BadRequest("Game is not paused");
        }

        return Ok();
    }
}
public class StartGameRequest
{
    public int Columns { get; set; }
    public int Rows { get; set; }
}