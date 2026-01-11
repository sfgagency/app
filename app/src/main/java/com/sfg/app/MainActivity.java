package com.sfg.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

/**
 * SFG - Sound of Germany
 * Diese Klasse ist das Herzstück deiner Android-App.
 * Sie verbindet deinen React-Code (gehostet auf Cloudflare) mit dem Android-System.
 */
public class MainActivity extends AppCompatActivity {

    private WebView myWebView;
    private ValueCallback<Uri[]> uploadMessage;
    private final static int FILECHOOSER_RESULTCODE = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Initialisiere die WebView
        myWebView = new WebView(this);
        setContentView(myWebView);

        // Einstellungen für deine React-App (JavaScript und Speicherzugriff)
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true); // Wichtig für den Login-Status (LocalStorage)
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        // Hardware-Beschleunigung für flüssige Animationen
        myWebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        // WebViewClient: Stellt sicher, dass die Navigation innerhalb der App bleibt
        myWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                // Falls der Cloudflare Worker mal nicht erreichbar ist
                super.onReceivedError(view, request, error);
            }
        });

        // WebChromeClient: Ermöglicht Video- und Dateiuploads für deine Tracks
        myWebView.setWebChromeClient(new WebChromeClient() {
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                                            WebChromeClient.FileChooserParams fileChooserParams) {
                if (uploadMessage != null) {
                    uploadMessage.onReceiveValue(null);
                }
                uploadMessage = filePathCallback;

                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILECHOOSER_RESULTCODE);
                } catch (Exception e) {
                    uploadMessage = null;
                    Toast.makeText(MainActivity.this, "Upload nicht möglich", Toast.LENGTH_LONG).show();
                    return false;
                }
                return true;
            }
        });

        // Lade die URL deiner Cloudflare-Anbindung
        // Hier wird die Verbindung zu deiner D1 Datenbank über den Worker hergestellt
        myWebView.loadUrl("https://sfg.j-gutschein2.workers.dev"); 
    }

    // Verarbeitung der Dateiauswahl (z.B. für Musik- oder Video-Uploads)
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (uploadMessage == null) return;
            uploadMessage.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            uploadMessage = null;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    // Ermöglicht die Nutzung der Android-Zurück-Taste innerhalb der Web-App
    @Override
    public void onBackPressed() {
        if (myWebView.canGoBack()) {
            myWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}