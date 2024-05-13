using Microsoft.AspNetCore.SignalR;

namespace WebApplication2.hubs;

public class ChatHub : Hub
{
    public async Task SendMessage()
    {
        await Clients.All.SendAsync("ReceiveMessage", "hola");
    }
}