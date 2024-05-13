using Microsoft.AspNetCore.SignalR;

namespace WebApplication2.hubs;

public class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await SendMessage("hola");
        await base.OnConnectedAsync();
    }

    public async Task SendMessage(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }
}