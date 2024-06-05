

using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;

namespace WebApplication2.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContactController : ControllerBase
{
    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] ContactFormModel model)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(model.Name, model.Email));
        message.To.Add(new MailboxAddress("Miguel Vidal Tordillo", "miguel11nemo@gmail.com")); 
        message.Subject = $"Message from {model.Name}";
        message.Body = new TextPart("plain")
        {
            Text = $"Sender's e-mail address: {model.Email}\n\nMessage: {model.Message}"
        };

        using (var client = new SmtpClient())
        {
            try
            {
                await client.ConnectAsync("smtp.gmail.com", 587, false);
                await client.AuthenticateAsync("miguel11nemo@gmail.com", "cmbw lmsd rusx qgyn");
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                return Ok(new { message = "Mail sent correctly" });
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}"); 
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
    
}

public class ContactFormModel
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Message { get; set; }
}