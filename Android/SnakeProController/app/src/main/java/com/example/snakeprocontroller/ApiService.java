package com.example.snakeprocontroller;

// ApiService.java
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {
    @POST("api/Game/SetMovement")
    Call<Void> setMovement(@Body String key);
}
