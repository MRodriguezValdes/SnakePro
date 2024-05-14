using Microsoft.AspNetCore.Mvc;

namespace WebApplication2.Controllers;


[Route("api/[controller]")]
[ApiController]
public class KeysStrokeController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] string key)
    {
        Console.WriteLine($"Key pressed: {key}");
        return Ok();
    }
}