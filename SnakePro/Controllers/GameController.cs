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
    [HttpPost("start")]
    public IActionResult StartGame([FromBody]StartGameRequest startGameRequest)
    {
        Console.WriteLine($"Starting game with {startGameRequest.Columns} columns and {startGameRequest.Rows} rows");
        GameExecution.Instance.StartGame(startGameRequest.Columns, startGameRequest.Rows, hubContext);
        return Ok();
    }

    [HttpPost("SetMovement")]
    public IActionResult SetMovement([FromBody] string key)
    {
        var chosenMovement = key switch
        {
            "ArrowUp" => Movements.Up,
            "ArrowDown" => Movements.Down,
            "ArrowLeft" => Movements.Left,
            "ArrowRight" => Movements.Right,
            _ => Movements.None
        };
        Console.WriteLine($"Key pressed: {chosenMovement}");
        if (GameExecution.Instance.GetGameState() != GameStates.None)
        {
            GameExecution.Instance.ChangeCurrentMovement(chosenMovement);
        }
        return Ok();
    }
}
public class StartGameRequest
{
    public int Columns { get; set; }
    public int Rows { get; set; }
}