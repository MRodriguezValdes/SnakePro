namespace WebApplication2.GameClasses.Enums;

/// <summary>
/// Represents the possible states of the game.
/// </summary>
public enum GameStates
{
    /// <summary>
    /// The game has not started yet.
    /// </summary>
    None,

    /// <summary>
    /// The game is currently running.
    /// </summary>
    Running,

    /// <summary>
    /// The game is currently paused.
    /// </summary>
    Paused,

    /// <summary>
    /// The game is over, typically because the player lost.
    /// </summary>
    GameOver
}