package com.example.snakeprocontroller;
;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;

public class SplashScreenActivity extends AppCompatActivity {

    // Timeout duration for the splash screen in milliseconds
    private static int SPLASH_SCREEN_TIMEOUT = 3000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash_screen);

        // Load and start fade-in animation on the entire content view
        Animation fadeInAnimation = AnimationUtils.loadAnimation(this, R.anim.fade_in);
        findViewById(android.R.id.content).startAnimation(fadeInAnimation);

        // Find the ImageView for the logo
        ImageView imageLogo = findViewById(R.id.imageLogo);

        // Load and start slide-from-right animation on the logo
        Animation slideFromRightAnimation = AnimationUtils.loadAnimation(this, R.anim.slide_from_right);
        imageLogo.startAnimation(slideFromRightAnimation);

        // Delay the transition to MainActivity by SPLASH_SCREEN_TIMEOUT milliseconds
        new Handler().postDelayed(() -> {
            // Create an intent to start MainActivity
            Intent intent = new Intent(SplashScreenActivity.this, MainActivity.class);
            startActivity(intent);

            // Finish the SplashScreenActivity so it's removed from the back stack
            finish();
        }, SPLASH_SCREEN_TIMEOUT);
    }
}
