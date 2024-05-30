package com.example.snakeprocontroller;


import android.util.Log;

import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface ApiService {
    @POST("api/Game/SetMovement")
    Call<Void> setMovement(@Body String key);

    @POST("/api/Game/Start")
    Call<Void> startGame(@Body StartGameRequest body);

    @POST("/api/Game/PauseGame")
    Call<Void> pauseGame();

    @POST("/api/Game/ResumeGame")
    Call<Void> resumeGame();

}
