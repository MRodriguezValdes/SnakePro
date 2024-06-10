package com.example.snakeprocontroller;


import android.util.Log;

import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface ApiService {
    // API endpoint to send a movement command to the game.
    // The key parameter represents the movement direction (e.g., "ArrowUp", "ArrowDown", etc.).
    @POST("api/Game/SetMovement")
    Call<Void> setMovement(@Body String key);

    // API endpoint to start the game with the specified configuration.
    // The body parameter is a StartGameRequest object containing the number of columns and rows for the game.
    @POST("/api/Game/Start")
    Call<Void> startGame(@Body StartGameRequest body);

    // API endpoint to pause the game.
    // No parameters are needed for this request.
    @POST("/api/Game/PauseGame")
    Call<Void> pauseGame();

    // API endpoint to resume the game.
    // No parameters are needed for this request.
    @POST("/api/Game/ResumeGame")
    Call<Void> resumeGame();

}
