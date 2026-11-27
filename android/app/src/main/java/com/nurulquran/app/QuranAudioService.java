package com.nurulquran.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.MediaMetadata;
import android.media.MediaPlayer;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.util.Log;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Foreground MediaPlayback Service + MediaSession player for Nurul-Quran.
 * Plays complete Surah MP3 files seamlessly in the background (with per-ayah CDN fallback),
 * supports local offline downloaded MP3 playback, and displays full-Surah duration +
 * working Prev/Play-Pause/Next/Close controls in the Android notification bar & lock screen.
 */
public class QuranAudioService extends Service {
    private static final String TAG = "QuranAudioService";
    public static final String CHANNEL_ID = "nq_quran_audio_v1";
    private static final int NOTIFICATION_ID = 4102;

    public static final String ACTION_LOAD_PLAY = "app.nurul.islam.QURAN_LOAD_PLAY";
    public static final String ACTION_PLAY = "app.nurul.islam.QURAN_PLAY";
    public static final String ACTION_PAUSE = "app.nurul.islam.QURAN_PAUSE";
    public static final String ACTION_TOGGLE = "app.nurul.islam.QURAN_TOGGLE";
    public static final String ACTION_NEXT = "app.nurul.islam.QURAN_NEXT";
    public static final String ACTION_PREV = "app.nurul.islam.QURAN_PREV";
    public static final String ACTION_SEEK_MS = "app.nurul.islam.QURAN_SEEK_MS";
    public static final String ACTION_JUMP_AYAH = "app.nurul.islam.QURAN_JUMP_AYAH";
    public static final String ACTION_STOP = "app.nurul.islam.QURAN_STOP";

    public static final String EXTRA_PAYLOAD = "payload";
    public static final String EXTRA_SEEK_MS = "seekMs";
    public static final String EXTRA_AYAH_NUM = "ayahNum";
    public static final String EXTRA_SEEK_FRACTION = "seekFraction";
    public static final String EXTRA_OPEN_SURAH = "nq_open_surah";
    public static final String EXTRA_OPEN_AYAH = "nq_open_ayah";

    public interface StateListener {
        void onAudioStateChanged(String jsonState);
    }

    private static volatile StateListener stateListener;
    private static volatile String latestStateJson = "{\"active\":false,\"isPlaying\":false}";
    private static volatile QuranAudioService activeInstance;

    public static void setStateListener(StateListener listener) {
        stateListener = listener;
    }

    public static String getLatestStateJson() {
        QuranAudioService inst = activeInstance;
        if (inst != null) {
            return inst.buildStateJson();
        }
        return latestStateJson;
    }

    public static String sanitizeReciterKey(String key) {
        if (key == null) return "alafasy";
        String cleaned = key.trim().toLowerCase(java.util.Locale.US).replaceAll("[^a-z0-9_]", "");
        return cleaned.isEmpty() ? "alafasy" : cleaned;
    }

    private static File getReciterRootDir(Context ctx, String reciterKey) {
        String safe = sanitizeReciterKey(reciterKey);
        File base = new File(ctx.getFilesDir(), "quran_audio");
        if ("alafasy".equals(safe)) {
            return base;
        }
        return new File(base, safe);
    }

    public static File getLocalAudioFile(Context ctx, int surahNum) {
        return getLocalAudioFile(ctx, surahNum, "alafasy");
    }

    public static File getLocalAudioFile(Context ctx, int surahNum, String reciterKey) {
        File dir = getReciterRootDir(ctx, reciterKey);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return new File(dir, "surah_" + surahNum + ".mp3");
    }

    public static File getLocalAyahDir(Context ctx, int surahNum) {
        return getLocalAyahDir(ctx, surahNum, "alafasy");
    }

    public static File getLocalAyahDir(Context ctx, int surahNum, String reciterKey) {
        return new File(getReciterRootDir(ctx, reciterKey), "surah_" + surahNum);
    }

    public static File getLocalAyahFile(Context ctx, int surahNum, int ayahNum) {
        return getLocalAyahFile(ctx, surahNum, ayahNum, "alafasy");
    }

    public static File getLocalAyahFile(Context ctx, int surahNum, int ayahNum, String reciterKey) {
        return new File(getLocalAyahDir(ctx, surahNum, reciterKey), ayahNum + ".mp3");
    }

    public static boolean isPerAyahOfflineComplete(Context ctx, int surahNum) {
        return isPerAyahOfflineComplete(ctx, surahNum, "alafasy");
    }

    public static boolean isPerAyahOfflineComplete(Context ctx, int surahNum, String reciterKey) {
        File marker = new File(getLocalAyahDir(ctx, surahNum, reciterKey), ".complete");
        return marker.exists();
    }

    public static boolean isFullSurahOfflineReady(Context ctx, int surahNum, String reciterKey) {
        File f = getLocalAudioFile(ctx, surahNum, reciterKey);
        return f.exists() && f.length() > 10_000L;
    }

    public static void deleteLocalPerAyahDir(Context ctx, int surahNum) {
        deleteLocalPerAyahDir(ctx, surahNum, "alafasy");
    }

