package com.giapzech.datvemaybay;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.widget.ProgressBar;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set the content view
        setContentView(R.layout.activity_main);

        // Find views
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);

        // Configure WebView settings
        WebSettings webSettings = webView.getSettings();
        webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK); // Prefer cached content
        webSettings.setDomStorageEnabled(true); // Enable DOM storage
        webSettings.setDatabaseEnabled(true); // Enable database storage
        webSettings.setJavaScriptEnabled(true); // Enable JavaScript
        webSettings.setLoadWithOverviewMode(true); // Adjust the layout to fit the screen
        webSettings.setUseWideViewPort(true); // Enable viewport meta tag

        // Set WebViewClient to handle navigation within WebView
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                // Show the ProgressBar when page starts loading
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Hide the ProgressBar when page finishes loading
                progressBar.setVisibility(View.GONE);
            }
        });

        // Optional: Use WebChromeClient for better progress control
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                // Update progress bar visibility based on loading progress
                if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                } else {
                    progressBar.setVisibility(View.VISIBLE);
                }
            }
        });

        // Load the desired URL
        webView.loadUrl("https://giapzech.tech");

        // Handle back navigation using OnBackPressedDispatcher
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack(); // Navigate back within the WebView
                } else {
                    finish(); // Finish the activity if no navigation history
                }
            }
        });
    }

    @Override
    protected void onDestroy() {
        // Clean up WebView to prevent memory leaks
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
