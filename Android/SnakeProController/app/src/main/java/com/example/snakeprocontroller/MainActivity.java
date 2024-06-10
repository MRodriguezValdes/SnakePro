package com.example.snakeprocontroller;

import android.content.DialogInterface;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
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

    // API service to make requests to the game API
    private ApiService apiService;

    // Settings button
    Button buttonSetting;

    // Number of columns and rows for the game
    int columns = 20;
    int rows = 20;

    // Indicator if the game is paused
    private boolean gamePaused = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Logging interceptor for HTTP requests
        HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
        loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

        // HTTP client with the logging interceptor
        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(loggingInterceptor)
                .build();

        // Retrofit instance for API communication
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:5273/")
                .addConverterFactory(GsonConverterFactory.create())
                .client(client)
                .build();

        // Create the API service
        apiService = retrofit.create(ApiService.class);

        // Initialize buttons
        Button buttonUp = findViewById(R.id.button_up);
        Button buttonDown = findViewById(R.id.button_down);
        Button buttonLeft = findViewById(R.id.button_left);
        Button buttonRight = findViewById(R.id.button_right);
        Button buttonPlay = findViewById(R.id.button_play);
        Button buttonPause = findViewById(R.id.button_pause);
        buttonSetting = findViewById(R.id.button_settings);

        // Set shadow layer for play button
        buttonPlay.setShadowLayer(1, -1, -1, Color.BLACK);

        // Set shadow layer for pause button
        buttonPause.setShadowLayer(1, -1, -1, Color.BLACK);

        // Set shadow layer for settings button
        buttonSetting.setShadowLayer(1, -1, -1, Color.BLACK);

        // Set onClick listeners for movement buttons
        buttonUp.setOnClickListener(view -> sendMovement("ArrowUp"));
        buttonDown.setOnClickListener(view -> sendMovement("ArrowDown"));
        buttonLeft.setOnClickListener(view -> sendMovement("ArrowLeft"));
        buttonRight.setOnClickListener(view -> sendMovement("ArrowRight"));

        // Set onClick listener for play button
        buttonPlay.setOnClickListener(view -> startGame(columns, rows));

        // Set onClick listener for settings button
        buttonSetting.setOnClickListener(view -> showSettingsDialog());

        // Set onClick listener for pause button
        buttonPause.setOnClickListener(view -> {
            if (gamePaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        });
    }

    // Sends a movement command to the API
    private void sendMovement(String key) {
        Call<Void> call = apiService.setMovement(key);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(MainActivity.this, "Movement sent successfully", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MainActivity.this, "Error sending movement", Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Error: " + response.code() + " " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Request error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", "Error: " + t.getMessage(), t);
            }
        });
    }

    // Starts the game with the specified number of columns and rows
    private void startGame(int columns, int rows) {
        StartGameRequest request = new StartGameRequest(columns, rows);
        Call<Void> call = apiService.startGame(request);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(MainActivity.this, "Game started successfully", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MainActivity.this, "Error starting the game", Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Error: " + response.code() + " " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Request error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", "Error: " + t.getMessage(), t);
            }
        });
    }

    // Shows the settings dialog to configure columns and rows
    private void showSettingsDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Settings");

        // Inflate the custom dialog view
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_settings, null);
        builder.setView(dialogView);

        // Get references to the EditTexts for columns and rows
        EditText editTextColumns = dialogView.findViewById(R.id.editText_columns);
        EditText editTextRows = dialogView.findViewById(R.id.editText_rows);

        // Set the current values of columns and rows in the EditTexts
        editTextColumns.setText(String.valueOf(columns));
        editTextRows.setText(String.valueOf(rows));

        // Create the alert dialog
        AlertDialog dialog = builder.create();

        // Set the positive button (Save) and initially disable it
        dialog.setButton(DialogInterface.BUTTON_POSITIVE, "Save", (dialogInterface, which) -> {
            columns = Integer.parseInt(editTextColumns.getText().toString());
            rows = Integer.parseInt(editTextRows.getText().toString());
        });
        dialog.setButton(DialogInterface.BUTTON_NEGATIVE, "Cancel", (dialogInterface, which) -> dialog.cancel());

        // Disable the Save button initially
        dialog.setOnShowListener(dialogInterface -> {
            Button saveButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
            saveButton.setEnabled(false);

            TextWatcher textWatcher = new TextWatcher() {
                private boolean updating = false; // Flag to prevent infinite loop

                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) { }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) { }

                @Override
                public void afterTextChanged(Editable s) {
                    if (updating) return;

                    updating = true;
                    if (s == editTextColumns.getEditableText()) {
                        editTextRows.setText(s.toString());
                    } else if (s == editTextRows.getEditableText()) {
                        editTextColumns.setText(s.toString());
                    }

                    String columnsText = editTextColumns.getText().toString();
                    String rowsText = editTextRows.getText().toString();
                    boolean valid = isValidInput(columnsText, rowsText);

                    saveButton.setEnabled(valid);

                    if (!valid && (columnsText.length() > 0 || rowsText.length() > 0)) {
                        Toast.makeText(getApplicationContext(), "Both values must be between 10 and 30.", Toast.LENGTH_SHORT).show();
                    }

                    updating = false;
                }
            };

            editTextColumns.addTextChangedListener(textWatcher);
            editTextRows.addTextChangedListener(textWatcher);
        });

        // Show the dialog
        dialog.show();
    }

    private boolean isValidInput(String columnsText, String rowsText) {
        try {
            int columnsValue = Integer.parseInt(columnsText);
            int rowsValue = Integer.parseInt(rowsText);
            return columnsValue >= 10 && columnsValue <= 30 && rowsValue >= 10 && rowsValue <= 30;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    // Pauses the game by sending a pause request to the API
    private void pauseGame() {
        Call<Void> call = apiService.pauseGame();
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(MainActivity.this, "Game paused successfully", Toast.LENGTH_SHORT).show();
                    gamePaused = true;
                } else {
                    Toast.makeText(MainActivity.this, "Error pausing the game", Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Error: " + response.code() + " " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Request error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", "Error: " + t.getMessage(), t);
            }
        });
    }

    // Resumes the game by sending a resume request to the API
    private void resumeGame() {
        Call<Void> call = apiService.resumeGame();
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(MainActivity.this, "Game resumed successfully", Toast.LENGTH_SHORT).show();
                    gamePaused = false;
                } else {
                    Toast.makeText(MainActivity.this, "Error resuming the game", Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Error: " + response.code() + " " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Request error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", "Error: " + t.getMessage(), t);
            }
        });
    }
}