    public static void deleteLocalPerAyahDir(Context ctx, int surahNum, String reciterKey) {
        File dir = getLocalAyahDir(ctx, surahNum, reciterKey);
        if (!dir.exists() || !dir.isDirectory()) return;
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                f.delete();
            }
        }
        dir.delete();
    }

    private static class AyahItem {
        final int ayahNumber;
        final List<String> urls;

        AyahItem(int ayahNumber, List<String> urls) {
            this.ayahNumber = ayahNumber;
            this.urls = urls;
        }
    }

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private MediaPlayer mediaPlayer;
    private MediaPlayer nextMediaPlayer;
    private boolean nextPlayerPrepared = false;
    private int nextPreparedIndex = -1;
    private Runnable activePrepareTimeout;
    private MediaSession mediaSession;
    private AudioManager audioManager;
    private AudioFocusRequest audioFocusRequest;
    private boolean noisyReceiverRegistered = false;
    private Bitmap largeIconBitmap;

    private boolean isFullSurahMode = false;
    private final List<String> fullSurahUrls = new ArrayList<>();
    private int fullSurahCandIdx = 0;

    // 1..114 catalog so Next/Prev Surah works directly in notification bar even when app is closed
    private final List<String> catalogNames = new ArrayList<>();
    private final List<Integer> catalogAyahCounts = new ArrayList<>();

    private final List<AyahItem> playlist = new ArrayList<>();
    private int surahNumber = 0;
    private String surahName = "Nurul Islam";
    private String reciterName = "Mishary Rashid Al-Afasy";
    private String reciterKey = "alafasy";
    private String everyAyahFolder = "Alafasy_128kbps";
    private String mp3QuranBase = "https://server8.mp3quran.net/afs";
    private String ayahPrefix = "Oyat";
    private int totalAyahsCount = 0;
    private int currentIndex = 0;
    private int currentCandidateIdx = 0;
    private int lastNotifiedAyah = -1;
    private long pendingSeekMs = 0;
    private double pendingStartFraction = -1.0;
    private boolean isPlaying = false;
    private boolean isPreparing = false;
    private boolean resumeOnFocusGain = false;
    private long currentDurationMs = 0;
    private long cachedPositionMs = 0;
    private int loadToken = 0;

    private final Runnable ayahTrackerTick = new Runnable() {
        @Override
        public void run() {
            if (!isPlaying || isPreparing || !isFullSurahMode) return;
            int estAyah = computeCurrentAyahNumber();
            if (estAyah != lastNotifiedAyah) {
                lastNotifiedAyah = estAyah;
                updateMediaSessionState();
                NotificationManager mgr = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                if (mgr != null) {
                    mgr.notify(NOTIFICATION_ID, buildNotification());
                }
            }
            emitState();
            mainHandler.postDelayed(this, 1500);
        }
    };

    private final BroadcastReceiver noisyReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (AudioManager.ACTION_AUDIO_BECOMING_NOISY.equals(intent.getAction())) {
                pausePlayback();
            }
        }
    };

    private final AudioManager.OnAudioFocusChangeListener focusChangeListener = focusChange -> {
        if (focusChange == AudioManager.AUDIOFOCUS_LOSS) {
            resumeOnFocusGain = false;
            pausePlayback();
        } else if (focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
            if (isPlaying) {
                resumeOnFocusGain = true;
                pausePlayback();
            }
        } else if (focusChange == AudioManager.AUDIOFOCUS_GAIN) {
            if (mediaPlayer != null) {
                try {
                    mediaPlayer.setVolume(1.0f, 1.0f);
                } catch (Exception ignored) {}
            }
            if (resumeOnFocusGain) {
                resumeOnFocusGain = false;
                resumePlayback();
            }
        } else if (focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK) {
            if (mediaPlayer != null && isPlaying) {
                try {
                    mediaPlayer.setVolume(0.25f, 0.25f);
                } catch (Exception ignored) {}
            }
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        activeInstance = this;
        audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        largeIconBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
        ensureChannel();
        initMediaSession();
        registerNoisyReceiver();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) return START_NOT_STICKY;
        String action = intent.getAction();
        if (action == null) return START_NOT_STICKY;

        switch (action) {
            case ACTION_LOAD_PLAY: {
                String payload = intent.getStringExtra(EXTRA_PAYLOAD);
                if (payload != null && !payload.isEmpty()) {
                    handleLoadAndPlay(payload);
                } else if (hasLoadedSource()) {
                    resumePlayback();
                } else {
                    ensureForegroundThenStop();
                }
                break;
            }
            case ACTION_PLAY:
                if (!hasLoadedSource()) {
                    ensureForegroundThenStop();
                } else {
                    resumePlayback();
                }
                break;
            case ACTION_PAUSE:
                pausePlayback();
                break;
            case ACTION_TOGGLE:
                if (!hasLoadedSource()) {
                    ensureForegroundThenStop();
                } else if (isPlaying) {
                    pausePlayback();
                } else {
                    resumePlayback();
                }
                break;
            case ACTION_NEXT:
                if (!hasLoadedSource()) {
                    ensureForegroundThenStop();
                } else {
                    skipNext();
                }
                break;
            case ACTION_PREV:
                if (!hasLoadedSource()) {
                    ensureForegroundThenStop();
                } else {
                    skipPrev();
                }
                break;
            case ACTION_SEEK_MS: {
                long seekMs = intent.getLongExtra(EXTRA_SEEK_MS, 0L);
                seekToMs(seekMs);
                break;
            }
            case ACTION_JUMP_AYAH: {
                int ayahNum = intent.getIntExtra(EXTRA_AYAH_NUM, 1);
                double frac = intent.getDoubleExtra(EXTRA_SEEK_FRACTION, -1.0);
                long seekMs = intent.getLongExtra(EXTRA_SEEK_MS, 0L);
                jumpToAyah(ayahNum, frac, seekMs);
                break;
            }
            case ACTION_STOP:
                stopPlaybackAndService();
                break;
            default:
                break;
        }
        return START_NOT_STICKY;
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        if (!isPlaying && !isPreparing && !hasLoadedSource()) {
            stopPlaybackAndService();
        }
        super.onTaskRemoved(rootIntent);
    }

    @Override
    public void onDestroy() {
        activeInstance = null;
        mainHandler.removeCallbacks(ayahTrackerTick);
        cancelPrepareTimeout();
        unregisterNoisyReceiver();
        abandonAudioFocus();
        releaseMediaPlayer();
        if (mediaSession != null) {
            try {
                mediaSession.setActive(false);
                mediaSession.release();
            } catch (Exception ignored) {}
            mediaSession = null;
        }
        latestStateJson = "{\"active\":false,\"isPlaying\":false}";
        emitState();
        super.onDestroy();
    }

    private boolean hasLoadedSource() {
        return !fullSurahUrls.isEmpty() || !playlist.isEmpty();
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager mgr = getSystemService(NotificationManager.class);
            if (mgr != null && mgr.getNotificationChannel(CHANNEL_ID) == null) {
                NotificationChannel ch = new NotificationChannel(
                    CHANNEL_ID,
                    "Qur'on Pleyer / Quran Player",
                    NotificationManager.IMPORTANCE_LOW
                );
                ch.setDescription("Orqa fonda Qur'on tilovati boshqaruvi");
                ch.setShowBadge(false);
                ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
                mgr.createNotificationChannel(ch);
            }
        }
    }

    private void initMediaSession() {
        mediaSession = new MediaSession(this, "NurulQuranMediaSession");
        mediaSession.setCallback(new MediaSession.Callback() {
            @Override
            public void onPlay() {
                resumePlayback();
            }

            @Override
            public void onPause() {
                pausePlayback();
            }

            @Override
            public void onSkipToNext() {
                skipNext();
            }

            @Override
            public void onSkipToPrevious() {
                skipPrev();
            }

            @Override
            public void onSeekTo(long pos) {
                seekToMs(pos);
            }

            @Override
            public void onStop() {
                stopPlaybackAndService();
            }
        });
        mediaSession.setActive(true);
    }

    private void handleLoadAndPlay(String payloadJson) {
        try {
            JSONObject obj = new JSONObject(payloadJson);
            int nextSurahNum = obj.optInt("surahNumber", 1);
            String nextSurahName = obj.optString("surahName", "Nurul Islam");
            String nextReciter = obj.optString("reciterName", "Mishary Rashid Al-Afasy");
            String nextReciterKey = sanitizeReciterKey(obj.optString("reciterKey", "alafasy"));
            String defaultFolder = "dussary".equals(nextReciterKey) ? "Yasser_Ad-Dussary_128kbps" : "Alafasy_128kbps";
            String nextEveryAyahFolder = obj.optString("everyAyahFolder", defaultFolder);
            if (nextEveryAyahFolder == null || nextEveryAyahFolder.trim().isEmpty()) {
                nextEveryAyahFolder = defaultFolder;
            }
            String nextMp3Base = obj.optString("mp3QuranBase", "https://server8.mp3quran.net/afs");
            if (nextMp3Base == null || !nextMp3Base.startsWith("https://")) {
                nextMp3Base = "https://server8.mp3quran.net/afs";
            }
            String nextPrefix = obj.optString("ayahLabelPrefix", "Oyat");
            boolean preferFull = obj.optBoolean("preferFullSurah", false);
            int startAyahNum = obj.optInt("startAyahNumber", 1);
            long offsetMs = obj.optLong("seekOffsetMs", 0L);
            double startFrac = obj.optDouble("startFraction", -1.0);
            int totalAyahs = obj.optInt("totalAyahs", 0);

            JSONArray catArr = obj.optJSONArray("surahCatalog");
            if (catArr != null && catArr.length() >= 114) {
                catalogNames.clear();
                catalogAyahCounts.clear();
                for (int i = 0; i < catArr.length(); i++) {
                    JSONObject cObj = catArr.optJSONObject(i);
                    catalogNames.add(cObj != null ? cObj.optString("name", "Surah " + (i + 1)) : ("Surah " + (i + 1)));
                    catalogAyahCounts.add(cObj != null ? cObj.optInt("ayahs", 0) : 0);
                }
            }

            fullSurahUrls.clear();
            File localFile = getLocalAudioFile(this, nextSurahNum, nextReciterKey);
            if (!preferFull && "dussary".equals(nextReciterKey) && localFile.exists()) {
                // Remove any legacy mp3quran full-Surah cached file so per-ayah Yasser Ad-Dussary always plays cleanly
                localFile.delete();
            }
            if (localFile.exists() && localFile.length() > 10_000L) {
                fullSurahUrls.add(localFile.getAbsolutePath());
            }
            JSONArray fullArr = obj.optJSONArray("fullUrls");
            if (fullArr != null) {
                for (int i = 0; i < fullArr.length(); i++) {
                    String u = fullArr.optString(i, "");
                    if (!u.isEmpty() && !fullSurahUrls.contains(u)) {
                        fullSurahUrls.add(u);
                    }
                }
            }

            playlist.clear();
            JSONArray arr = obj.optJSONArray("ayahs");
            int startIdx = 0;
            if (arr != null) {
                for (int i = 0; i < arr.length(); i++) {
                    JSONObject row = arr.optJSONObject(i);
                    if (row == null) continue;
                    int aNum = row.optInt("ayahNumber", i + 1);
                    JSONArray urlArr = row.optJSONArray("urls");
                    List<String> urls = new ArrayList<>();
                    if (urlArr != null) {
                        for (int u = 0; u < urlArr.length(); u++) {
                            String url = urlArr.optString(u, "");
                            if (!url.isEmpty()) urls.add(url);
                        }
                    }
                    if (!urls.isEmpty()) {
                        if (aNum == startAyahNum) {
                            startIdx = playlist.size();
                        }
                        playlist.add(new AyahItem(aNum, urls));
                    }
                }
            }

            if (fullSurahUrls.isEmpty() && playlist.isEmpty()) return;

            surahNumber = nextSurahNum;
            surahName = nextSurahName;
            reciterName = nextReciter;
            reciterKey = nextReciterKey;
            everyAyahFolder = nextEveryAyahFolder;
            mp3QuranBase = nextMp3Base;
            ayahPrefix = nextPrefix;
            totalAyahsCount = Math.max(totalAyahs, playlist.size());
            currentIndex = startIdx;
            currentCandidateIdx = 0;
            fullSurahCandIdx = 0;
            lastNotifiedAyah = -1;
            pendingSeekMs = Math.max(0L, offsetMs);
            if (startFrac >= 0.0 && startFrac <= 1.0) {
                pendingStartFraction = startFrac;
            } else if (offsetMs <= 0L && !preferFull && startAyahNum > 1 && totalAyahsCount > 1) {
                pendingStartFraction = Math.min(0.95, Math.max(0.0, (double) (startAyahNum - 1) / totalAyahsCount));
            } else {
                pendingStartFraction = -1.0;
            }

            if ((preferFull || playlist.isEmpty()) && !fullSurahUrls.isEmpty()) {
                isFullSurahMode = true;
                playFullSurahCandidate();
            } else {
                isFullSurahMode = false;
                playCurrentAyahIndex();
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to parse audio payload", e);
        }
    }

    private void jumpToAyah(int ayahNumber, double fraction, long offsetMs) {
        if (!hasLoadedSource()) return;

        if (isFullSurahMode && mediaPlayer != null && !isPreparing && currentDurationMs > 0) {
            long targetMs = -1L;
            if (fraction >= 0.0 && fraction <= 1.0) {
                targetMs = Math.round(fraction * currentDurationMs);
            } else if (offsetMs >= 0L) {
                targetMs = offsetMs;
            } else if (totalAyahsCount > 0) {
                targetMs = Math.round(((double) Math.max(0, ayahNumber - 1) / totalAyahsCount) * currentDurationMs);
            }
            if (targetMs >= 0) {
                seekToMs(targetMs);
                if (!isPlaying) resumePlayback();
                return;
            }
        }

        if (isFullSurahMode) {
            pendingStartFraction = (fraction >= 0.0 && fraction <= 1.0) ? fraction : -1.0;
            pendingSeekMs = Math.max(0L, offsetMs);
            playFullSurahCandidate();
            return;
        }

        for (int i = 0; i < playlist.size(); i++) {
            if (playlist.get(i).ayahNumber == ayahNumber) {
                currentIndex = i;
                currentCandidateIdx = 0;
                pendingSeekMs = Math.max(0L, offsetMs);
                playCurrentAyahIndex();
                return;
            }
        }
    }

    private void playFullSurahCandidate() {
        if (fullSurahCandIdx >= fullSurahUrls.size()) {
            // Fall back cleanly to per-ayah playback if every full-Surah mirror failed
            if (!playlist.isEmpty()) {
                isFullSurahMode = false;
                currentCandidateIdx = 0;
                playCurrentAyahIndex();
            } else {
                pausePlayback();
            }
            return;
        }

        if (!requestAudioFocus()) {
            Log.w(TAG, "Audio focus not granted");
        }

        final int token = ++loadToken;
        final String targetSource = fullSurahUrls.get(fullSurahCandIdx);

        mainHandler.removeCallbacks(ayahTrackerTick);
        cancelPrepareTimeout();
        releaseMediaPlayer();
        isPreparing = true;
        isPlaying = true;
        cachedPositionMs = pendingSeekMs;
        currentDurationMs = 0;
        promoteForegroundAndUpdateUI();

        try {
            MediaPlayer mp = new MediaPlayer();
            mp.setWakeMode(getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);
            mp.setAudioAttributes(
                new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .build()
            );
            mp.setDataSource(targetSource);

            mp.setOnPreparedListener(player -> {
                if (token != loadToken || player != mediaPlayer) return;
                cancelPrepareTimeout();
                isPreparing = false;
                try {
                    currentDurationMs = Math.max(0L, player.getDuration());
                    long initialSeek = pendingSeekMs;
                    if (pendingStartFraction > 0.001 && currentDurationMs > 0) {
                        initialSeek = Math.round(pendingStartFraction * currentDurationMs);
                    }
                    pendingStartFraction = -1.0;
                    pendingSeekMs = 0L;
                    if (initialSeek > 0 && currentDurationMs > 0) {
                        long clamped = Math.min(initialSeek, Math.max(0L, currentDurationMs - 200L));
                        player.seekTo((int) clamped);
                    }
                    if (isPlaying) {
                        player.start();
                    }
                    cachedPositionMs = player.getCurrentPosition();
                    lastNotifiedAyah = computeCurrentAyahNumber();
                    promoteForegroundAndUpdateUI();
                    mainHandler.removeCallbacks(ayahTrackerTick);
                    mainHandler.postDelayed(ayahTrackerTick, 500);
                } catch (Exception e) {
                    Log.e(TAG, "Full Surah start error", e);
                }
            });

            mp.setOnCompletionListener(player -> {
                if (token != loadToken || player != mediaPlayer) return;
                cancelPrepareTimeout();
                isPreparing = false;
                isPlaying = false;
                mainHandler.removeCallbacks(ayahTrackerTick);
                cachedPositionMs = 0;
                promoteForegroundAndUpdateUI();
            });

            mp.setOnErrorListener((player, what, extra) -> {
                if (token != loadToken || player != mediaPlayer) return true;
                cancelPrepareTimeout();
                isPreparing = false;
                fullSurahCandIdx += 1;
                playFullSurahCandidate();
                return true;
            });

            mediaPlayer = mp;
            mp.prepareAsync();
            if (targetSource.startsWith("http")) {
                schedulePrepareTimeout(token, true);
            }
        } catch (Exception e) {
            Log.e(TAG, "Full Surah MediaPlayer setup failed", e);
            cancelPrepareTimeout();
            isPreparing = false;
            fullSurahCandIdx += 1;
            playFullSurahCandidate();
        }
    }

    private void playCurrentAyahIndex() {
        if (currentIndex < 0 || currentIndex >= playlist.size()) {
            stopPlaybackAndService();
            return;
        }
        AyahItem item = playlist.get(currentIndex);
        if (currentCandidateIdx >= item.urls.size()) {
            if (currentIndex + 1 < playlist.size()) {
                currentIndex += 1;
                currentCandidateIdx = 0;
                pendingSeekMs = 0L;
                playCurrentAyahIndex();
            } else {
                pausePlayback();
            }
            return;
        }

        if (!requestAudioFocus()) {
            Log.w(TAG, "Audio focus not granted");
        }

        final int token = ++loadToken;
        File localAyahFile = getLocalAyahFile(this, surahNumber, item.ayahNumber, reciterKey);
        final boolean useLocalAyah =
            currentCandidateIdx == 0 && localAyahFile.exists() && localAyahFile.length() > 1_000L;
        final String targetUrl = useLocalAyah
            ? localAyahFile.getAbsolutePath()
            : item.urls.get(currentCandidateIdx);

        mainHandler.removeCallbacks(ayahTrackerTick);
        cancelPrepareTimeout();
        releaseMediaPlayer();
        isPreparing = true;
        isPlaying = true;
        cachedPositionMs = pendingSeekMs;
        currentDurationMs = 0;
        promoteForegroundAndUpdateUI();

        try {
            MediaPlayer mp = new MediaPlayer();
            mp.setWakeMode(getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);
            mp.setAudioAttributes(
                new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .build()
            );
            mp.setDataSource(targetUrl);

            mp.setOnPreparedListener(player -> {
                if (token != loadToken || player != mediaPlayer) return;
                cancelPrepareTimeout();
                isPreparing = false;
                try {
                    currentDurationMs = Math.max(0, player.getDuration());
                    if (pendingSeekMs > 0 && (currentDurationMs == 0 || pendingSeekMs < currentDurationMs - 150)) {
                        player.seekTo((int) pendingSeekMs);
                    }
                    pendingSeekMs = 0L;
                    if (isPlaying) {
                        player.start();
                    }
                    cachedPositionMs = player.getCurrentPosition();
                    promoteForegroundAndUpdateUI();
                    preloadNextAyah(token);
                } catch (Exception e) {
                    Log.e(TAG, "Start error", e);
                }
            });

            attachAyahCompletionAndError(mp, token);

            mediaPlayer = mp;
            mp.prepareAsync();
            if (!useLocalAyah) {
                schedulePrepareTimeout(token, false);
            }
        } catch (Exception e) {
            Log.e(TAG, "MediaPlayer setup failed", e);
            cancelPrepareTimeout();
            isPreparing = false;
            currentCandidateIdx += 1;
            playCurrentAyahIndex();
        }
    }

    private void attachAyahCompletionAndError(MediaPlayer mp, final int token) {
        mp.setOnCompletionListener(player -> {
            if (token != loadToken || player != mediaPlayer) return;
            cancelPrepareTimeout();
            isPreparing = false;
            if (nextPlayerPrepared && nextMediaPlayer != null && nextPreparedIndex == currentIndex + 1) {
                MediaPlayer old = mediaPlayer;
                MediaPlayer promoted = nextMediaPlayer;
                nextMediaPlayer = null;
                nextPlayerPrepared = false;
                nextPreparedIndex = -1;
                currentIndex += 1;
                currentCandidateIdx = 0;
                pendingSeekMs = 0L;
                mediaPlayer = promoted;
                try {
                    currentDurationMs = Math.max(0, promoted.getDuration());
                    cachedPositionMs = promoted.getCurrentPosition();
                } catch (Exception ignored) {
                    currentDurationMs = 0;
                    cachedPositionMs = 0;
                }
                if (old != null) {
                    try { old.reset(); old.release(); } catch (Exception ignored) {}
                }
                attachAyahCompletionAndError(promoted, token);
                promoteForegroundAndUpdateUI();
                preloadNextAyah(token);
                return;
            }
            if (currentIndex + 1 < playlist.size()) {
                currentIndex += 1;
                currentCandidateIdx = 0;
                pendingSeekMs = 0L;
                playCurrentAyahIndex();
            } else {
                isPlaying = false;
                cachedPositionMs = 0;
                currentIndex = 0;
                promoteForegroundAndUpdateUI();
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    stopForeground(STOP_FOREGROUND_DETACH);
                } else {
                    stopForeground(false);
                }
            }
        });

        mp.setOnErrorListener((player, what, extra) -> {
            if (token != loadToken || player != mediaPlayer) return true;
            cancelPrepareTimeout();
            isPreparing = false;
            currentCandidateIdx += 1;
            playCurrentAyahIndex();
            return true;
        });
    }

    private void preloadNextAyah(final int token) {
        releaseNextMediaPlayer();
        final int nextIdx = currentIndex + 1;
        if (nextIdx >= playlist.size() || mediaPlayer == null) return;
        AyahItem nextItem = playlist.get(nextIdx);
        if (nextItem.urls.isEmpty()) return;
        try {
            final MediaPlayer nmp = new MediaPlayer();
            nmp.setWakeMode(getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);
            nmp.setAudioAttributes(
                new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .build()
            );
            File nextLocal = getLocalAyahFile(this, surahNumber, nextItem.ayahNumber, reciterKey);
            String nextSource = (nextLocal.exists() && nextLocal.length() > 1_000L)
                ? nextLocal.getAbsolutePath()
                : nextItem.urls.get(0);
            nmp.setDataSource(nextSource);
            nmp.setOnPreparedListener(prepared -> {
                if (token != loadToken || mediaPlayer == null || nextMediaPlayer != prepared) {
                    try { prepared.reset(); prepared.release(); } catch (Exception ignored) {}
                    return;
                }
                try {
                    mediaPlayer.setNextMediaPlayer(prepared);
                    nextPlayerPrepared = true;
                    nextPreparedIndex = nextIdx;
                } catch (Exception e) {
                    releaseNextMediaPlayer();
                }
            });
            nmp.setOnErrorListener((p, w, e) -> {
                releaseNextMediaPlayer();
                return true;
            });
            nextMediaPlayer = nmp;
            nmp.prepareAsync();
        } catch (Exception ignored) {
            releaseNextMediaPlayer();
        }
    }

    private void schedulePrepareTimeout(final int token, final boolean fullMode) {
        cancelPrepareTimeout();
        activePrepareTimeout = () -> {
            if (token != loadToken || !isPreparing) return;
            Log.w(TAG, "Stream prepare timed out, switching candidate");
            isPreparing = false;
            if (fullMode) {
                fullSurahCandIdx += 1;
                playFullSurahCandidate();
            } else {
                currentCandidateIdx += 1;
                playCurrentAyahIndex();
            }
        };
        mainHandler.postDelayed(activePrepareTimeout, 5500);
    }

    private void cancelPrepareTimeout() {
        if (activePrepareTimeout != null) {
            mainHandler.removeCallbacks(activePrepareTimeout);
            activePrepareTimeout = null;
        }
    }

    private void releaseNextMediaPlayer() {
        nextPlayerPrepared = false;
        nextPreparedIndex = -1;
        if (nextMediaPlayer != null) {
            try { nextMediaPlayer.reset(); nextMediaPlayer.release(); } catch (Exception ignored) {}
            nextMediaPlayer = null;
        }
    }

    private void resumePlayback() {
        if (!hasLoadedSource()) return;
        if (!requestAudioFocus()) {
            Log.w(TAG, "Audio focus not granted on resume");
        }
        if (mediaPlayer != null && !isPreparing) {
            try {
                if (!mediaPlayer.isPlaying()) {
                    mediaPlayer.start();
                }
                isPlaying = true;
                promoteForegroundAndUpdateUI();
                if (isFullSurahMode) {
                    mainHandler.removeCallbacks(ayahTrackerTick);
                    mainHandler.postDelayed(ayahTrackerTick, 1500);
                }
                return;
            } catch (Exception e) {
                Log.w(TAG, "Resume failed, reloading", e);
            }
        }
        isPlaying = true;
        if (isFullSurahMode) {
            playFullSurahCandidate();
        } else {
            playCurrentAyahIndex();
        }
    }

    private void pausePlayback() {
        mainHandler.removeCallbacks(ayahTrackerTick);
        if (mediaPlayer != null && !isPreparing) {
            try {
                cachedPositionMs = mediaPlayer.getCurrentPosition();
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.pause();
                }
            } catch (Exception ignored) {}
        }
        isPlaying = false;
        // Keep foreground service attached so Android does NOT kill the notification player after 30s
        promoteForegroundAndUpdateUI();
    }

    private void switchSurahByDelta(int delta) {
        if (surahNumber <= 0) return;
        int nextSurah = Math.max(1, Math.min(114, surahNumber + delta));
        if (nextSurah == surahNumber) {
            seekToMs(0);
            return;
        }
        surahNumber = nextSurah;
        if (nextSurah - 1 < catalogNames.size()) {
            surahName = catalogNames.get(nextSurah - 1);
        } else {
            surahName = "Surah " + nextSurah;
        }
        if (nextSurah - 1 < catalogAyahCounts.size() && catalogAyahCounts.get(nextSurah - 1) > 0) {
            totalAyahsCount = catalogAyahCounts.get(nextSurah - 1);
        } else {
            totalAyahsCount = 7;
        }

        String pad3 = String.format(java.util.Locale.US, "%03d", nextSurah);
        String folder = (everyAyahFolder != null && !everyAyahFolder.trim().isEmpty())
            ? everyAyahFolder.trim()
            : ("dussary".equals(reciterKey) ? "Yasser_Ad-Dussary_128kbps" : "Alafasy_128kbps");

        playlist.clear();
        for (int a = 1; a <= totalAyahsCount; a++) {
            String aPad3 = String.format(java.util.Locale.US, "%03d", a);
            List<String> urls = new ArrayList<>();
            urls.add("https://everyayah.com/data/" + folder + "/" + pad3 + aPad3 + ".mp3");
            if ("alafasy".equals(reciterKey)) {
                urls.add("https://audio.qurancdn.com/Alafasy/mp3/" + pad3 + aPad3 + ".mp3");
            }
            playlist.add(new AyahItem(a, urls));
        }

        fullSurahUrls.clear();
        File localFile = getLocalAudioFile(this, nextSurah, reciterKey);
        if (localFile.exists() && localFile.length() > 10_000L) {
            fullSurahUrls.add(localFile.getAbsolutePath());
        }
        String base = (mp3QuranBase != null && mp3QuranBase.startsWith("https://"))
            ? mp3QuranBase
            : ("dussary".equals(reciterKey)
                ? "https://download.quranicaudio.com/quran/yasser_ad-dussary"
                : "https://server8.mp3quran.net/afs");
        fullSurahUrls.add(base + "/" + pad3 + ".mp3");
        if ("alafasy".equals(reciterKey)) {
            fullSurahUrls.add("https://cdn.mp3quran.net/audio/mishary-alafasy/r1/" + pad3 + ".mp3");
            fullSurahUrls.add("https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/" + nextSurah + ".mp3");
        }

        currentIndex = 0;
        currentCandidateIdx = 0;
        fullSurahCandIdx = 0;
        pendingSeekMs = 0L;
        pendingStartFraction = -1.0;
        lastNotifiedAyah = -1;
        isFullSurahMode = false;
        playCurrentAyahIndex();
    }

    private void skipNext() {
        if (!hasLoadedSource()) return;
        switchSurahByDelta(1);
    }

    private void skipPrev() {
        if (!hasLoadedSource()) return;
        if (safePos() > 4000 && surahNumber <= 1) {
            seekToMs(0);
            return;
        }
        switchSurahByDelta(-1);
    }

    private void seekToMs(long ms) {
        long clamped = Math.max(0L, ms);
        if (mediaPlayer != null && !isPreparing) {
            try {
                int dur = mediaPlayer.getDuration();
                if (dur > 0) {
                    currentDurationMs = dur;
                    clamped = Math.min(clamped, Math.max(0, dur - 150));
                }
                mediaPlayer.seekTo((int) clamped);
                cachedPositionMs = clamped;
                promoteForegroundAndUpdateUI();
                return;
            } catch (Exception ignored) {}
        }
        pendingSeekMs = clamped;
        cachedPositionMs = clamped;
        emitState();
    }

    private void ensureForegroundThenStop() {
        Notification fallback = buildNotification();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                NOTIFICATION_ID,
                fallback,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
            );
        } else {
            startForeground(NOTIFICATION_ID, fallback);
        }
        stopPlaybackAndService();
    }

    private void stopPlaybackAndService() {
        loadToken += 1;
        mainHandler.removeCallbacks(ayahTrackerTick);
        cancelPrepareTimeout();
        isPlaying = false;
        isPreparing = false;
        fullSurahUrls.clear();
        playlist.clear();
        releaseMediaPlayer();
        abandonAudioFocus();
        latestStateJson = "{\"active\":false,\"isPlaying\":false}";
        emitState();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_REMOVE);
        } else {
            stopForeground(true);
        }
        stopSelf();
    }

    private int computeCurrentAyahNumber() {
        if (isFullSurahMode) {
            if (totalAyahsCount <= 1 || currentDurationMs <= 0) return 1;
            double frac = Math.min(0.9999, Math.max(0.0, (double) safePos() / currentDurationMs));
            return Math.min(totalAyahsCount, Math.max(1, 1 + (int) Math.floor(frac * totalAyahsCount)));
        }
        if (currentIndex >= 0 && currentIndex < playlist.size()) {
            return playlist.get(currentIndex).ayahNumber;
        }
        return 1;
    }

    private void promoteForegroundAndUpdateUI() {
        updateMediaSessionState();
        Notification notif = buildNotification();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                NOTIFICATION_ID,
                notif,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
            );
        } else {
            startForeground(NOTIFICATION_ID, notif);
        }
        emitState();
    }

    private void updateMediaSessionState() {
        if (mediaSession == null) return;
        int ayahNum = computeCurrentAyahNumber();
        String title = totalAyahsCount > 0
            ? (surahName + " · " + ayahPrefix + " " + ayahNum + "/" + totalAyahsCount)
            : surahName;

        MediaMetadata.Builder meta = new MediaMetadata.Builder()
            .putString(MediaMetadata.METADATA_KEY_TITLE, title)
            .putString(MediaMetadata.METADATA_KEY_ARTIST, reciterName)
            .putString(MediaMetadata.METADATA_KEY_ALBUM, "Nurul Islam")
            .putLong(MediaMetadata.METADATA_KEY_DURATION, currentDurationMs);
        if (largeIconBitmap != null) {
            meta.putBitmap(MediaMetadata.METADATA_KEY_ART, largeIconBitmap);
        }
        mediaSession.setMetadata(meta.build());

        long pos = safePos();
        int state = isPreparing
            ? PlaybackState.STATE_BUFFERING
            : (isPlaying ? PlaybackState.STATE_PLAYING : PlaybackState.STATE_PAUSED);
        long actions =
            PlaybackState.ACTION_PLAY |
            PlaybackState.ACTION_PAUSE |
            PlaybackState.ACTION_PLAY_PAUSE |
            PlaybackState.ACTION_SKIP_TO_NEXT |
            PlaybackState.ACTION_SKIP_TO_PREVIOUS |
            PlaybackState.ACTION_SEEK_TO |
            PlaybackState.ACTION_STOP;

        mediaSession.setPlaybackState(
            new PlaybackState.Builder()
                .setActions(actions)
                .setState(state, pos, isPlaying ? 1.0f : 0.0f)
                .build()
        );
    }

    private Notification buildNotification() {
        int ayahNum = computeCurrentAyahNumber();
        String title = surahName;
        String subtitle = totalAyahsCount > 0
            ? (ayahPrefix + " " + ayahNum + "/" + totalAyahsCount + " · " + reciterName)
            : reciterName;

        Intent openIntent = new Intent(this, MainActivity.class);
        openIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        openIntent.putExtra(EXTRA_OPEN_SURAH, surahNumber);
        openIntent.putExtra(EXTRA_OPEN_AYAH, ayahNum);
        PendingIntent contentPending = PendingIntent.getActivity(
            this,
            4100,
            openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        PendingIntent prevPending = servicePendingIntent(ACTION_PREV, 4101, true);
        PendingIntent togglePending = servicePendingIntent(ACTION_TOGGLE, 4102, true);
        PendingIntent nextPending = servicePendingIntent(ACTION_NEXT, 4103, true);
        PendingIntent stopPending = servicePendingIntent(ACTION_STOP, 4104, false);

        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? new Notification.Builder(this, CHANNEL_ID)
            : new Notification.Builder(this);

        builder
            .setSmallIcon(R.drawable.ic_stat_quran)
            .setColor(0xFF0B553F)
            .setContentTitle(title)
            .setContentText(subtitle)
            .setContentIntent(contentPending)
            .setDeleteIntent(stopPending)
            .setVisibility(Notification.VISIBILITY_PUBLIC)
            .setOngoing(isPlaying || isPreparing)
            .setOnlyAlertOnce(true)
            .addAction(new Notification.Action.Builder(R.drawable.ic_media_prev, "Prev", prevPending).build())
            .addAction(new Notification.Action.Builder(
                isPlaying ? R.drawable.ic_media_pause : R.drawable.ic_media_play,
                isPlaying ? "Pause" : "Play",
                togglePending
            ).build())
            .addAction(new Notification.Action.Builder(R.drawable.ic_media_next, "Next", nextPending).build())
            .addAction(new Notification.Action.Builder(R.drawable.ic_media_close, "Close", stopPending).build());

        if (largeIconBitmap != null) {
            builder.setLargeIcon(largeIconBitmap);
        }

        if (mediaSession != null) {
            builder.setStyle(
                new Notification.MediaStyle()
                    .setMediaSession(mediaSession.getSessionToken())
                    .setShowActionsInCompactView(0, 1, 2)
            );
        }

        return builder.build();
    }

    private PendingIntent servicePendingIntent(String action, int reqCode, boolean useForeground) {
        Intent i = new Intent(this, QuranAudioService.class);
        i.setAction(action);
        if (useForeground && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return PendingIntent.getForegroundService(
                this,
                reqCode,
                i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
        }
        return PendingIntent.getService(
            this,
            reqCode,
            i,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    private long safePos() {
        if (mediaPlayer != null && !isPreparing) {
            try {
                return Math.max(0, mediaPlayer.getCurrentPosition());
            } catch (Exception ignored) {}
        }
        return cachedPositionMs;
    }

    private void releaseMediaPlayer() {
        releaseNextMediaPlayer();
        if (mediaPlayer != null) {
            try {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
            } catch (Exception ignored) {}
            try {
                mediaPlayer.reset();
                mediaPlayer.release();
            } catch (Exception ignored) {}
            mediaPlayer = null;
        }
    }

    private boolean requestAudioFocus() {
        if (audioManager == null) return true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (audioFocusRequest == null) {
                audioFocusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
                    .setAudioAttributes(
                        new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_MEDIA)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                            .build()
                    )
                    .setOnAudioFocusChangeListener(focusChangeListener)
                    .build();
            }
            return audioManager.requestAudioFocus(audioFocusRequest) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
        }
        return audioManager.requestAudioFocus(
            focusChangeListener,
            AudioManager.STREAM_MUSIC,
            AudioManager.AUDIOFOCUS_GAIN
        ) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
    }

    private void abandonAudioFocus() {
        if (audioManager == null) return;
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && audioFocusRequest != null) {
                audioManager.abandonAudioFocusRequest(audioFocusRequest);
            } else {
                audioManager.abandonAudioFocus(focusChangeListener);
            }
        } catch (Exception ignored) {}
    }

    private void registerNoisyReceiver() {
        if (noisyReceiverRegistered) return;
        try {
            IntentFilter filter = new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                registerReceiver(noisyReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
            } else {
                registerReceiver(noisyReceiver, filter);
            }
            noisyReceiverRegistered = true;
        } catch (Exception ignored) {}
    }

    private void unregisterNoisyReceiver() {
        if (!noisyReceiverRegistered) return;
        try {
            unregisterReceiver(noisyReceiver);
        } catch (Exception ignored) {}
        noisyReceiverRegistered = false;
    }

    public String buildStateJson() {
        try {
            boolean hasActive = hasLoadedSource() && surahNumber > 0;
            JSONObject obj = new JSONObject();
            obj.put("active", hasActive);
            obj.put("surahNumber", surahNumber);
            obj.put("surahName", surahName);
            obj.put("reciterName", reciterName);
            obj.put("reciterKey", reciterKey);
            obj.put("fullSurahMode", isFullSurahMode);
            obj.put("ayahNumber", computeCurrentAyahNumber());
            obj.put("totalAyahs", totalAyahsCount);
            obj.put("isPlaying", isPlaying);
            obj.put("isPreparing", isPreparing);
            obj.put("positionMs", safePos());
            obj.put("durationMs", currentDurationMs);
            return obj.toString();
        } catch (Exception e) {
            return "{\"active\":false,\"isPlaying\":false}";
        }
    }

    private void emitState() {
        String state = buildStateJson();
        latestStateJson = state;
        StateListener listener = stateListener;
        if (listener != null) {
            listener.onAudioStateChanged(state);
        }
    }
}
