package com.example.snakeprocontroller;

import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.PopupMenu;
import android.widget.Toast;
import android.graphics.Color;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import android.view.ContextMenu;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AppCompatActivity {

    private ApiService apiService;
    Button buttonSetting;
    int columns = 20;
    int rows = 20;

    private boolean gamePaused = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
        loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(loggingInterceptor)
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:5273/")
                .addConverterFactory(GsonConverterFactory.create())
                .client(client)
                .build();

        apiService = retrofit.create(ApiService.class);

        Button buttonUp = findViewById(R.id.button_up);
        Button buttonDown = findViewById(R.id.button_down);
        Button buttonLeft = findViewById(R.id.button_left);
        Button buttonRight = findViewById(R.id.button_right);
        Button buttonPlay = findViewById(R.id.button_play);
        Button buttonPause = findViewById(R.id.button_pause);
        buttonSetting = findViewById(R.id.button_settings);

        buttonPlay.setShadowLayer(1, -1, -1, Color.BLACK);


        buttonPause.setShadowLayer(1, -1, -1, Color.BLACK);

        buttonSetting.setShadowLayer(1, -1, -1, Color.BLACK);

        buttonUp.setOnClickListener(view -> sendMovement("ArrowUp"));
        buttonDown.setOnClickListener(view -> sendMovement("ArrowDown"));
        buttonLeft.setOnClickListener(view -> sendMovement("ArrowLeft"));
        buttonRight.setOnClickListener(view -> sendMovement("ArrowRight"));
        buttonPlay.setOnClickListener(view -> startGame(columns, rows));

        buttonSetting.setOnClickListener(view -> showSettingsDialog());
        buttonPause.setOnClickListener(view -> {
            if (gamePaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        });
    }

    private void sendMovement(String key) {
        Call<Void> call = apiService.setMovement(key);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(MainActivity.this, "Movimiento enviado con éxito", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MainActivity.this, "Error en el envío del movimiento", Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Error: " + response.code() + " " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Error en la solicitud: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", "Error: " + t.getMessage(), t);
            }
        });
    }

    private void startGame(int columns, int rows) {
        StartGameRequest request = new StartGameRequest(columns, rows);
        Call<Void> call = apiService.startGame(request);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(MainActivity.this, "Juego iniciado con éxito", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MainActivity.this, "Error al iniciar el juego", Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Error: " + response.code() + " " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Error en la solicitud: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", "Error: " + t.getMessage(), t);
            }
        });
    }


    private void showSettingsDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Settings");

        View dialogView = getLayoutInflater().inflate(R.layout.dialog_settings, null);
        builder.setView(dialogView);

        EditText editTextColumns = dialogView.findViewById(R.id.editText_columns);
        EditText editTextRows = dialogView.findViewById(R.id.editText_rows);


        editTextColumns.setText(String.valueOf(columns));
        editTextRows.setText(String.valueOf(rows));

        builder.setPositiveButton("Save", (dialog, which) -> {

            columns = Integer.parseInt(editTextColumns.getText().toString());
            rows = Integer.parseInt(editTextRows.getText().toString());
        });
        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());

        builder.show();
    }

    private void pauseGame() {
        Call<Void> call = apiService.pauseGame();
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(MainActivity.this, "Juego pausado con éxito", Toast.LENGTH_SHORT).show();
                    gamePaused = true;
                } else {
                    Toast.makeText(MainActivity.this, "Error al pausar el juego", Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Error: " + response.code() + " " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Error en la solicitud: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", "Error: " + t.getMessage(), t);
            }
        });
    }

    private void resumeGame() {
        Call<Void> call = apiService.resumeGame();
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(MainActivity.this, "Juego reanudado con éxito", Toast.LENGTH_SHORT).show();
                    gamePaused = false;
                } else {
                    Toast.makeText(MainActivity.this, "Error al reanudar el juego", Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Error: " + response.code() + " " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Error en la solicitud: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", "Error: " + t.getMessage(), t);
            }
        });
    }
}