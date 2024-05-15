using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApplication2.GameClasses;
using WebApplication2.GameClasses.Enums;
using WebApplication2.hubs;

namespace WebApplication2.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GameController : ControllerBase
{
    private GameExecution _gameExecution;
    private readonly IHubContext<ChatHub> _hubContext;

    public GameController(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [HttpPost("start")]
    public IActionResult StartGame(int columns, int rows)
    {
        _gameExecution = new GameExecution(columns, rows, _hubContext);
        _gameExecution.StartGame();
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
       // _gameExecution.ChangeCurrentMovement(chosenMovement);
        return Ok();
    }
}