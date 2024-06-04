using Microsoft.AspNetCore.Mvc;
using WebApplication2.GameClasses.DataBase;

namespace WebApplication2.Controllers
{
    /// <summary>
    /// The FirebaseDbController is a controller class that handles HTTP requests related to operations with the Firebase database.
    /// It uses dependency injection to receive an instance of IFirebaseDbConnection, which is used to interact with the database.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class FirebaseDbController(IFirebaseDbConnection firebaseDbConnection) : ControllerBase
    {
        /// <summary>
        /// This is a test method that retrieves user information.
        /// It is used to verify that the user has logged in correctly.
        /// </summary>
        /// <param name="userToken">The user token used to fetch the user data.</param>
        /// <returns>
        /// If the user token is null or empty, it returns a bad request response.
        /// If the user data is successfully retrieved, it returns the data in an OK response.
        /// If there is an exception while fetching the user data, it returns an internal server error response with the exception message.
        /// </returns>
        [HttpPost("GetUserData")]
        public async Task<IActionResult> GetUserData([FromBody] string userToken)
        {
            Console.WriteLine($"User token: {userToken}");

            if (string.IsNullOrEmpty(userToken))
            {
                return BadRequest("User token is required.");
            }

            try
            {
                var userRecord = await firebaseDbConnection.AuthenticateUser(userToken);
                var data = await firebaseDbConnection.GetUserData(userRecord);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Saves the user's score to the Firebase database.
        /// </summary>
        /// <param name="score">The score to be saved.</param>
        /// <returns>
        /// If the user token is null or empty, it returns a bad request response.
        /// If the score is successfully saved, it returns an OK response.
        /// If there is an exception while saving the score, it returns an internal server error response with the exception message.
        /// </returns>
        [HttpPost("SaveScore")]
        public async Task<IActionResult> SaveScore([FromBody] int score)
        {
            try
            {
                Console.WriteLine($"Score: {score}");
                await firebaseDbConnection.SaveScore(score);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}