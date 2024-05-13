using Microsoft.AspNetCore.SignalR;
using WebApplication2.GameClasses;

namespace WebApplication2.hubs;

public class ChatHub : Hub
{
    public async Task SendMessage(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }

    public async Task SendBoard()
    {
        await Clients.All.SendAsync("ReceiveBoard", new Board(10, 10).ToJson());
    }
}