using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WebApplication2.GameClasses.DataBase;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FirebaseDbController(IFirebaseDbConnection firebaseDbConnection) : ControllerBase
    {
        [HttpPost("getUserData")]
        public async Task<IActionResult> GetUserData([FromBody] string userToken)
        {
            Console.WriteLine($"User token: {userToken}");
            if (string.IsNullOrEmpty(userToken))
            {
                return BadRequest("User token is required.");
            }

            try
            {
                var data = await firebaseDbConnection.GetUserData(userToken); 
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}