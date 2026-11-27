package com.nurulquran.app;

import android.Manifest;
import android.appwidget.AppWidgetManager;
import android.content.ClipData;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.hardware.GeomagneticField;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Base64;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.UpdateAvailability;
import com.google.android.play.core.review.ReviewInfo;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class MainActivity extends BridgeActivity implements SensorEventListener {
    private SensorManager sensorManager;
    private Sensor rotationVectorSensor;
    private Sensor accelSensor;
    private Sensor magnetSensor;

    private final float[] rotationMatrix = new float[9];
    private final float[] accelValues = new float[3];
    private final float[] magnetValues = new float[3];
    private boolean hasAccel = false;
    private boolean hasMagnet = false;

    private volatile boolean compassActive = false;
    private volatile float currentLat = 41.2995f;
    private volatile float currentLng = 69.2401f;
    private volatile float cachedDeclinationDeg = 0f;
    private volatile long declinationUpdatedAtMs = 0L;
    private volatile float lastHeadingDeg = 0f;
    private volatile boolean hasValidHeading = false;
    private volatile int sensorAccuracy = SensorManager.SENSOR_STATUS_ACCURACY_MEDIUM;
    private volatile boolean isDayTheme = true;
    private volatile boolean playStoreUpdateAvailable = false;
    private volatile int playStoreAvailableVersionCode = 0;
    private volatile boolean playStoreCheckCompleted = false;

    private void refreshPlayStoreUpdateState() {
        if (BuildConfig.ALLOW_DIRECT_OTA) return;
        try {
            AppUpdateManager mgr = AppUpdateManagerFactory.create(this);
            mgr.getAppUpdateInfo().addOnSuccessListener(info -> {
                int avail = info.updateAvailability();
                boolean isAvail = (avail == UpdateAvailability.UPDATE_AVAILABLE
                    || avail == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS);
                playStoreUpdateAvailable = isAvail;
                playStoreAvailableVersionCode = isAvail ? info.availableVersionCode() : 0;
                playStoreCheckCompleted = true;
            }).addOnFailureListener(e -> {
                playStoreCheckCompleted = true;
            });
        } catch (Exception e) {
            playStoreCheckCompleted = true;
        }
    }

    private void refreshDeclination(float lat, float lng) {
        GeomagneticField field = new GeomagneticField(lat, lng, 0f, System.currentTimeMillis());
        cachedDeclinationDeg = field.getDeclination();
        declinationUpdatedAtMs = System.currentTimeMillis();
    }

    private void applySystemBarAppearance(boolean isDay) {
        isDayTheme = isDay;
        runOnUiThread(() -> {
            Window window = getWindow();
            if (window == null) return;
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(isDay ? 0xFF0C4703 : 0xFF051F05);
            window.setNavigationBarColor(isDay ? 0xFFFFFFFF : 0xFF020617);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                window.setNavigationBarContrastEnforced(false);
            }
            WindowInsetsControllerCompat controller =
                WindowCompat.getInsetsController(window, window.getDecorView());
            if (controller != null) {
                controller.setAppearanceLightStatusBars(false);
                controller.setAppearanceLightNavigationBars(isDay);
            }
        });
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        applySystemBarAppearance(isDayTheme);

        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            rotationVectorSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
            if (rotationVectorSensor == null) {
                accelSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
                magnetSensor = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
            }
        }

        final WebView initialWebView = getBridge() != null ? getBridge().getWebView() : null;
        if (initialWebView != null) {
            initialWebView.addJavascriptInterface(new CompassJsBridge(), "NqCompassBridge");
            initialWebView.addJavascriptInterface(new NativePrayerJsBridge(), "NqNativeBridge");
            initialWebView.addJavascriptInterface(new AppUpdaterJsBridge(), "NqUpdaterBridge");
            initialWebView.addJavascriptInterface(new QuranAudioJsBridge(), "NqQuranAudioBridge");
        }

        QuranAudioService.setStateListener(stateJson -> {
            final WebView webView = getBridge() != null ? getBridge().getWebView() : null;
            if (webView == null) return;
            webView.post(() ->
                webView.evaluateJavascript(
                    "window.__nqOnNativeAudioState && window.__nqOnNativeAudioState(" + stateJson + ")",
                    null
                )
            );
        });

        handleNotificationLaunchIntent(getIntent());
        PrayerAlarmReceiver.ensureChannel(this);
        refreshPlayStoreUpdateState();

        final OnBackPressedCallback backCallback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                final WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                if (webView == null) {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                    setEnabled(true);
                    return;
                }

                webView.evaluateJavascript(
                    "(function(){ try { return typeof window.__nqOnAndroidBack === 'function' ? Boolean(window.__nqOnAndroidBack()) : false; } catch (e) { return false; } })()",
                    result -> {
                        if ("true".equals(result)) {
                            return;
                        }
                        if (webView.canGoBack()) {
                            webView.goBack();
                        } else {
                            setEnabled(false);
                            getOnBackPressedDispatcher().onBackPressed();
                            setEnabled(true);
                        }
                    }
                );
            }
        };

        getOnBackPressedDispatcher().addCallback(this, backCallback);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleNotificationLaunchIntent(intent);
    }

    private volatile int pendingOpenSurah = 0;
    private volatile int pendingOpenAyah = 0;

    private void handleNotificationLaunchIntent(Intent intent) {
        if (intent == null) return;
        int surah = intent.getIntExtra(QuranAudioService.EXTRA_OPEN_SURAH, 0);
        int ayah = intent.getIntExtra(QuranAudioService.EXTRA_OPEN_AYAH, 1);
        if (surah > 0) {
            pendingOpenSurah = surah;
            pendingOpenAyah = Math.max(1, ayah);
            final WebView webView = getBridge() != null ? getBridge().getWebView() : null;
            if (webView != null) {
                webView.post(() ->
                    webView.evaluateJavascript(
                        "window.__nqOpenQuranFromNotif && window.__nqOpenQuranFromNotif(" + pendingOpenSurah + "," + pendingOpenAyah + ")",
                        null
                    )
                );
            }
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        applySystemBarAppearance(isDayTheme);
        refreshPlayStoreUpdateState();
        if (compassActive) {
            registerCompassSensors();
        }
        final WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView != null) {
            webView.post(() ->
                webView.evaluateJavascript(
                    "window.__nqOnAppResume && window.__nqOnAppResume()",
                    null
                )
            );
        }
    }

    @Override
    public void onPause() {
        unregisterCompassSensors();
        super.onPause();
    }

    private void registerCompassSensors() {
        if (sensorManager == null) return;
        sensorManager.unregisterListener(this);
        if (rotationVectorSensor != null) {
            sensorManager.registerListener(this, rotationVectorSensor, SensorManager.SENSOR_DELAY_UI);
        } else if (accelSensor != null && magnetSensor != null) {
            sensorManager.registerListener(this, accelSensor, SensorManager.SENSOR_DELAY_UI);
            sensorManager.registerListener(this, magnetSensor, SensorManager.SENSOR_DELAY_UI);
        }
    }

    private void unregisterCompassSensors() {
        if (sensorManager != null) {
            sensorManager.unregisterListener(this);
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        boolean ready = false;
        if (event.sensor.getType() == Sensor.TYPE_ROTATION_VECTOR) {
            SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values);
            ready = true;
        } else if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            System.arraycopy(event.values, 0, accelValues, 0, 3);
            hasAccel = true;
            if (hasMagnet) {
                ready = SensorManager.getRotationMatrix(rotationMatrix, null, accelValues, magnetValues);
            }
        } else if (event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
            System.arraycopy(event.values, 0, magnetValues, 0, 3);
            hasMagnet = true;
            sensorAccuracy = event.accuracy;
            if (hasAccel) {
                ready = SensorManager.getRotationMatrix(rotationMatrix, null, accelValues, magnetValues);
            }
        }

        if (!ready) return;

        // Top edge (+Y) horizontal projection on Earth [East, North]; fallback to back (-Z) when held upright
        final float east;
        final float north;
        final float topHorizMagSq = rotationMatrix[1] * rotationMatrix[1] + rotationMatrix[4] * rotationMatrix[4];
        if (topHorizMagSq >= 0.12f) {
            east = rotationMatrix[1];
            north = rotationMatrix[4];
        } else {
            east = -rotationMatrix[2];
            north = -rotationMatrix[5];
        }

        double magneticDeg = Math.toDegrees(Math.atan2(east, north));
        if (declinationUpdatedAtMs == 0L) {
            refreshDeclination(currentLat, currentLng);
        }
        double trueDeg = (magneticDeg + cachedDeclinationDeg + 360.0) % 360.0;

        lastHeadingDeg = (float) trueDeg;
        hasValidHeading = true;
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        if (sensor.getType() == Sensor.TYPE_ROTATION_VECTOR || sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
            sensorAccuracy = accuracy;
        }
    }

    private class CompassJsBridge {
        @JavascriptInterface
        public void start(double lat, double lng) {
            currentLat = (float) lat;
            currentLng = (float) lng;
            refreshDeclination(currentLat, currentLng);
            compassActive = true;
            runOnUiThread(() -> registerCompassSensors());
        }

        @JavascriptInterface
        public void updateCoordinates(double lat, double lng) {
            currentLat = (float) lat;
            currentLng = (float) lng;
            refreshDeclination(currentLat, currentLng);
        }

        @JavascriptInterface
        public void stop() {
            compassActive = false;
            runOnUiThread(() -> unregisterCompassSensors());
        }

        @JavascriptInterface
        public String getState() {
            return "{\"active\":" + hasValidHeading
                + ",\"heading\":" + lastHeadingDeg
                + ",\"accuracy\":" + sensorAccuracy + "}";
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1001) {
            boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            final WebView webView = getBridge() != null ? getBridge().getWebView() : null;
            if (webView != null) {
                webView.post(() ->
                    webView.evaluateJavascript(
                        "window.__nqOnNotificationPermission && window.__nqOnNotificationPermission(" + granted + ")",
                        null
                    )
                );
            }
            if (granted) {
                PrayerAlarmScheduler.rescheduleAll(this);
            }
        } else if (requestCode == 1003) {
            boolean granted = false;
            if (grantResults != null) {
                for (int res : grantResults) {
                    if (res == PackageManager.PERMISSION_GRANTED) {
                        granted = true;
                        break;
                    }
                }
            }
            final boolean finalGranted = granted;
            final WebView webView = getBridge() != null ? getBridge().getWebView() : null;
            if (webView != null) {
                webView.post(() ->
                    webView.evaluateJavascript(
                        "window.__nqOnLocationPermission && window.__nqOnLocationPermission(" + finalGranted + ")",
                        null
                    )
                );
            }
        }
    }

    private class NativePrayerJsBridge {
        @JavascriptInterface
        public void syncData(String payloadJson) {
            PrayerStorage.savePayload(MainActivity.this, payloadJson);
            runOnUiThread(() -> {
                PrayerWidgetProvider.updateAllWidgets(MainActivity.this);
                PrayerAlarmScheduler.rescheduleAll(MainActivity.this);
            });
        }

        @JavascriptInterface
        public boolean hasNotificationPermission() {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
                return true;
            }
            return ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.POST_NOTIFICATIONS)
                == PackageManager.PERMISSION_GRANTED;
        }

        @JavascriptInterface
        public void requestNotificationPermission() {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                runOnUiThread(() ->
                    ActivityCompat.requestPermissions(
                        MainActivity.this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS},
                        1001
                    )
                );
            }
        }

        @JavascriptInterface
        public boolean hasLocationPermission() {
            return ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION)
                    == PackageManager.PERMISSION_GRANTED
                || ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION)
                    == PackageManager.PERMISSION_GRANTED;
        }

        @JavascriptInterface
        public void requestLocationPermission() {
            runOnUiThread(() ->
                ActivityCompat.requestPermissions(
                    MainActivity.this,
                    new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                    },
                    1003
                )
            );
        }

        @JavascriptInterface
        public String getNativeLocationJson() {
            try {
                if (!hasLocationPermission()) {
                    return "{\"ok\":false,\"reason\":\"no_permission\"}";
                }
                LocationManager lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
                if (lm == null) {
                    return "{\"ok\":false,\"reason\":\"no_manager\"}";
                }
                String[] providers = new String[]{
                    "fused",
                    LocationManager.GPS_PROVIDER,
                    LocationManager.NETWORK_PROVIDER,
                    LocationManager.PASSIVE_PROVIDER
                };
                Location best = null;
                long now = System.currentTimeMillis();
                for (String p : providers) {
                    try {
                        Location loc = lm.getLastKnownLocation(p);
                        if (loc == null) continue;
                        double lat = loc.getLatitude();
                        double lng = loc.getLongitude();
                        if (lat == 0.0 && lng == 0.0) continue;
                        if (best == null) {
                            best = loc;
                        } else {
                            long ageLoc = Math.max(0L, now - loc.getTime());
                            long ageBest = Math.max(0L, now - best.getTime());
                            // Prefer location fresher by at least 2 minutes, or better accuracy
                            if (ageLoc + 120_000L < ageBest || (Math.abs(ageLoc - ageBest) <= 120_000L && loc.getAccuracy() < best.getAccuracy())) {
                                best = loc;
                            }
                        }
                    } catch (Exception ignored) {
                    }
                }
                if (best != null) {
                    long ageMs = Math.max(0L, now - best.getTime());
                    return "{\"ok\":true,\"lat\":" + best.getLatitude()
                        + ",\"lng\":" + best.getLongitude()
                        + ",\"acc\":" + best.getAccuracy()
                        + ",\"ageMs\":" + ageMs + "}";
                }
                return "{\"ok\":false,\"reason\":\"no_last_known\"}";
            } catch (Exception e) {
                return "{\"ok\":false,\"reason\":\"error\"}";
            }
        }

        @JavascriptInterface
        public void sendTestNotification(String prayerName, String timeStr, String city) {
            runOnUiThread(() ->
                PrayerAlarmReceiver.showPrayerNotification(MainActivity.this, prayerName, timeStr, city, 0)
            );
        }

        @JavascriptInterface
        public boolean requestPinWidget() {
            return requestPinWidgetByKind("strip");
        }

        @JavascriptInterface
        public boolean requestPinWidgetByKind(String kind) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                AppWidgetManager mgr = AppWidgetManager.getInstance(MainActivity.this);
                if (mgr != null && mgr.isRequestPinAppWidgetSupported()) {
                    ComponentName widget = new ComponentName(MainActivity.this, PrayerStripWidgetProvider.class);
                    mgr.requestPinAppWidget(widget, null, null);
                    return true;
                }
            }
            return false;
        }

        @JavascriptInterface
        public void setSystemBarsTheme(boolean isDay) {
            applySystemBarAppearance(isDay);
        }

        @JavascriptInterface
        public String getHardwareId() {
            try {
                String rawId = Settings.Secure.getString(getContentResolver(), Settings.Secure.ANDROID_ID);
                if (rawId == null || rawId.trim().length() < 6) {
                    return "";
                }
                java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
                byte[] hash = digest.digest(("nurul_islam_hw_v1:" + rawId.trim().toLowerCase()).getBytes("UTF-8"));
                StringBuilder sb = new StringBuilder("nq_hw_");
                for (int i = 0; i < 12 && i < hash.length; i++) {
                    sb.append(String.format("%02x", hash[i]));
                }
                return sb.toString();
            } catch (Exception e) {
                return "";
            }
        }

        @JavascriptInterface
        public void saveProgressBackup(String snapshotJson) {
            try {
                PrayerStorage.saveProgressSnapshot(MainActivity.this, snapshotJson);
            } catch (Exception ignored) {
            }
        }

        @JavascriptInterface
        public String loadProgressBackup() {
            try {
                return PrayerStorage.loadProgressSnapshot(MainActivity.this);
            } catch (Exception e) {
                return "";
            }
        }

        @JavascriptInterface
        public void setKeepScreenOn(boolean keepOn) {
            runOnUiThread(() -> {
                Window window = getWindow();
                if (window == null) return;
                if (keepOn) {
                    window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                } else {
                    window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
            });
        }

        @JavascriptInterface
        public void setVideoFullscreen(boolean fullscreen) {
            runOnUiThread(() -> {
                try {
                    Window window = getWindow();
                    if (fullscreen) {
                        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
                        if (window != null) {
                            window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                            WindowInsetsControllerCompat controller =
                                WindowCompat.getInsetsController(window, window.getDecorView());
                            if (controller != null) {
                                controller.hide(WindowInsetsCompat.Type.systemBars());
                                controller.setSystemBarsBehavior(
                                    WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                                );
                            }
                        }
                    } else {
                        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
                        if (window != null) {
                            WindowInsetsControllerCompat controller =
                                WindowCompat.getInsetsController(window, window.getDecorView());
                            if (controller != null) {
                                controller.show(WindowInsetsCompat.Type.systemBars());
                            }
                        }
                        applySystemBarAppearance(isDayTheme);
                    }
                } catch (Exception ignored) {
                }
            });
        }

        @JavascriptInterface
        public void launchInAppReview() {
            runOnUiThread(() -> {
                try {
                    ReviewManager manager = ReviewManagerFactory.create(MainActivity.this);
                    manager.requestReviewFlow().addOnCompleteListener(task -> {
                        if (task.isSuccessful()) {
                            ReviewInfo reviewInfo = task.getResult();
                            manager.launchReviewFlow(MainActivity.this, reviewInfo);
                        }
                    });
                } catch (Exception ignored) {
                }
            });
        }

        @JavascriptInterface
        public boolean openExternalUrl(String url) {
            if (url == null) return false;
            String trimmed = url.trim();
            if (!(trimmed.startsWith("https://") || trimmed.startsWith("http://") || trimmed.startsWith("geo:"))) {
                return false;
            }
            try {
                Intent viewIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(trimmed));
                viewIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(viewIntent);
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public boolean shareImageBase64(String dataUrlOrBase64, String fileName, String caption) {
            if (dataUrlOrBase64 == null || dataUrlOrBase64.isEmpty()) return false;
            try {
                String cleanB64 = dataUrlOrBase64;
                int commaIdx = cleanB64.indexOf(',');
                if (commaIdx >= 0) {
                    cleanB64 = cleanB64.substring(commaIdx + 1);
                }
                byte[] bytes = Base64.decode(cleanB64, Base64.DEFAULT);
                if (bytes == null || bytes.length < 100) return false;

                String safeName = (fileName != null ? fileName : "nurul-islam-hikmat.png")
                    .replaceAll("[^a-zA-Z0-9._-]", "_");
                if (!safeName.endsWith(".png")) safeName += ".png";

                File sharedDir = new File(getCacheDir(), "shared");
                if (!sharedDir.exists()) sharedDir.mkdirs();
                File outFile = new File(sharedDir, safeName);
                try (FileOutputStream fos = new FileOutputStream(outFile)) {
                    fos.write(bytes);
                    fos.flush();
                }

                Uri contentUri = FileProvider.getUriForFile(
                    MainActivity.this,
                    getPackageName() + ".fileprovider",
                    outFile
                );
                Intent sendIntent = new Intent(Intent.ACTION_SEND);
                sendIntent.setType("image/png");
                sendIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
                if (caption != null && !caption.isEmpty()) {
                    sendIntent.putExtra(Intent.EXTRA_TEXT, caption);
                }
                sendIntent.setClipData(ClipData.newRawUri("Nurul Islam", contentUri));
                sendIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                Intent chooser = Intent.createChooser(sendIntent, null);
                chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                runOnUiThread(() -> startActivity(chooser));
                return true;
            } catch (Exception e) {
                return false;
            }
        }
    }

    private void notifyUpdateProgress(int pct, String status) {
        final WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView == null) return;
        String safeStatus = status.replace("'", "");
        webView.post(() ->
            webView.evaluateJavascript(
                "window.__nqOnUpdateProgress && window.__nqOnUpdateProgress(" + pct + ",'" + safeStatus + "')",
                null
            )
        );
    }

    private class AppUpdaterJsBridge {
        @JavascriptInterface
        public String getAppVersionJson() {
            try {
                PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), 0);
                long code = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
                    ? info.getLongVersionCode()
                    : info.versionCode;
                String name = info.versionName != null ? info.versionName : "1.0.0";
                return "{\"versionCode\":" + code + ",\"versionName\":\"" + name + "\"}";
            } catch (Exception e) {
                return "{\"versionCode\":1,\"versionName\":\"1.0.0\"}";
            }
        }

        @JavascriptInterface
        public boolean isDirectOtaEnabled() {
            return BuildConfig.ALLOW_DIRECT_OTA;
        }

        @JavascriptInterface
        public void requestFreshPlayStoreUpdateCheck() {
            playStoreCheckCompleted = false;
            refreshPlayStoreUpdateState();
        }

        @JavascriptInterface
        public String getPlayStoreUpdateStateJson() {
            if (!playStoreCheckCompleted) {
                refreshPlayStoreUpdateState();
            }
            return "{\"checked\":" + playStoreCheckCompleted
                + ",\"available\":" + playStoreUpdateAvailable
                + ",\"versionCode\":" + playStoreAvailableVersionCode + "}";
        }

        @JavascriptInterface
        public void startPlayStoreInAppUpdate() {
            runOnUiThread(() -> {
                try {
                    AppUpdateManager mgr = AppUpdateManagerFactory.create(MainActivity.this);
                    mgr.getAppUpdateInfo().addOnSuccessListener(info -> {
                        try {
                            if (info.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                                && info.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                                mgr.startUpdateFlowForResult(
                                    info,
                                    MainActivity.this,
                                    AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build(),
                                    1002
                                );
                            } else {
                                openPlayStoreListing();
                            }
                        } catch (Exception ex) {
                            openPlayStoreListing();
                        }
                    }).addOnFailureListener(e -> openPlayStoreListing());
                } catch (Exception e) {
                    openPlayStoreListing();
                }
            });
        }

        private void openPlayStoreListing() {
            try {
                Intent marketIntent = new Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse("market://details?id=" + getPackageName())
                );
                marketIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(marketIntent);
            } catch (Exception e) {
                try {
                    Intent webIntent = new Intent(
                        Intent.ACTION_VIEW,
                        Uri.parse("https://play.google.com/store/apps/details?id=" + getPackageName())
                    );
                    webIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(webIntent);
                } catch (Exception ignored) {
                }
            }
        }

        @JavascriptInterface
        public boolean canRequestPackageInstalls() {
            if (!BuildConfig.ALLOW_DIRECT_OTA) {
                return false;
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                return getPackageManager().canRequestPackageInstalls();
            }
            return true;
        }

        @JavascriptInterface
        public void openInstallPermissionSettings() {
            if (!BuildConfig.ALLOW_DIRECT_OTA) {
                return;
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                runOnUiThread(() -> {
                    Intent intent = new Intent(
                        Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:" + getPackageName())
                    );
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                });
            }
        }

        @JavascriptInterface
        public void downloadAndInstall(String apkUrl) {
            if (!BuildConfig.ALLOW_DIRECT_OTA) {
                notifyUpdateProgress(0, "error");
                return;
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !getPackageManager().canRequestPackageInstalls()) {
                notifyUpdateProgress(0, "needs_permission");
                openInstallPermissionSettings();
                return;
            }

            new Thread(() -> {
                HttpURLConnection conn = null;
                try {
                    notifyUpdateProgress(0, "downloading");
                    String currentUrl = apkUrl;
                    for (int hop = 0; hop < 5; hop++) {
                        URL url = new URL(currentUrl);
                        conn = (HttpURLConnection) url.openConnection();
                        conn.setConnectTimeout(15000);
                        conn.setReadTimeout(30000);
                        conn.setInstanceFollowRedirects(false);
                        int code = conn.getResponseCode();
                        if (code >= 300 && code < 400) {
                            String loc = conn.getHeaderField("Location");
                            conn.disconnect();
                            if (loc == null || loc.isEmpty()) break;
                            currentUrl = new URL(url, loc).toString();
                            continue;
                        }
                        break;
                    }

                    if (conn == null || conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                        notifyUpdateProgress(0, "error");
                        return;
                    }

                    int totalBytes = conn.getContentLength();
                    File updatesDir = new File(getCacheDir(), "updates");
                    if (!updatesDir.exists()) {
                        updatesDir.mkdirs();
                    }
                    File outApk = new File(updatesDir, "nurul-quran-update.apk");

                    try (InputStream in = conn.getInputStream();
                         FileOutputStream out = new FileOutputStream(outApk)) {
                        byte[] buf = new byte[16384];
                        long downloaded = 0;
                        int lastReportedPct = -1;
                        int n;
                        while ((n = in.read(buf)) != -1) {
                            out.write(buf, 0, n);
                            downloaded += n;
                            if (totalBytes > 0) {
                                int pct = (int) Math.min(99, (downloaded * 100L) / totalBytes);
                                if (pct != lastReportedPct) {
                                    lastReportedPct = pct;
                                    notifyUpdateProgress(pct, "downloading");
                                }
                            }
                        }
                        out.flush();
                    }

                    if (outApk.length() < 100_000) {
                        notifyUpdateProgress(0, "error");
                        return;
                    }

                    notifyUpdateProgress(100, "installing");
                    Uri contentUri = FileProvider.getUriForFile(
                        MainActivity.this,
                        getPackageName() + ".fileprovider",
                        outApk
                    );
                    Intent installIntent = new Intent(Intent.ACTION_VIEW);
                    installIntent.setDataAndType(contentUri, "application/vnd.android.package-archive");
                    installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                    runOnUiThread(() -> startActivity(installIntent));
                } catch (Exception e) {
                    notifyUpdateProgress(0, "error");
                } finally {
                    if (conn != null) conn.disconnect();
                }
            }).start();
        }
    }

    private static final ConcurrentHashMap<Integer, String> audioDownloadStatusMap = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<Integer, Integer> audioDownloadPctMap = new ConcurrentHashMap<>();

    private class QuranAudioJsBridge {
        private void requestNotifPermissionIfMissing() {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                    runOnUiThread(() ->
                        ActivityCompat.requestPermissions(
                            MainActivity.this,
                            new String[]{Manifest.permission.POST_NOTIFICATIONS},
                            1001
                        )
                    );
                }
            }
        }

        @JavascriptInterface
        public void loadAndPlay(String payloadJson) {
            requestNotifPermissionIfMissing();
            Intent intent = new Intent(MainActivity.this, QuranAudioService.class);
            intent.setAction(QuranAudioService.ACTION_LOAD_PLAY);
            intent.putExtra(QuranAudioService.EXTRA_PAYLOAD, payloadJson);
            ContextCompat.startForegroundService(MainActivity.this, intent);
        }

        @JavascriptInterface
        public void togglePlayPause() {
            Intent intent = new Intent(MainActivity.this, QuranAudioService.class);
            intent.setAction(QuranAudioService.ACTION_TOGGLE);
            ContextCompat.startForegroundService(MainActivity.this, intent);
        }

        @JavascriptInterface
        public void play() {
            Intent intent = new Intent(MainActivity.this, QuranAudioService.class);
            intent.setAction(QuranAudioService.ACTION_PLAY);
            ContextCompat.startForegroundService(MainActivity.this, intent);
        }

        @JavascriptInterface
        public void pause() {
            Intent intent = new Intent(MainActivity.this, QuranAudioService.class);
            intent.setAction(QuranAudioService.ACTION_PAUSE);
            startService(intent);
        }

        @JavascriptInterface
        public void nextAyah() {
            Intent intent = new Intent(MainActivity.this, QuranAudioService.class);
            intent.setAction(QuranAudioService.ACTION_NEXT);
            ContextCompat.startForegroundService(MainActivity.this, intent);
        }

        @JavascriptInterface
        public void prevAyah() {
            Intent intent = new Intent(MainActivity.this, QuranAudioService.class);
            intent.setAction(QuranAudioService.ACTION_PREV);
            ContextCompat.startForegroundService(MainActivity.this, intent);
        }

        @JavascriptInterface
        public void seekMs(long ms) {
            Intent intent = new Intent(MainActivity.this, QuranAudioService.class);
            intent.setAction(QuranAudioService.ACTION_SEEK_MS);
            intent.putExtra(QuranAudioService.EXTRA_SEEK_MS, ms);
            startService(intent);
        }

        @JavascriptInterface
        public void jumpToAyah(int ayahNum, double seekFraction, long offsetMs) {
            Intent intent = new Intent(MainActivity.this, QuranAudioService.class);
            intent.setAction(QuranAudioService.ACTION_JUMP_AYAH);
            intent.putExtra(QuranAudioService.EXTRA_AYAH_NUM, ayahNum);
            intent.putExtra(QuranAudioService.EXTRA_SEEK_FRACTION, seekFraction);
            intent.putExtra(QuranAudioService.EXTRA_SEEK_MS, offsetMs);
            startService(intent);
        }

        @JavascriptInterface
        public boolean isSurahAudioDownloaded(int surahNumber) {
            return isSurahAudioDownloadedForReciter(surahNumber, "alafasy");
        }

        @JavascriptInterface
        public boolean isSurahAudioDownloadedForReciter(int surahNumber, String reciterKey) {
            return QuranAudioService.isPerAyahOfflineComplete(MainActivity.this, surahNumber, reciterKey)
                || QuranAudioService.isFullSurahOfflineReady(MainActivity.this, surahNumber, reciterKey);
        }

        @JavascriptInterface
        public void removeOfflineSurahAudio(int surahNumber) {
            removeOfflineSurahAudioForReciter(surahNumber, "alafasy");
        }

        @JavascriptInterface
        public void removeOfflineSurahAudioForReciter(int surahNumber, String reciterKey) {
            audioDownloadStatusMap.remove(surahNumber);
            audioDownloadPctMap.remove(surahNumber);
            QuranAudioService.deleteLocalPerAyahDir(MainActivity.this, surahNumber, reciterKey);
            File legacy = QuranAudioService.getLocalAudioFile(MainActivity.this, surahNumber, reciterKey);
            if (legacy.exists()) {
                legacy.delete();
            }
            notifyAudioDownload(surahNumber, "idle", 0);
        }

        @JavascriptInterface
        public String getDownloadStatesJson() {
            try {
                org.json.JSONObject root = new org.json.JSONObject();
                for (Map.Entry<Integer, String> entry : audioDownloadStatusMap.entrySet()) {
                    Integer sNum = entry.getKey();
                    String st = entry.getValue();
                    if (!"downloading".equals(st) && !"error".equals(st)) continue;
                    org.json.JSONObject item = new org.json.JSONObject();
                    item.put("status", st);
                    Integer pct = audioDownloadPctMap.get(sNum);
                    item.put("pct", pct != null ? pct : 0);
                    root.put(String.valueOf(sNum), item);
                }
                return root.toString();
            } catch (Exception e) {
                return "{}";
            }
        }

        private boolean downloadUrlToFile(String urlStr, File destFile) {
            File tmp = new File(destFile.getParentFile(), destFile.getName() + ".tmp");
            HttpURLConnection conn = null;
            try {
                URL url = new URL(urlStr);
                conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(10000);
                conn.setReadTimeout(25000);
                conn.setInstanceFollowRedirects(true);
                if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                    return false;
                }
                try (InputStream in = conn.getInputStream();
                     FileOutputStream out = new FileOutputStream(tmp)) {
                    byte[] buf = new byte[16384];
                    int n;
                    while ((n = in.read(buf)) != -1) {
                        out.write(buf, 0, n);
                    }
                    out.flush();
                }
                if (tmp.exists() && tmp.length() > 1_000L) {
                    if (destFile.exists()) destFile.delete();
                    return tmp.renameTo(destFile);
                }
            } catch (Exception ignored) {
                if (tmp.exists()) tmp.delete();
            } finally {
                if (conn != null) conn.disconnect();
            }
            if (tmp.exists()) tmp.delete();
            return false;
        }

        private boolean downloadUrlToFileWithProgress(String urlStr, File destFile, int surahNumber) {
            File tmp = new File(destFile.getParentFile(), destFile.getName() + ".tmp");
            HttpURLConnection conn = null;
            try {
                URL url = new URL(urlStr);
                conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(12000);
                conn.setReadTimeout(30000);
                conn.setInstanceFollowRedirects(true);
                if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                    return false;
                }
                long totalBytes = conn.getContentLengthLong();
                long downloaded = 0L;
                int lastPct = 0;
                try (InputStream in = conn.getInputStream();
                     FileOutputStream out = new FileOutputStream(tmp)) {
                    byte[] buf = new byte[16384];
                    int n;
                    while ((n = in.read(buf)) != -1) {
                        out.write(buf, 0, n);
                        downloaded += n;
                        if (totalBytes > 0) {
                            int pct = (int) Math.min(99, (downloaded * 100L) / totalBytes);
                            if (pct > lastPct) {
                                lastPct = pct;
                                audioDownloadPctMap.put(surahNumber, pct);
                                notifyAudioDownload(surahNumber, "downloading", pct);
                            }
                        }
                    }
                    out.flush();
                }
                if (tmp.exists() && tmp.length() > 10_000L) {
                    if (destFile.exists()) destFile.delete();
                    return tmp.renameTo(destFile);
                }
            } catch (Exception ignored) {
                if (tmp.exists()) tmp.delete();
            } finally {
                if (conn != null) conn.disconnect();
            }
            if (tmp.exists()) tmp.delete();
            return false;
        }

        @JavascriptInterface
        public void downloadSurahAudio(int surahNumber, String urlsJson) {
            if ("downloading".equals(audioDownloadStatusMap.get(surahNumber))) {
                return;
            }
            audioDownloadStatusMap.put(surahNumber, "downloading");
            audioDownloadPctMap.put(surahNumber, 0);
            notifyAudioDownload(surahNumber, "downloading", 0);

            new Thread(() -> {
                try {
                    String trimmed = urlsJson != null ? urlsJson.trim() : "";
                    if (trimmed.startsWith("{")) {
                        org.json.JSONObject root = new org.json.JSONObject(trimmed);
                        final String reciterKey = QuranAudioService.sanitizeReciterKey(root.optString("reciterKey", "alafasy"));
                        final boolean preferFull = root.optBoolean("preferFullSurah", false);
                        if (QuranAudioService.isPerAyahOfflineComplete(MainActivity.this, surahNumber, reciterKey)
                            || (preferFull && QuranAudioService.isFullSurahOfflineReady(MainActivity.this, surahNumber, reciterKey))) {
                            audioDownloadStatusMap.put(surahNumber, "done");
                            audioDownloadPctMap.put(surahNumber, 100);
                            notifyAudioDownload(surahNumber, "done", 100);
                            return;
                        }
                        if (preferFull) {
                            org.json.JSONArray fullArr = root.optJSONArray("fullUrls");
                            if (fullArr != null && fullArr.length() > 0) {
                                File destFull = QuranAudioService.getLocalAudioFile(MainActivity.this, surahNumber, reciterKey);
                                for (int u = 0; u < fullArr.length(); u++) {
                                    String candUrl = fullArr.optString(u, "");
                                    if (!candUrl.isEmpty() && downloadUrlToFileWithProgress(candUrl, destFull, surahNumber)) {
                                        audioDownloadStatusMap.put(surahNumber, "done");
                                        audioDownloadPctMap.put(surahNumber, 100);
                                        notifyAudioDownload(surahNumber, "done", 100);
                                        return;
                                    }
                                }
                            }
                        }
                        org.json.JSONArray ayahsArr = root.optJSONArray("ayahs");
                        if (ayahsArr != null && ayahsArr.length() > 0) {
                            File dir = QuranAudioService.getLocalAyahDir(MainActivity.this, surahNumber, reciterKey);
                            if (!dir.exists()) dir.mkdirs();

                            final int total = ayahsArr.length();
                            final java.util.concurrent.atomic.AtomicInteger nextIdx = new java.util.concurrent.atomic.AtomicInteger(0);
                            final java.util.concurrent.atomic.AtomicInteger doneCount = new java.util.concurrent.atomic.AtomicInteger(0);
                            final java.util.concurrent.atomic.AtomicInteger lastReportedPct = new java.util.concurrent.atomic.AtomicInteger(0);
                            final java.util.concurrent.atomic.AtomicBoolean anyFailed = new java.util.concurrent.atomic.AtomicBoolean(false);

                            int workerCount = Math.min(4, total);
                            Thread[] workers = new Thread[workerCount];
                            for (int w = 0; w < workerCount; w++) {
                                workers[w] = new Thread(() -> {
                                    while (!anyFailed.get()) {
                                        int idx = nextIdx.getAndIncrement();
                                        if (idx >= total) break;
                                        org.json.JSONObject row = ayahsArr.optJSONObject(idx);
                                        if (row == null) {
                                            anyFailed.set(true);
                                            break;
                                        }
                                        int ayahNum = row.optInt("ayahNumber", idx + 1);
                                        File dest = QuranAudioService.getLocalAyahFile(MainActivity.this, surahNumber, ayahNum, reciterKey);
                                        boolean ok = dest.exists() && dest.length() > 1_000L;
                                        if (!ok) {
                                            org.json.JSONArray candidates = row.optJSONArray("urls");
                                            if (candidates != null) {
                                                for (int u = 0; u < candidates.length(); u++) {
                                                    String candUrl = candidates.optString(u, "");
                                                    if (!candUrl.isEmpty() && downloadUrlToFile(candUrl, dest)) {
                                                        ok = true;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        if (!ok) {
                                            anyFailed.set(true);
                                            break;
                                        }
                                        int finished = doneCount.incrementAndGet();
                                        int pct = (int) Math.min(99, (finished * 100L) / total);
                                        int prevPct = lastReportedPct.get();
                                        if (pct > prevPct && lastReportedPct.compareAndSet(prevPct, pct)) {
                                            audioDownloadPctMap.put(surahNumber, pct);
                                            notifyAudioDownload(surahNumber, "downloading", pct);
                                        }
                                    }
                                });
                                workers[w].start();
                            }
                            for (Thread worker : workers) {
                                worker.join();
                            }

                            if (!anyFailed.get() && doneCount.get() == total) {
                                File marker = new File(dir, ".complete");
                                try (FileOutputStream out = new FileOutputStream(marker)) {
                                    out.write('1');
                                }
                                File legacy = QuranAudioService.getLocalAudioFile(MainActivity.this, surahNumber, reciterKey);
                                if (legacy.exists()) legacy.delete();

                                audioDownloadStatusMap.put(surahNumber, "done");
                                audioDownloadPctMap.put(surahNumber, 100);
                                notifyAudioDownload(surahNumber, "done", 100);
                                return;
                            }
                        }
                    }
                } catch (Exception ignored) {}

                audioDownloadStatusMap.put(surahNumber, "error");
                audioDownloadPctMap.put(surahNumber, 0);
                notifyAudioDownload(surahNumber, "error", 0);
            }).start();
        }

        private void notifyAudioDownload(int surahNumber, String status, int pct) {
            final WebView webView = getBridge() != null ? getBridge().getWebView() : null;
            if (webView == null) return;
            webView.post(() ->
                webView.evaluateJavascript(
                    "window.__nqOnAudioDownload && window.__nqOnAudioDownload(" + surahNumber + ",'" + status + "'," + pct + ")",
                    null
                )
            );
        }

        @JavascriptInterface
        public void stop() {
            Intent intent = new Intent(MainActivity.this, QuranAudioService.class);
            intent.setAction(QuranAudioService.ACTION_STOP);
            startService(intent);
        }

        @JavascriptInterface
        public String getState() {
            return QuranAudioService.getLatestStateJson();
        }

        @JavascriptInterface
        public String consumePendingOpen() {
            int s = pendingOpenSurah;
            int a = pendingOpenAyah;
            pendingOpenSurah = 0;
            pendingOpenAyah = 0;
            return "{\"surahNumber\":" + s + ",\"ayahNumber\":" + a + "}";
        }
    }
}
