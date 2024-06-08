namespace WebApplication2.DataBase;

/// <summary>
/// Represents a user in the system.
/// </summary>
public class User
{
    /// <summary>
    /// Gets or sets the unique identifier for the user.
    /// </summary>
    public string? Uid { get; set; }

    /// <summary>
    /// Gets or sets the display name of the user.
    /// </summary>
    public string? DisplayName { get; set; }

    /// <summary>
    /// Gets or sets the email of the user.
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Gets or sets the score of the user.
    /// </summary>
    public int Score { get; set; }
}