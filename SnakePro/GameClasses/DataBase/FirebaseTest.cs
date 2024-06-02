using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

namespace WebApplication2.GameClasses.DataBase;

public interface IFirebaseDbConnectionTest
{
    Task<string> GenerateTestToken(IConfiguration configuration);
    
}
public class FirebaseTest : IFirebaseDbConnectionTest
{
    public  async Task<string> GenerateTestToken(IConfiguration configuration)
    {
        FirebaseApp app;

        if (FirebaseApp.DefaultInstance == null)
        {
            var firebaseFilePath = configuration["Firebase:FilePath"];
            app = FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(firebaseFilePath),
            });
        }
        else
        {
            app = FirebaseApp.DefaultInstance;
        }

        var auth = FirebaseAuth.GetAuth(app);

        var userRecordArgs = new UserRecordArgs()
        {
            Email = "test@example.com",
            EmailVerified = false,
            Password = "testPassword",
            Disabled = false,
        };

        UserRecord userRecord;

        try
        {
            userRecord = await auth.CreateUserAsync(userRecordArgs);
            Console.WriteLine($"Successfully created new user: {userRecord.Uid}");
        }
        catch (FirebaseAuthException e)
        {
            Console.WriteLine($"Error creating new user: {e.Message}");
            return null;
        }

        string customToken;
        try
        {
            customToken = await auth.CreateCustomTokenAsync(userRecord.Uid);
            Console.WriteLine($"Custom token for testing: {customToken}");
        }
        catch (FirebaseAuthException e)
        {
            Console.WriteLine($"Error creating custom token: {e.Message}");
            return null;
        }

        return customToken;
    }
}