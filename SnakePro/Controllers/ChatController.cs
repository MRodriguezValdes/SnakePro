using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
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

    [HttpGet("send")]
    public async Task<string> Send()
    {
        await _hubContext.Clients.All.SendAsync("ReceiveMessage", "hola");
        return "hola";
    }
}