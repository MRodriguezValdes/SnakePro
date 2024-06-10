using System.Text;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace WebApplication2.DataBase
{
    /// <summary>
    /// Defines the contract for a service that interacts with Firebase database.
    /// </summary>
    public interface IFirebaseDbConnection
    {
        Task<User> GetUserData(UserRecord userRecord);
        Task<UserRecord> AuthenticateUser(string userToken);
        Task SaveScore(int score);
        Task<Dictionary<string, List<int>>> GetTopScores(int count);
    }

    /// <summary>
    /// Provides a service to interact with Firebase database.
    /// </summary>
    public class FirebaseDbConnection : IFirebaseDbConnection
    {
        // The URL of the Firebase Realtime Database. This is retrieved from the application configuration.
        private static string _firebaseDatabaseUrl = "";

        // An instance of IMemoryCache used for caching data in memory.
        private readonly IMemoryCache? _cache;

        /// <summary>
        /// Initializes a new instance of the FirebaseDbConnection class.
        /// </summary>
        /// <param name="configuration">The application configuration, used to get Firebase settings.</param>
        /// <param name="cache">to be able to implement memory cache in the app</param>
        public FirebaseDbConnection(IConfiguration configuration, IMemoryCache? cache)
        {
            // Ensure Firebase is initialized only once
            if (FirebaseApp.DefaultInstance != null) return;
            var firebaseFilePath = configuration["Firebase:FilePath"];
            _firebaseDatabaseUrl = configuration["Firebase:DatabaseUrl"] ?? "";
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(firebaseFilePath),
            });
            _cache = cache;
        }

        /// <summary>
        /// Authenticates a user using a provided user token.
        /// </summary>
        /// <param name="userToken">The user token used for authentication.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the authenticated UserRecord.</returns>
        /// <exception cref="System.Exception">Thrown when the user does not exist.</exception>
        public async Task<UserRecord> AuthenticateUser(string userToken)
        {
            // Verify and decode the token
            var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(userToken);
            var userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(decodedToken.Uid);

            // If the user does not exist, throw an exception
            if (userRecord == null)
            {
                throw new Exception("User does not exist!");
            }

            // Store the token in the cache 
            _cache?.Set("UserToken", decodedToken);

            return userRecord;
        }

        /// <summary>
        /// Retrieves the user data from the provided UserRecord.
        /// </summary>
        /// <param name="userRecord">The UserRecord containing the user's data.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the User data.</returns>
        public Task<User> GetUserData(UserRecord userRecord)
        {
            // Return a User object populated with the user's data
            return Task.FromResult(new User
            {
                Uid = userRecord.Uid,
                DisplayName = userRecord.DisplayName ?? "No display name",
                Email = userRecord.Email ?? "No email"
            });
        }

        /// <summary>
        /// Saves the user's score to the Firebase Realtime Database.
        /// </summary>
        /// <param name="score">The score to be saved.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="System.Net.Http.HttpRequestException">Thrown when the request to save the score fails.</exception>
        public async Task SaveScore(int score)
        {
            if (_cache == null || !_cache.TryGetValue("UserToken", out FirebaseToken? token))
            {
                // If the token is not in the cache, throw an exception
                throw new Exception("User token not found in cache.");
            }

            var userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(token?.Uid);
            // Get a reference to the user's scores in the Firebase Realtime Database
            var scoresUrl = $"{_firebaseDatabaseUrl}/score/{userRecord.Uid}.json";

            // Create a new HttpClient
            using var client = new HttpClient();
            // Convert the score to JSON
            var scoreJson = JsonConvert.SerializeObject(score);

            // Send a POST request to the Firebase Realtime Database
            var response = await client.PostAsync(scoresUrl,
                new StringContent(scoreJson, Encoding.UTF8, "application/json"));

            // Throw an exception if the request failed
            response.EnsureSuccessStatusCode();
        }

        /// <summary>
        /// Retrieves the top scores from the Firebase Realtime Database.
        /// </summary>
        /// <param name="count">The number of top scores to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a dictionary where the key is the user's email and the value is a list of the user's top scores.</returns>
        /// <exception cref="System.Exception">Thrown when there is an error retrieving the scores.</exception>
        public async Task<Dictionary<string, List<int>>> GetTopScores(int count)
        {
            try
            {
                // Define the URL for the scores in the Firebase Realtime Database
                var scoresUrl = $"{_firebaseDatabaseUrl}/score.json";

                // Create a new HttpClient instance
                using var client = new HttpClient();
                // Send a GET request to the Firebase Realtime Database
                var response = await client.GetAsync(scoresUrl);

                // Ensure the request was successful
                response.EnsureSuccessStatusCode();

                // Read the response content as a string
                var scoresJson = await response.Content.ReadAsStringAsync();
                // Deserialize the JSON string to a nested dictionary
                var scores = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, int>>>(scoresJson);

                // If the scores dictionary is null, return an empty dictionary
                if (scores == null) return new Dictionary<string, List<int>>();

                // Extract the scores, sort them in descending order, and take the top 'count' scores
                var topScores = scores
                    .SelectMany(userScores =>
                        userScores.Value.Select(score => new KeyValuePair<string, int>(userScores.Key, score.Value)))
                    .OrderByDescending(score => score.Value)
                    .Take(count)
                    .ToList();

                // Convert the list of scores to a dictionary
                var topScoresDict = new Dictionary<string, List<int>>();
                foreach (var score in topScores)
                {
                    // Get the user record for the current score
                    var userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(score.Key);
                    // Get the user data for the current user record
                    var user = await GetUserData(userRecord);
                    // If the user's email is already in the dictionary, add the current score to their list of scores
                    // Otherwise, add a new entry to the dictionary for the user's email and their current score
                    if (topScoresDict.ContainsKey(user.Email ?? string.Empty))
                    {
                        topScoresDict[user.Email ?? string.Empty].Add(score.Value);
                    }
                    else
                    {
                        topScoresDict[user.Email ?? string.Empty] = new List<int> { score.Value };
                    }
                }

                // Return the dictionary of top scores
                return topScoresDict;
            }
            catch (Exception ex)
            {
                // Log the error message and rethrow the exception
                Console.WriteLine($"Error getting top scores: {ex.Message}");
                throw;
            }
        }
    }
}