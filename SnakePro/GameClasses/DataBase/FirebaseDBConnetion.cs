using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

namespace WebApplication2.GameClasses.DataBase
{
    public interface IFirebaseDbConnection
    {
        Task<User> GetUserData(string userToken);
        // Otros métodos que necesites
    }

    public class FirebaseDbConnection : IFirebaseDbConnection
    {

        public async Task<User> GetUserData(string userToken)
        {
            try
            {
                // Verify and decode the token
                FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(userToken);
                string uid = decodedToken.Uid;

                // Get user information
                UserRecord userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(uid);

                if (userRecord != null)
                {
                    // Perform login actions (e.g., set session variables)
                    // ...

                    Console.WriteLine($"User logged in: {userRecord.DisplayName}, {userRecord.Email}");

                    // Return a User object
                    return new User
                    {
                        Uid = userRecord.Uid,
                        DisplayName = userRecord.DisplayName,
                        Email = userRecord.Email
                    };
                }
                else
                {
                    Console.WriteLine("User does not exist!");
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error logging in user: {ex.Message}");
                return null;
            }
        }
    }
}