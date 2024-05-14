using Microsoft.AspNetCore.SignalR;
using WebApplication2.GameClasses;

namespace WebApplication2.hubs;

public class ChatHub : Hub
{
    public async Task SendMessage(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }

    public async Task SendBoard( int columns, int rows)
    {
        // Create a new board
         Board board = new Board(columns,rows);
        await Clients.All.SendAsync("ReceiveBoard", board.GetBoard());
    }
}