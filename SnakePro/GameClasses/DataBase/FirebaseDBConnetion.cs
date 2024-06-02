using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

namespace WebApplication2.GameClasses.DataBase
{
    /// <summary>
    /// Defines the contract for a service that interacts with Firebase database.
    /// </summary>
    public interface IFirebaseDbConnection
    {
        Task<User> GetUserData(string userToken);
    }
    /// <summary>
    /// Provides a service to interact with Firebase database.
    /// </summary>
    public class FirebaseDbConnection : IFirebaseDbConnection
    {
        /// <summary>
        /// Initializes a new instance of the FirebaseDbConnection class.
        /// </summary>
        /// <param name="configuration">The application configuration, used to get Firebase settings.</param>
        public FirebaseDbConnection(IConfiguration configuration)
        {
            // Ensure Firebase is initialized only once
            if (FirebaseApp.DefaultInstance != null) return;
            var firebaseFilePath = configuration["Firebase:FilePath"];
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(firebaseFilePath),
            });
        }

        /// <summary>
        /// Retrieves the user data from Firebase database using the provided user token.
        /// </summary>
        /// <param name="userToken">The user token used to fetch the user data.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the User data.</returns>
        public async Task<User> GetUserData(string userToken)
        {
            try
            {
                // Verify and decode the token
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(userToken);
                var userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(decodedToken.Uid);
                // If the user does not exist, return an empty User object
                if (userRecord == null)
                {
                    Console.WriteLine("User does not exist!");
                    return new User();
                }
                Console.WriteLine($"User logged in: {userRecord.DisplayName}, {userRecord.Email}");
                // Return a User object populated with the user's data
                return new User
                {
                    Uid = userRecord.Uid,
                    DisplayName = userRecord.DisplayName ?? "No display name",
                    Email = userRecord.Email ?? "No email"
                };
            }
            catch (Exception ex)
            {
                // If an error occurs, log the error and return an empty User object
                Console.WriteLine($"Error logging in user: {ex.Message}");
                return new User();
            }
        }
    }
    
}