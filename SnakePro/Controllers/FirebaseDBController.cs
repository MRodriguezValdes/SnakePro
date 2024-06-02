using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WebApplication2.GameClasses.DataBase;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FirebaseDbController(IFirebaseDbConnection firebaseDbConnection , IFirebaseDbConnectionTest firebaseDbConnectionTest,IConfiguration configuration) : ControllerBase
    {
        [HttpPost("getUserData")]
        public async Task<IActionResult> GetUserData([FromBody] string userToken=null)
        {
            Console.WriteLine($"User token: {userToken}");
            if (string.IsNullOrEmpty(userToken))
            {
                userToken = await firebaseDbConnectionTest.GenerateTestToken(configuration);
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