package com.example.snakeprocontroller;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private Button buttonUp, buttonDown, buttonLeft, buttonRight;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        buttonUp = findViewById(R.id.button_up);
        buttonDown = findViewById(R.id.button_down);
        buttonLeft = findViewById(R.id.button_left);
        buttonRight = findViewById(R.id.button_right);

        buttonUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendDirection("UP");
            }
        });

        buttonDown.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendDirection("DOWN");
            }
        });

        buttonLeft.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendDirection("LEFT");
            }
        });

        buttonRight.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendDirection("RIGHT");
            }
        });
    }

    private void sendDirection(String direction) {
        // Aquí puedes implementar el código para enviar la dirección a la aplicación web
        // Por ejemplo, puedes usar una petición HTTP, websockets, etc.
        // Por ahora, solo mostraremos un Toast como ejemplo
        Toast.makeText(this, "Direction: " + direction, Toast.LENGTH_SHORT).show();
    }
}
