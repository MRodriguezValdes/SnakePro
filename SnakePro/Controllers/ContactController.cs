

using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;

namespace WebApplication2.Controllers;

/// <summary>
/// Defines the route for the controller and specifies that it uses the ControllerBase class.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class ContactController : ControllerBase
{
    /// <summary>
    /// Sends an email with the details provided in the ContactFormModel.
    /// </summary>
    /// <param name="model">The contact form details.</param>
    /// <returns>A Task that represents the asynchronous operation. The task result contains the IActionResult.</returns>
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

/// <summary>
/// Model for the contact form.
/// </summary>
public class ContactFormModel
{
    /// <summary>
    /// Gets or sets the name of the sender.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the email of the sender.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// Gets or sets the message from the sender.
    /// </summary>
    public string Message { get; set; }
}