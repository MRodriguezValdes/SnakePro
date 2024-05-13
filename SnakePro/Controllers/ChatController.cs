using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApplication2.hubs;


[ApiController]
[Route("[controller]")]
public class ChatController : ControllerBase
{
    private readonly IHubContext<ChatHub> _hubContext;

    public ChatController(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }
    [HttpGet("board")]
    public async Task<IActionResult> SendBoard()
    {
        await _hubContext.Clients.All.SendAsync("ReceiveBoard");
        return Ok();
    }
}